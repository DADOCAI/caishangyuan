import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FeaturedItem {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  color: string;
}

const featuredItems: FeaturedItem[] = [
  {
    id: 1,
    title: '第八届国际设计奖',
    subtitle: '获奖作品集中展示，探索当代创意思维的巅峰',
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=80',
    color: 'from-blue-900/80 to-blue-600/60'
  },
  {
    id: 2,
    title: '设计趋势 2026',
    subtitle: '从前沿作品中提取的设计语言与创意方向',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    color: 'from-cyan-800/80 to-cyan-500/60'
  },
  {
    id: 3,
    title: 'INSPIRE 年度大会',
    subtitle: '汇聚全球顶尖设计师，分享创意灵感与实践经验',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
    color: 'from-green-800/80 to-green-500/60'
  },
  {
    id: 4,
    title: '极简主义美学',
    subtitle: '探索简约设计理念，用最少的元素表达最深的含义',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=1200&q=80',
    color: 'from-purple-900/80 to-purple-600/60'
  },
  {
    id: 5,
    title: '创意工作坊',
    subtitle: '实践驱动的设计方法论，从想法到落地的完整流程',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80',
    color: 'from-orange-900/80 to-orange-600/60'
  },
];

export function FeaturedCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(1); // 初始索引改为1，对应第二张卡片
  const [isTransitioning, setIsTransitioning] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 创建循环数组：复制首尾项实现无缝循环
  const extendedItems = [
    featuredItems[featuredItems.length - 1], // 末尾项放到开头
    ...featuredItems,
    featuredItems[0], // 首项放到末尾
  ];

  useEffect(() => {
    // 初始化时滚动到真实的第二项（索引1），确保居中显示
    if (scrollContainerRef.current) {
      const cardWidth = 500; // 卡片宽度
      const gap = 24; // 间距
      // 使用 setTimeout 确保 DOM 完全渲染后再设置滚动位置
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollLeft = (cardWidth + gap) * 2; // 显示第二张卡片
        }
      }, 0);
    }
  }, []);

  // 处理滚动结束后的循环逻辑
  const handleScrollEnd = () => {
    if (!scrollContainerRef.current) return;
    
    const cardWidth = 500;
    const gap = 24;

    // 如果滚动到了复制的首项（索引 -1），跳转到真实的末项
    if (currentIndex === -1) {
      scrollContainerRef.current.scrollLeft = (cardWidth + gap) * featuredItems.length;
      setCurrentIndex(featuredItems.length - 1);
      setIsTransitioning(false);
    }
    // 如果滚动到了复制的末项（索引 = length），跳转到真实的首项
    else if (currentIndex === featuredItems.length) {
      scrollContainerRef.current.scrollLeft = (cardWidth + gap) * 1;
      setCurrentIndex(0);
      setIsTransitioning(false);
    } else {
      setIsTransitioning(false);
    }
  };

  // 监听滚动事件，使用 debounce 检测滚动结束
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        handleScrollEnd();
      }, 150); // 滚动停止150ms后执行
    };

    container.addEventListener('scroll', handleScroll);
    
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentIndex]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current || isTransitioning) return;
    
    setIsTransitioning(true);
    const cardWidth = 500;
    const gap = 24;

    const newIndex = direction === 'left' ? currentIndex - 1 : currentIndex + 1;
    setCurrentIndex(newIndex);

    const targetScroll = (cardWidth + gap) * (newIndex + 1);
    
    scrollContainerRef.current.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative bg-white overflow-hidden py-8">
      {/* 左侧按钮 */}
      <button
        onClick={() => scroll('left')}
        disabled={isTransitioning}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg disabled:opacity-50"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>

      {/* 右侧按钮 */}
      <button
        onClick={() => scroll('right')}
        disabled={isTransitioning}
        className="absolute right-8 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all shadow-lg disabled:opacity-50"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* 轮播容器 - 居中对齐，左右露出部分卡片 */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-hidden scroll-smooth px-[calc(50vw-250px-12px)]"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {extendedItems.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="flex-shrink-0 w-[500px] h-[280px] relative rounded-md overflow-hidden group cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* 背景图片 */}
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            {/* 文字内容 */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
              <h2 className="text-xl font-bold mb-1.5 transform group-hover:translate-y-[-4px] transition-transform duration-300">
                {item.title}
              </h2>
              <p className="text-sm opacity-90 leading-relaxed">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}