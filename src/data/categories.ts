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
  { id: 1, name: '太阳能组件', bannerImg: DEFAULT_CAT_BANNER },
  { id: 3, name: '逆变器', bannerImg: DEFAULT_CAT_BANNER },
  { id: 4, name: '电池存储', bannerImg: DEFAULT_CAT_BANNER },
  { id: 5, name: '太阳能解决方案', bannerImg: DEFAULT_CAT_BANNER },
  { id: 6, name: '安装系统', bannerImg: DEFAULT_CAT_BANNER },
  { id: 7, name: '配件', bannerImg: DEFAULT_CAT_BANNER },
  { id: 31, name: '全部商品', bannerImg: DEFAULT_CAT_BANNER },

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