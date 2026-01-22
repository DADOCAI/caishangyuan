import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LayoutGrid, Globe, FileText, Tag, Clock } from 'lucide-react';
import { FeaturedCarousel } from '../components/FeaturedCarousel';
import { ResourceModal } from '../components/ResourceModal';
import dadoLogo from 'figma:asset/436af43621e018c50b65365e8b2e98a1fa445235.png';
import templateIcon from 'figma:asset/e779ea7dc37941620675c3efb54f6a08e38f3af5.png';
import freeIcon from 'figma:asset/69715046800c595c0ae46f80a7b2dea619f5363d.png';

type ResourceType = 'all' | 'website' | 'template' | 'free';

interface Resource {
  id: number;
  title: string;
  author: string;
  image: string;
  type: 'website' | 'template';
  description: string;
  content: string;
  tags: string[];
  isFree?: boolean;
  updateDate?: string;
}

// 示例数据 - 使用 Unsplash 支持 CORS 的图片
const resources: Resource[] = [
  {
    id: 1,
    title: "极简主义电商网站",
    author: "设计师小王",
    image: "https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd2Vic2l0ZSUyMGRlc2lnbnxlbnwxfHx8fDE3Njc5NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'website',
    description: "探索极简主义在电商网站设计中的应用，通过简洁的视觉语言提升用户体验。",
    content: `# 设计理念

极简主义不仅仅是减少元素，更是关于如何通过精心设计的空间和排版来突出核心内容。

在这个电商网站项目中，我们采用了大量留白、清晰的层级结构和克制的色彩方案，让用户能够专注于产品本身。

## 核心特点

- **清晰的视觉层级**：通过字体大小和间距建立信息层次
- **大量留白**：给予内容呼吸的空间
- **克制的色彩**：黑白为主，用色彩点缀重点
- **优雅的交互**：流畅自然的过渡效果

## 设计过程

整个设计过程从用户研究开始，我们发现用户在浏览电商网站时最需要的是快速找到产品信息，而不是被过多的装饰元素干扰。

因此，我们将产品图片和基本信息作为页面的焦点，配合简洁的导航和搜索功能，打造出一个高效且美观的购物体验。`,
    tags: ['电商', '极简', 'UI设计'],
    isFree: true,
    updateDate: '1月12日'
  },
  {
    id: 2,
    title: "现代UI设计模板",
    author: "Alice Design",
    image: "https://images.unsplash.com/photo-1764406562219-105937cc3f95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB1aSUyMHRlbXBsYXRlfGVufDF8fHx8MTc2Nzk1MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'template',
    description: "一套完整的现代UI设计模板，包含常用组件和页面布局。",
    content: `# 模板介绍

这是一套为现代Web应用设计的完整UI模板系统。

包含了从按钮、表单到复杂页面布局的所有常用组件，每个组件都经过精心设计和测试，确保在不同场景下都能保持一致性和可用性。

## 包含内容

- 完整的组件库
- 响应式布局系统
- 颜色和字体规范
- 图标集合
- 示例页面

设计系统的建立能够大幅提升团队协作效率，确保产品在不同模块间保持视觉一致性。`,
    tags: ['模板', 'UI Kit', '设计系统'],
    isFree: true,
    updateDate: '1月10日'
  },
  {
    id: 3,
    title: "响应式企业官网",
    author: "dado设计团队",
    image: "https://images.unsplash.com/photo-1690192699379-fb68bb749eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXNwb25zaXZlJTIwd2Vic2l0ZXxlbnwxfHx8fDE3Njc5NDIwMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'website',
    description: "专为企业打造的响应式官网设计，适配各种设备尺寸。",
    content: `# 项目背景

在移动互联网时代，企业官网需要在各种设备上都能提供良好的浏览体验。

这个项目采用响应式设计方法，确保网站在桌面端、平板和手机上都能完美展示。

## 技术实现

- 流式布局系统
- 灵活的栅格系统
- 媒体查询优化
- 移动优先策略

## 设计亮点

我们特别注意了移动端的交互设计，优化了触摸目标的大小，简化了导航结构，确保用户能够轻松浏览所有内容。`,
    tags: ['响应式', '企业网站', 'Web'],
    updateDate: '1月8日'
  },
  {
    id: 4,
    title: "移动应用界面设计",
    author: "UI大师",
    image: "https://images.unsplash.com/photo-1605108222700-0d605d9ebafe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzY3ODY2NTIyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'template',
    description: "精心设计的移动应用界面，注重用户体验和视觉美感。",
    content: `# 移动优先

移动应用的设计需要考虑更多因素，包括有限的屏幕空间、触摸交互和使用场景的多样性。

## 设计原则

- **简洁明了**：每个界面只展示最必要的信息
- **便捷操作**：关键功能一触即达
- **视觉反馈**：及时的交互反馈让用户安心
- **情感化设计**：通过微动效增添趣味性

## 用户体验

我们进行了多轮用户测试，根据真实用户的反馈不断优化界面布局和交互流程，最终达到了流畅自然的使用体验。`,
    tags: ['移动端', 'App设计', 'UX'],
    isFree: true,
    updateDate: '1月5日'
  },
  {
    id: 5,
    title: "品牌视觉设计系统",
    author: "张设计",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0Zm9saW8lMjB3ZWJzaXRlfGVufDF8fHx8MTc2Nzg2NjUyNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'template',
    description: "完整的品牌视觉识别系统，包含Logo、色彩、字体等规范。",
    content: `# 品牌设计系统

一个成功的品牌需要统一的视觉识别系统，这个项目展示了如何建立完整的品牌设计规范。

## 系统组成

- **Logo系统**：主标志及应用规范
- **色彩体系**：主色、辅助色和功能色
- **字体规范**：中英文字体选择和使用规则
- **图形元素**：辅助图形和图标系统
- **应用示例**：名片、信纸等物料设计

## 设计思路

品牌设计不仅是视觉美化，更是品牌个性和价值观的体现。我们从品牌定位出发，提炼核心视觉元素，建立起富有辨识度的品牌形象。`,
    tags: ['品牌设计', '视觉系统', 'Logo'],
    updateDate: '1月3日'
  },
  {
    id: 6,
    title: "创意品牌官网",
    author: "李设计师",
    image: "https://images.unsplash.com/photo-1545063328-c8e3faffa16f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXNoYm9hcmQlMjBkZXNpZ258ZW58MXx8fHwxNzY3ODU4MDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'website',
    description: "突破常规的创意品牌官网，用独特的视觉语言讲述品牌故事。",
    content: `# 创意表达

这个项目挑战了传统企业官网的设计模式，用更具创意的方式展现品牌个性。

## 创新点

- **非常规布局**：打破网格，创造动态视觉体验
- **沉浸式叙事**：用滚动动画讲述品牌故事
- **大胆用色**：突破保守，建立视觉记忆点
- **个性化交互**：定制化的互动体验

## 项目挑战

在追求创意的同时，我们也注重可用性，确保创新不会影响基本的信息传达和用户体验。

通过反复测试和优化，最终实现了创意与实用的平衡。`,
    tags: ['创意设计', '品牌网站', '动效'],
    updateDate: '12月28日'
  },
  {
    id: 7,
    title: "极简建筑设计",
    author: "建筑工作室",
    image: "https://images.unsplash.com/photo-1560202582-a391c31ec300?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kaW5nJTIwcGFnZSUyMGRlc2lnbnxlbnwxfHx8fDE3Njc4OTAyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'website',
    description: "以建筑美学为灵感的极简网站设计，展现空间与留白的艺术。",
    content: `# 建筑与设计

建筑设计中的空间感和结构美学对网页设计有着重要启发意义。

这个项目借鉴了现代建筑的极简主义风格，用网页设计的语言诠释空间、光影和材质。

## 设计理念

- **空间感营造**：通过留白创造呼吸感
- **结构清晰**：像建筑一样讲究结构逻辑
- **材质表现**：细腻的质感展现
- **光影效果**：利用阴影和渐变增加层次

## 设计细节

每个元素的位置都经过仔细推敲，确保页面整体的平衡感和韵律感。大面积的留白不是空洞，而是给予内容足够的展示空间。`,
    tags: ['建筑', '极简', '空间设计'],
    isFree: true,
    updateDate: '12月25日'
  },
  {
    id: 8,
    title: "现代海报设计",
    author: "平面设计师",
    image: "https://images.unsplash.com/photo-1597534458220-9fb4969f2df5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd2Vic2l0ZSUyMGRlc2lnbnxlbnwxfHx8fDE3Njc5NDExMjR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'template',
    description: "现代平面设计海报模板集合，适用于各类宣传场景。",
    content: `# 海报设计

海报是最直接的视觉传达形式，需要在有限的空间内传递最大的信息量。

这套模板集合了多种设计风格，适用于音乐会、展览、产品发布等各类场景。

## 设计特点

- **强烈的视觉冲击**：大胆的排版和配色
- **灵活的模板系统**：易于修改和定制
- **多种风格**：现代、复古、简约等不同选择
- **印刷就绪**：符合印刷标准的文件设置

## 应用场景

无论是线上宣传还是线下打印，这套模板都能提供专业的设计效果，帮助您的活动或产品获得更多关注。`,
    tags: ['海报', '平面设计', '模板'],
    updateDate: '12月20日'
  },
  {
    id: 9,
    title: "字体排版艺术",
    author: "字体设计师",
    image: "https://images.unsplash.com/photo-1738003667850-a2fb736e31b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0eXBvZ3JhcGh5JTIwZGVzaWdufGVufDF8fHx8MTc2ODE4NTQ5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'template',
    description: "探索字体排版的无限可能，从经典到创新的视觉表达。",
    content: `# 字体的力量

字体不仅仅是文字的载体，更情感和品牌个性的表达工具。

这个项目展示了如何通过创意字体排版，创造独特的视觉体验和信息层次。

## 排版原则

- **层次分明**：建立清晰的信息架构
- **字体搭配**：中英文字体的和谐共存
- **节奏韵律**：通过间距和大小营造视觉节奏
- **创意表达**：打破常规的排版实验

## 应用场景

适用于品牌标识、海报设计、网页标题等需要强烈视觉冲击的场景。`,
    tags: ['字体设计', '排版', '视觉传达'],
    isFree: true,
    updateDate: '12月18日'
  },
  {
    id: 10,
    title: "产品界面设计",
    author: "产品设计团队",
    image: "https://images.unsplash.com/photo-1759215524484-89c8d7ae28f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc2ODE4NTQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'website',
    description: "以用户为中心的产品界面设计，注重可用性与美学的平衡。",
    content: `# 用户体验至上

优秀的产品界面设计需要在功能性和美观性之间找到完美平衡。

这个项目展示了如何通过细致的用户研究和迭代设计，创造直观易用的产品界面。

## 设计方法

- **用户研究**：深入了解目标用户需求
- **信息架构**：合理组织功能和内容
- **交互设计**：流畅自然的操作流程
- **视觉设计**：统一协调的视觉语言

## 项目成果

通过数据驱动的设计决策，我们成功提升了用户满意度和产品转化率。`,
    tags: ['产品设计', 'UX/UI', '交互设计'],
    updateDate: '12月15日'
  },
  {
    id: 11,
    title: "摄影作品集网站",
    author: "摄影师工作室",
    image: "https://images.unsplash.com/photo-1649297554304-70425a8e82cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHBvcnRmb2xpbyUyMHdlYnNpdGV8ZW58MXx8fHwxNzY4MTg1NDkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'website',
    description: "专为摄影师打造的作品集展示平台，让作品成为焦点。",
    content: `# 视觉叙事

摄影作品集网站的设计关键在于如何让作品自己说话，设计元素应该退居其次。

这个项目采用极简主义设计，大幅面展示摄影作品，配合流畅的浏览体验。

## 设计特色

- **全屏展示**：最大化作品呈现面积
- **快速加载**：优化图片加载性能
- **分类系统**：清晰的作品分类导航
- **沉浸体验**：减少干扰元素

## 技术实现

采用响应式图片技术和懒加载策略，确保在不同设备上都能流畅浏览。`,
    tags: ['摄影', '作品集', '视觉设计'],
    isFree: true,
    updateDate: '12月10日'
  },
  {
    id: 12,
    title: "社交媒体设计模板",
    author: "内容创作者",
    image: "https://images.unsplash.com/photo-1521572089244-e5aaacacca6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBtZWRpYSUyMHRlbXBsYXRlfGVufDF8fHx8MTc2ODE4NTQ5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    type: 'template',
    description: "适用于各大社交平台的设计模板，提升内容视觉吸引力。",
    content: `# 社交媒体时代

在信息爆炸的社交媒体环境中，优秀的视觉设计是脱颖而出的关键。

这套模板专为社交媒体设计，涵盖 Instagram、微博、小红书等主流平台的常用尺寸。

## 模板特点

- **多平台适配**：覆盖主流社交平台
- **易于编辑**：简单修改即可使用
- **风格多样**：适合不同品牌调性
- **高分辨率**：确保发布质量

## 使用场景

适用于个人品牌建设、商业推广、活动宣传等各类社交媒体内容创作。`,
    tags: ['社交媒体', '模板', '内容设计'],
    updateDate: '12月5日'
  },
];

export function Library() {
  const [activeFilter, setActiveFilter] = useState<ResourceType>('all');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const navigate = useNavigate();

  const filteredResources = resources.filter(resource => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'free') return resource.isFree;
    return resource.type === activeFilter;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* 横向滚动展示区 - 紧接在主导航栏下方 */}
      <div className="pt-[57px]">
        <FeaturedCarousel />
      </div>

      {/* 固定的次导航栏 - 在横向滚动区域下方 */}
      <div className="sticky top-[57px] left-0 right-0 bg-white z-40">
        <div className="max-w-[1680px] mx-auto px-12">
          <div className="flex gap-8 py-3" style={{ fontFamily: '"Noto Sans HK", "Source Han Sans HW", "Source Han Sans", "Noto Sans SC", sans-serif', fontWeight: 400 }}>
            {/* 全部 */}
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-2 transition-all flex flex-col items-center gap-2 ${
                activeFilter === 'all' 
                  ? 'text-[#3B82F6]' 
                  : 'text-black hover:text-black/70'
              }`}
            >
              <div className="h-5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="7" height="7" rx="0.5" fill="currentColor"/>
                  <rect x="11" y="2" width="7" height="7" rx="0.5" fill="currentColor"/>
                  <rect x="2" y="11" width="7" height="7" rx="0.5" fill="currentColor"/>
                  <rect x="11" y="11" width="7" height="7" rx="0.5" fill="currentColor"/>
                </svg>
              </div>
              <span className="text-[13px]">全部</span>
            </button>

            {/* 网站 */}
            <button
              onClick={() => setActiveFilter('website')}
              className={`px-3 py-2 transition-all flex flex-col items-center gap-2 ${
                activeFilter === 'website' 
                  ? 'text-[#3B82F6]' 
                  : 'text-black hover:text-black/70'
              }`}
            >
              <div className="h-5 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="3" width="16" height="14" rx="1.5" fill="currentColor"/>
                  <line x1="2" y1="6.5" x2="18" y2="6.5" stroke="white" strokeWidth="1.2"/>
                  <circle cx="4.5" cy="4.8" r="0.5" fill="white"/>
                  <circle cx="6.5" cy="4.8" r="0.5" fill="white"/>
                  <circle cx="8.5" cy="4.8" r="0.5" fill="white"/>
                </svg>
              </div>
              <span className="text-[13px]">网站</span>
            </button>

            {/* 模板 */}
            <button
              onClick={() => setActiveFilter('template')}
              className={`px-3 py-2 transition-all flex flex-col items-center gap-2 ${
                activeFilter === 'template' 
                  ? 'text-[#3B82F6]' 
                  : 'text-black hover:text-black/70'
              }`}
            >
              <div className="h-5 flex items-center justify-center">
                <img 
                  src={templateIcon} 
                  alt="Template" 
                  className={`h-5 w-auto object-contain ${
                    activeFilter === 'template' 
                      ? 'brightness-0 saturate-100' 
                      : ''
                  }`}
                  style={activeFilter === 'template' ? {
                    filter: 'brightness(0) saturate(100%) invert(42%) sepia(88%) saturate(3221%) hue-rotate(209deg) brightness(100%) contrast(93%)'
                  } : {}}
                />
              </div>
              <span className="text-[13px]">模板</span>
            </button>

            {/* 免费 - FREE图标 */}
            <button
              onClick={() => setActiveFilter('free')}
              className={`px-3 py-2 transition-all flex flex-col items-center gap-2 ${
                activeFilter === 'free' 
                  ? 'text-[#3B82F6]' 
                  : 'text-black hover:text-black/70'
              }`}
            >
              <div className="h-5 flex items-center justify-center">
                <img 
                  src={freeIcon} 
                  alt="Free" 
                  className={`h-5 w-auto object-contain ${
                    activeFilter === 'free' 
                      ? 'brightness-0 saturate-100' 
                      : ''
                  }`}
                  style={activeFilter === 'free' ? {
                    filter: 'brightness(0) saturate(100%) invert(42%) sepia(88%) saturate(3221%) hue-rotate(209deg) brightness(100%) contrast(93%)'
                  } : {}}
                />
              </div>
              <span className="text-[13px]">免费</span>
            </button>

            {/* 分隔符 */}
            <div className="flex items-center">
              <div className="w-px h-10 bg-gray-300"></div>
            </div>

            <button 
              onClick={() => navigate('/')}
              className="flex flex-col items-center gap-2 px-3 py-2 transition-all hover:opacity-70"
            >
              <img 
                src={dadoLogo} 
                alt="dado logo" 
                className="h-6 w-auto object-contain"
              />
              <span className="text-[11px] text-gray-500">原创开发小工具</span>
            </button>
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="pb-20 pt-5">
        <div className="max-w-[1680px] mx-auto px-12">
          {/* 资源网格 */}
          <div className="grid grid-cols-5 gap-5">
            {filteredResources.map((resource) => (
              <div 
                key={resource.id}
                onClick={() => setSelectedResource(resource)}
                className="group cursor-pointer block"
              >
                {/* 图片容器 */}
                <div className="relative bg-gray-100 mb-2.5 overflow-hidden aspect-square rounded shadow-sm hover:shadow-lg transition-all duration-300">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error('Image failed to load:', resource.image);
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"400\" height=\"400\"%3E%3Crect fill=\"%23f0f0f0\" width=\"400\" height=\"400\"/%3E%3Ctext fill=\"%23999\" font-family=\"sans-serif\" font-size=\"14\" x=\"50%25\" y=\"50%25\" text-anchor=\"middle\" dominant-baseline=\"middle\"%3E加载失败%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  {/* Hover 遮罩 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300" />
                  
                  {/* 免费标签 */}
                  {resource.isFree && (
                    <div className="absolute top-3 left-3 bg-blue-600 z-10 text-white text-xs font-medium px-2.5 py-1 rounded-none shadow-md">
                      免费
                    </div>
                  )}
                </div>

                {/* 信息区域 */}
                <div className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                    {resource.title}
                  </h3>
                  {resource.updateDate && (
                    <div className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {resource.updateDate}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 空状态 */}
          {filteredResources.length === 0 && (
            <div className="py-20 flex items-center justify-center">
              <p className="text-gray-400 text-sm">暂无内容</p>
            </div>
          )}
        </div>
      </div>

      {/* 资源详情模态框 */}
      {selectedResource && (
        <ResourceModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  );
}
