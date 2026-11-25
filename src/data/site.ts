export interface HomeBanner {
  img: string;
  alt: string;
  badge: string;
  title: string;
  highlight: string;
  subtitle: string;
  primaryText: string;
  primaryLink: string;
  secondaryText: string;
  secondaryLink: string;
}

export const SITE = {
  name: '宏晟光伏',
  title: '宏晟光伏: 太阳能板与光伏板的生产厂家',
  description:
    '宏晟光伏是太阳能板与光伏板的生产厂家，专业生产N型TOPCon、HJT异质结太阳能组件、逆变器及电池储能系统。',
  keywords: '太阳能板, 光伏板, 光伏组件, 宏晟光伏',
  logoLight: '/Uploads/images/logocn-dark.png',
  logoDark: '/Uploads/images/logocn.png',
  phone: '13905633017',
  email: 'info@hssolar.com',
  address: '安徽宣城市宁国经开区兴盛路',
  wechatQr: '/Uploads/images/20241116/673877212cc64.jpg',
  copyright: 'Copyright © 2026 宣城宏晟光伏科技有限公司 版权所有',
  web3formsKey: '007ddd91-be4f-4381-b504-f9464f95e06d',
  friendlyLinks: [
    { name: 'HS Solar English Site', href: 'https://www.hssolar.com/' },
    { name: 'https://www.bambooindustry.com/', href: 'https://www.bambooindustry.com/' },
  ],
};

// 首页轮播图文配置（保持原图片路径不变，后期改图改字只需改这里）
export const HOME_BANNERS: HomeBanner[] = [
  {
    img: '/Uploads/images/20241119/673c9f32ace84.jpg',
    alt: '宏晟光伏高效太阳能板生产厂家',
    badge: '源头光伏制造基地 · 10年深耕',
    title: '高效太阳能光伏组件',
    highlight: '助力全球绿色能源升级',
    subtitle:
      '全自动化智造产线，规模化量产 N 型 TOPCon、HJT 异质结及 PERC 组件，最高功率达 750Wp，通过 TÜV、Intertek 权威认证。',
    primaryText: '探索光伏组件',
    primaryLink: '/category-1.html',
    secondaryText: '获取厂家报价',
    secondaryLink: '/contact-us.html',
  },
  {
    img: '/Uploads/images/20241119/673c9f55de2e1.jpg',
    alt: '宏晟光伏一站式光储系统解决方案',
    badge: '一站式光储系统供应商',
    title: '智能逆变器与',
    highlight: '锂电池储能系统方案',
    subtitle:
      '覆盖户用、工商业及集装箱储能应用场景，提供并网、混合、离网全套系统设计与成套设备直供，产品远销全球 110+ 国家和地区。',
    primaryText: '浏览储能系统',
    primaryLink: '/category-4.html',
    secondaryText: '咨询系统选型',
    secondaryLink: '/contact-us.html',
  },
];

export const PRODUCT_CATEGORIES = [
  {
    id: 1,
    name: '太阳能组件',
    children: [
      { id: 2, name: 'N型光伏组件' },
      { id: 8, name: '全黑光伏组件' },
      { id: 9, name: '叠瓦式光伏组件' },
      { id: 10, name: '离网光伏组件' },
      { id: 11, name: '异质结光伏组件' },
    ],
  },
  {
    id: 3,
    name: '逆变器',
    children: [
      { id: 12, name: '并网逆变器' },
      { id: 13, name: '混合逆变器' },
      { id: 14, name: '离网逆变器' },
    ],
  },
  {
    id: 4,
    name: '电池存储',
    children: [
      { id: 15, name: '低压锂电池' },
      { id: 16, name: '高压锂电池' },
      { id: 17, name: '集装箱电池储能系统' },
      { id: 18, name: '铅酸蓄电池' },
    ],
  },
  {
    id: 5,
    name: '太阳能解决方案',
    children: [
      { id: 19, name: '并网系统' },
      { id: 20, name: '混合系统' },
      { id: 21, name: '离网系统' },
    ],
  },
  {
    id: 6,
    name: '安装系统',
    children: [
      { id: 22, name: '屋顶' },
      { id: 23, name: '地面' },
    ],
  },
  {
    id: 7,
    name: '配件',
    children: [
      { id: 24, name: '光伏连接器' },
      { id: 25, name: '光伏电缆' },
      { id: 26, name: '直流保护装置' },
      { id: 27, name: '太阳能水泵' },
      { id: 28, name: 'MPPT控制器' },
      { id: 29, name: '优化器' },
      { id: 30, name: '太阳能电池板清洁工具' },
    ],
  },
];

export const POPULAR_TAGS = [
  { id: 5, name: '800W' },
  { id: 6, name: '700W' },
  { id: 7, name: '太阳能电池组件' },
];