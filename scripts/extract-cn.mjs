import fs from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';

let OLD_DIR = path.resolve('old-site');
if (
  !fs.existsSync(path.join(OLD_DIR, 'index.html')) &&
  fs.existsSync(path.join(OLD_DIR, 'www.hssolar.cn', 'index.html'))
) {
  OLD_DIR = path.join(OLD_DIR, 'www.hssolar.cn');
}

const PUBLIC_DIR = path.resolve('public');
const OUT_PRODUCTS = path.resolve('src/content/products');
const OUT_NEWS = path.resolve('src/content/news');
const OUT_PAGES = path.resolve('src/content/pages');

const CASE_IDS = new Set([1, 2, 3, 11]);
const SOLUTION_IDS = new Set([4, 5]);
const KNOWLEDGE_IDS = new Set([8, 9]);
const DEFAULT_NEWS_IMG = '/Public/theme/default/image/news.jpg';

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
};

const escapeYaml = (str = '') =>
  `"${String(str).replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\s+/g, ' ').trim()}"`;

function normalizePath(p = '') {
  let s = String(p).trim();
  if (!s || s === '#' || s.startsWith('javascript:') || s.startsWith('data:')) return '';
  if (/^https?:\/\//i.test(s)) return s;
  const extMatch = s.match(/^(?:\.\.\/)+([a-z0-9.-]+\.[a-z]{2,}\/.*)$/i);
  if (extMatch) return `https://${extMatch[1]}`;
  s = s.replace(/^(\.\.\/|\.\/)+/, '');
  s = '/' + s.replace(/^\/+/, '');
  return s;
}

function extractDateStr(text = '') {
  const m = String(text).match(/\d{4}-\d{2}-\d{2}(?:\s+\d{2}:\d{2}:\d{2})?/);
  return m ? m[0] : '';
}

function cleanDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
  for (const f of fs.readdirSync(dir)) {
    if (f.endsWith('.md')) fs.unlinkSync(path.join(dir, f));
  }
}

// 外链图片自动本地化（转存到 public/Uploads/images/external/ 并改写为本站路径）
let autoDownloadedExt = 0;
let copiedLocalExt = 0;
const failedExternalImages = new Map(); // url -> { localWebPath, diskPath, sourceFile }

async function localizeExternalUrl(externalUrl, rawSrc, sourceFile) {
  let baseName = '';
  try {
    baseName = path.basename(new URL(externalUrl).pathname);
  } catch {
    return externalUrl;
  }
  if (!baseName) return externalUrl;

  const localWebPath = `/Uploads/images/external/${baseName}`;
  const diskPath = path.join(PUBLIC_DIR, 'Uploads', 'images', 'external', baseName);

  // 1) 本地已存在直接复用
  if (fs.existsSync(diskPath)) return localWebPath;

  // 2) 检查 HTTrack 镜像是否已附带下载在相邻目录
  const httrackLocal = path.resolve(OLD_DIR, rawSrc);
  if (fs.existsSync(httrackLocal) && fs.statSync(httrackLocal).isFile()) {
    fs.mkdirSync(path.dirname(diskPath), { recursive: true });
    fs.copyFileSync(httrackLocal, diskPath);
    copiedLocalExt++;
    return localWebPath;
  }

  // 3) 自动从原外链下载到本地
  try {
    const res = await fetch(externalUrl, {
      headers: HEADERS,
      redirect: 'follow',
      signal: AbortSignal.timeout(10000),
    });
    const ct = res.headers.get('content-type') || '';
    if (res.ok && ct.includes('image')) {
      fs.mkdirSync(path.dirname(diskPath), { recursive: true });
      fs.writeFileSync(diskPath, Buffer.from(await res.arrayBuffer()));
      autoDownloadedExt++;
      return localWebPath;
    }
  } catch {}

  // 下载失败仍改成本站链接，并记录清单供手动保存
  if (!failedExternalImages.has(externalUrl)) {
    failedExternalImages.set(externalUrl, { localWebPath, diskPath, sourceFile });
  }
  return localWebPath;
}

async function localizeBodyImages($, bodyEl, sourceFile) {
  let firstImg = '';
  if (!bodyEl || !bodyEl.length) return firstImg;
  const imgs = bodyEl.find('img').toArray();
  for (const img of imgs) {
    const raw = ($(img).attr('src') || '').trim();
    const norm = normalizePath(raw);
    if (!norm) continue;
    let finalSrc = norm;
    if (/^https?:\/\//i.test(norm)) {
      finalSrc = await localizeExternalUrl(norm, raw, sourceFile);
    }
    $(img).attr('src', finalSrc);
    if (!firstImg) firstImg = finalSrc;
  }
  return firstImg;
}

console.log(`读取中文旧站目录: ${OLD_DIR}`);
cleanDir(OUT_PRODUCTS);
cleanDir(OUT_NEWS);
cleanDir(OUT_PAGES);

// =======================================================
// 1. 扫描产品分类归属、热门标记、标签归属
// =======================================================
const prodCatsMap = new Map();
const prodTagsMap = new Map();
const hotProdIds = new Set();
const TAG_NAMES = { 5: '800W', 6: '700W', 7: '太阳能电池组件' };

const indexPath = path.join(OLD_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  const $i = cheerio.load(fs.readFileSync(indexPath, 'utf8'));
  $i('.cat_content a[href*="product-detail-"]').each((_, a) => {
    const m = ($i(a).attr('href') || '').match(/product-detail-(\d+)\.html/);
    if (m) hotProdIds.add(Number(m[1]));
  });
}

for (let cid = 1; cid <= 30; cid++) {
  const f = path.join(OLD_DIR, `category-${cid}.html`);
  if (!fs.existsSync(f)) continue;
  const $c = cheerio.load(fs.readFileSync(f, 'utf8'));
  $c('.products a[href*="product-detail-"]').each((_, a) => {
    const m = ($c(a).attr('href') || '').match(/product-detail-(\d+)\.html/);
    if (!m) return;
    const pid = Number(m[1]);
    if (pid === 7) return;
    if (!prodCatsMap.has(pid)) prodCatsMap.set(pid, new Set());
    prodCatsMap.get(pid).add(cid);
  });
}

for (const tid of [5, 6, 7]) {
  const f = path.join(OLD_DIR, `category-tags-${tid}.html`);
  if (!fs.existsSync(f)) continue;
  const $t = cheerio.load(fs.readFileSync(f, 'utf8'));
  $t('.products a[href*="product-detail-"]').each((_, a) => {
    const m = ($t(a).attr('href') || '').match(/product-detail-(\d+)\.html/);
    if (!m) return;
    const pid = Number(m[1]);
    if (pid === 7) return;
    if (!prodTagsMap.has(pid)) prodTagsMap.set(pid, new Set());
    prodTagsMap.get(pid).add(TAG_NAMES[tid]);
  });
}

// =======================================================
// 2. 提取产品详情页
// =======================================================
const prodFiles = fs
  .readdirSync(OLD_DIR)
  .filter((f) => /^product-detail-(\d+)\.html$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

let prodCount = 0;
for (const file of prodFiles) {
  const id = Number(file.match(/^product-detail-(\d+)\.html$/)[1]);
  const html = fs.readFileSync(path.join(OLD_DIR, file), 'utf8');
  const $ = cheerio.load(html);

  const seoTitle = $('title').text().trim();
  const title = $('.pro_main_title').first().text().trim();
  if (seoTitle === '404' || !title) continue;

  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const summary = $('.pro_main_text').first().text().trim() || description;

  const gallery = [];
  for (const img of $('#pro_img_gallery img').toArray()) {
    const raw = ($(img).attr('src') || '').trim();
    let src = normalizePath(raw);
    if (src && /^https?:\/\//i.test(src)) {
      src = await localizeExternalUrl(src, raw, file);
    }
    if (src && !gallery.includes(src)) gallery.push(src);
  }
  const mainImg = gallery[0] || '/Public/theme/default/picture/product.jpg';

  const specs = [];
  $('.pro_table ul li').each((_, li) => {
    const label = $(li).find('p').text().replace(/[：:]\s*$/, '').trim();
    const value = $(li).find('span').text().trim();
    if (label && value) specs.push({ label, value });
  });

  const crumbHref = $('.mbx a[href*="category-"]').first().attr('href') || '';
  const crumbCatMatch = crumbHref.match(/category-(\d+)\.html/);
  const catSet = prodCatsMap.get(id) || new Set();
  if (crumbCatMatch) catSet.add(Number(crumbCatMatch[1]));
  if (catSet.size === 0) catSet.add(1);
  const categoryIds = [...catSet].sort((a, b) => a - b);

  const tags = [...(prodTagsMap.get(id) || new Set())];

  const bodyEl = $('#about01').first();
  await localizeBodyImages($, bodyEl, file);
  const bodyHtml = bodyEl.length ? bodyEl.html().trim() : '';

  const galleryYaml = gallery.length
    ? `gallery:\n${gallery.map((g) => `  - ${escapeYaml(g)}`).join('\n')}`
    : '';
  const specsYaml = specs.length
    ? `specs:\n${specs
        .map((s) => `  - label: ${escapeYaml(s.label)}\n    value: ${escapeYaml(s.value)}`)
        .join('\n')}`
    : '';

  const md = `---
id: ${id}
title: ${escapeYaml(title)}
categoryIds: [${categoryIds.join(', ')}]
tags: [${tags.map(escapeYaml).join(', ')}]
isHot: ${hotProdIds.has(id)}
image: ${escapeYaml(mainImg)}
${galleryYaml}
summary: ${escapeYaml(summary)}
${specsYaml}
seoTitle: ${escapeYaml(seoTitle)}
description: ${escapeYaml(description)}
keywords: ${escapeYaml(keywords)}
---

${bodyHtml}
`;

  fs.writeFileSync(path.join(OUT_PRODUCTS, `product-${id}.md`), md, 'utf8');
  prodCount++;
}
console.log(`✅ 已提取中文产品: ${prodCount} 款`);

// =======================================================
// 3. 汇总新闻/案例/方案/知识的封面图、日期和摘要
// =======================================================
const metaMap = new Map();
function mergeMeta(id, patch) {
  const cur = metaMap.get(id) || {};
  metaMap.set(id, {
    date: cur.date || patch.date || '',
    image: cur.image || patch.image || '',
    summary: cur.summary || patch.summary || '',
  });
}

const listHtmlFiles = [
  path.join(OLD_DIR, 'project.html'),
  path.join(OLD_DIR, 'news.html'),
  path.join(OLD_DIR, 'news-list-3.html'),
];
const newsSubDir = path.join(OLD_DIR, 'News');
if (fs.existsSync(newsSubDir)) {
  for (const f of fs.readdirSync(newsSubDir)) {
    if (f.endsWith('.html')) listHtmlFiles.push(path.join(newsSubDir, f));
  }
}

for (const lf of listHtmlFiles) {
  if (!fs.existsSync(lf)) continue;
  const $l = cheerio.load(fs.readFileSync(lf, 'utf8'));
  const isProjectPage = path.basename(lf) === 'project.html';

  $l('.news ul li').each((_, li) => {
    const href = $l(li).find('a[href*="news-"]').first().attr('href') || '';
    const m = href.match(/news-(\d+)\.html/);
    if (!m) return;
    const id = Number(m[1]);
    if (isProjectPage) CASE_IDS.add(id);
    mergeMeta(id, {
      date: extractDateStr($l(li).find('.day').text()),
      image: normalizePath($l(li).find('img').first().attr('src') || ''),
      summary: $l(li).find('.text p').first().text().trim(),
    });
  });
}

if (fs.existsSync(indexPath)) {
  const $i = cheerio.load(fs.readFileSync(indexPath, 'utf8'));
  $i('.case_content .moudle, .solution_content li, .study_list li, .news_content .moudle').each(
    (_, el) => {
      const href = $i(el).find('a[href*="news-"]').first().attr('href') || '';
      const m = href.match(/news-(\d+)\.html/);
      if (!m) return;
      const id = Number(m[1]);
      mergeMeta(id, {
        date: extractDateStr($i(el).find('.date').text()),
        image: normalizePath($i(el).find('img').first().attr('src') || ''),
        summary: $i(el).find('.text').first().text().trim(),
      });
    }
  );
}

// =======================================================
// 4. 提取所有 news-*.html
// =======================================================
const newsFiles = fs
  .readdirSync(OLD_DIR)
  .filter((f) => /^news-(\d+)\.html$/.test(f))
  .sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));

let newsCount = 0;
let coveredCount = 0;

for (const file of newsFiles) {
  const id = Number(file.match(/^news-(\d+)\.html$/)[1]);
  const html = fs.readFileSync(path.join(OLD_DIR, file), 'utf8');
  const $ = cheerio.load(html);

  const seoTitle = $('title').text().trim();
  if (seoTitle === '404') continue;

  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const title =
    $('.blog_main h1').first().text().trim() ||
    $('h1').not('header h1').first().text().trim() ||
    seoTitle.split('-')[0].trim();

  const detailDate = extractDateStr($('.blog-info, .day, .date').first().text());
  const meta = metaMap.get(id) || {};
  const finalDate = detailDate || meta.date || '2025-01-01';

  const bodyEl = $('.blog_p').first().length
    ? $('.blog_p').first()
    : $('.phone').first();

  const bodyFirstImg = await localizeBodyImages($, bodyEl, file);
  const bodyHtml = bodyEl.length ? bodyEl.html().trim() : '';

  const finalImage = meta.image || bodyFirstImg || DEFAULT_NEWS_IMG;
  if (finalImage !== DEFAULT_NEWS_IMG) coveredCount++;

  let type = 'news';
  if (CASE_IDS.has(id)) type = 'case';
  else if (SOLUTION_IDS.has(id)) type = 'solution';
  else if (KNOWLEDGE_IDS.has(id)) type = 'knowledge';

  const summary = meta.summary || description || title;

  const md = `---
id: ${id}
type: ${escapeYaml(type)}
title: ${escapeYaml(title)}
date: ${escapeYaml(finalDate)}
image: ${escapeYaml(finalImage)}
summary: ${escapeYaml(summary)}
seoTitle: ${escapeYaml(seoTitle)}
description: ${escapeYaml(description)}
keywords: ${escapeYaml(keywords)}
---

${bodyHtml}
`;

  fs.writeFileSync(path.join(OUT_NEWS, `news-${id}.md`), md, 'utf8');
  newsCount++;
}
console.log(`✅ 已提取新闻/案例/方案/知识: ${newsCount} 篇（其中自带独立封面图 ${coveredCount} 篇）`);

// =======================================================
// 5. 提取 4 个独立单页
// =======================================================
const singleSlugs = [
  'about-us',
  'why-we-different',
  'technical-services',
  'privacy-policy',
];

let pageCount = 0;
for (const slug of singleSlugs) {
  const f = path.join(OLD_DIR, `${slug}.html`);
  if (!fs.existsSync(f)) continue;
  const $ = cheerio.load(fs.readFileSync(f, 'utf8'));

  const seoTitle = $('title').text().trim();
  const title = $('.mbx_section .maintitle').first().text().trim() || seoTitle.split('-')[0].trim();
  const description = $('meta[name="description"]').attr('content') || '';
  const keywords = $('meta[name="keywords"]').attr('content') || '';
  const bannerImg = normalizePath($('.inner_banner img').first().attr('src') || '');

  const bodyEl = $('.about.page, .page.phone, .n_main .phone').first();
  await localizeBodyImages($, bodyEl, `${slug}.html`);
  const bodyHtml = bodyEl.length ? bodyEl.html().trim() : '';

  const md = `---
title: ${escapeYaml(title)}
${bannerImg ? `bannerImg: ${escapeYaml(bannerImg)}` : ''}
seoTitle: ${escapeYaml(seoTitle)}
description: ${escapeYaml(description)}
keywords: ${escapeYaml(keywords)}
---

${bodyHtml}
`;

  fs.writeFileSync(path.join(OUT_PAGES, `${slug}.md`), md, 'utf8');
  pageCount++;
}
console.log(`✅ 已提取独立单页: ${pageCount} 篇`);

// =======================================================
// 6. 外链图片本地化与本地图片体检报告
// =======================================================
console.log('\n=== 外链图片本地化汇总 ===');
console.log(`- 自动联网下载到 public/Uploads/images/external/：${autoDownloadedExt} 张`);
console.log(`- 从本地 HTTrack 目录直接复制：${copiedLocalExt} 张`);

if (failedExternalImages.size > 0) {
  console.log(`⚠️ 有 ${failedExternalImages.size} 张外链图片自动下载失败，请按以下清单手动保存：`);
  for (const [url, info] of failedExternalImages.entries()) {
    console.log(`  原链接: ${url}`);
    console.log(`  保存到: ${info.diskPath}  (来源: ${info.sourceFile})`);
  }
}

console.log('\n=== 中文站图片资产体检 ===');
const missing = new Set();
for (const dir of [OUT_PRODUCTS, OUT_NEWS, OUT_PAGES]) {
  for (const f of fs.readdirSync(dir)) {
    const txt = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of txt.matchAll(/\/(Uploads|Public)\/[^"'\s)]+/g)) {
      const disk = path.join(PUBLIC_DIR, m[0].replace(/^\//, ''));
      if (!fs.existsSync(disk)) missing.add(m[0]);
    }
  }
}
if (missing.size === 0) {
  console.log('✅ 所有本地图片引用均在 public/ 中真实存在！');
} else {
  console.log(`⚠️ 发现 ${missing.size} 张本地缺失图片（前 15 张）：`);
  [...missing].slice(0, 15).forEach((p) => console.log('  - ' + p));
}