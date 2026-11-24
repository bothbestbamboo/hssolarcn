export interface CategoryItem {
  id: number;
  name: string;
  parentId?: number;
  bannerImg?: string;
  seoTitle?: string;
  description?: string;
}

const DEFAULT_CAT_BANNER = '/Public/theme/default/picture/product.jpg';

export const CATEGORIES: CategoryItem[] = [
  // 一级分类
  {
    id: 1,
    name: '太阳能组件',
    seoTitle: '太阳能组件 - 宏晟光伏',
    description:
      '安徽源头工厂直供 N 型 TOPCon、HJT 异质结、全黑、叠瓦及离网高效光伏组件，满足户用、工商业及大型地面电站需求。',
    bannerImg: DEFAULT_CAT_BANNER,
  },
  {
    id: 3,
    name: '逆变器',
    seoTitle: '光伏逆变器 - 宏晟光伏',
    description:
      '高转换效率并网、混合及离网光伏逆变器，具备智能监控与多重电网保护，适配多场景光伏发电系统。',
    bannerImg: DEFAULT_CAT_BANNER,
  },
  {
    id: 4,
    name: '电池存储',
    seoTitle: '电池储能系统 (BESS) - 宏晟光伏',
    description:
      '涵盖户用低压/高压锂电池、工商业集装箱储能系统及深循环铅酸蓄电池，保障全天候稳定绿电供应。',
    bannerImg: DEFAULT_CAT_BANNER,
  },
  {
    id: 5,
    name: '太阳能解决方案',
    seoTitle: '一站式太阳能系统解决方案 - 宏晟光伏',
    description:
      '针对全球户用、工商业屋顶及离网地区定制并网、光储混合与独立离网交钥匙光伏系统方案。',
    bannerImg: DEFAULT_CAT_BANNER,
  },
  {
    id: 6,
    name: '安装系统',
    seoTitle: '光伏支架安装系统 - 宏晟光伏',
    description:
      '高强度阳极氧化铝合金与热镀锌钢光伏屋顶及地面支架结构，抗风雪耐腐蚀，安装高效稳固。',
    bannerImg: DEFAULT_CAT_BANNER,
  },
  {
    id: 7,
    name: '配件',
    seoTitle: '光伏系统配件 - 宏晟光伏',
    description:
      '一站配齐光伏连接器、光伏直流电缆、直流保护器件、太阳能水泵、MPPT 控制器、优化器及清洗工具。',
    bannerImg: DEFAULT_CAT_BANNER,
  },
  {
    id: 31,
    name: '全部商品',
    seoTitle: '全部商品 - 宏晟光伏',
    description:
      '浏览宏晟光伏全系列太阳能电池板、逆变器、电池储能系统、支架及光伏系统配件。',
    bannerImg: DEFAULT_CAT_BANNER,
  },

  // 太阳能组件子类
  { id: 2, name: 'N型光伏组件', parentId: 1, bannerImg: DEFAULT_CAT_BANNER },
  { id: 8, name: '全黑光伏组件', parentId: 1, bannerImg: DEFAULT_CAT_BANNER },
  { id: 9, name: '叠瓦式光伏组件', parentId: 1, bannerImg: DEFAULT_CAT_BANNER },
  { id: 10, name: '离网光伏组件', parentId: 1, bannerImg: DEFAULT_CAT_BANNER },
  { id: 11, name: '异质结光伏组件', parentId: 1, bannerImg: DEFAULT_CAT_BANNER },

  // 逆变器子类
  { id: 12, name: '并网逆变器', parentId: 3, bannerImg: DEFAULT_CAT_BANNER },
  { id: 13, name: '混合逆变器', parentId: 3, bannerImg: DEFAULT_CAT_BANNER },
  { id: 14, name: '离网逆变器', parentId: 3, bannerImg: DEFAULT_CAT_BANNER },

  // 电池存储子类
  { id: 15, name: '低压锂电池', parentId: 4, bannerImg: DEFAULT_CAT_BANNER },
  { id: 16, name: '高压锂电池', parentId: 4, bannerImg: DEFAULT_CAT_BANNER },
  { id: 17, name: '集装箱电池储能系统', parentId: 4, bannerImg: DEFAULT_CAT_BANNER },
  { id: 18, name: '铅酸蓄电池', parentId: 4, bannerImg: DEFAULT_CAT_BANNER },

  // 太阳能解决方案子类
  { id: 19, name: '并网系统', parentId: 5, bannerImg: DEFAULT_CAT_BANNER },
  { id: 20, name: '混合系统', parentId: 5, bannerImg: DEFAULT_CAT_BANNER },
  { id: 21, name: '离网系统', parentId: 5, bannerImg: DEFAULT_CAT_BANNER },

  // 安装系统子类
  { id: 22, name: '屋顶', parentId: 6, bannerImg: DEFAULT_CAT_BANNER },
  { id: 23, name: '地面', parentId: 6, bannerImg: DEFAULT_CAT_BANNER },

  // 配件子类
  { id: 24, name: '光伏连接器', parentId: 7, bannerImg: DEFAULT_CAT_BANNER },
  { id: 25, name: '光伏电缆', parentId: 7, bannerImg: DEFAULT_CAT_BANNER },
  { id: 26, name: '直流保护装置', parentId: 7, bannerImg: DEFAULT_CAT_BANNER },
  { id: 27, name: '太阳能水泵', parentId: 7, bannerImg: DEFAULT_CAT_BANNER },
  { id: 28, name: 'MPPT控制器', parentId: 7, bannerImg: DEFAULT_CAT_BANNER },
  { id: 29, name: '优化器', parentId: 7, bannerImg: DEFAULT_CAT_BANNER },
  { id: 30, name: '太阳能电池板清洁工具', parentId: 7, bannerImg: DEFAULT_CAT_BANNER },
];

export const getTopCategories = () =>
  CATEGORIES.filter((c) => !c.parentId && c.id !== 31);

export const getSubCategories = (parentId: number) =>
  CATEGORIES.filter((c) => c.parentId === parentId);