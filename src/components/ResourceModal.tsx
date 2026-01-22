import { Bookmark, Heart, MessageCircle, Share2, X as CloseIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { getLikeCount, getUserLiked, setUserLiked } from '../services/likes';

interface Resource {
  id: number;
  title: string;
  author: string;
  image: string;
  type: 'website' | 'template';
  description: string;
  content: string;
  tags: string[];
  updateDate?: string;
  isFree?: boolean;
}

interface ResourceModalProps {
  resource: Resource;
  onClose: () => void;
}

export function ResourceModal({ resource, onClose }: ResourceModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [showMemberBanner, setShowMemberBanner] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();
  const isVip = user?.memberType === 'vip';
  const isLocked = !resource.isFree && !isVip;

  // 禁止背景页面滚动
  useEffect(() => {
    // 保存当前滚动位置
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // 清理函数：恢复滚动
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const getViewerId = () => {
    if (user?.email) return user.email;
    try {
      const key = 'dadooooo_anon_id';
      let id = localStorage.getItem(key);
      if (!id) {
        id = Math.random().toString(36).slice(2);
        localStorage.setItem(key, id);
      }
      return id;
    } catch {
      return 'guest';
    }
  };

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const count = await getLikeCount(resource.id);
        const liked = await getUserLiked(resource.id, getViewerId());
        if (active) {
          setLikeCount(count);
          setIsLiked(liked);
        }
      } catch {}
    })();
    return () => { active = false; };
  }, [resource.id]);

  const handleLike = async () => {
    const next = !isLiked;
    setIsLiked(next);
    try {
      const { count } = await setUserLiked(resource.id, getViewerId(), next);
      setLikeCount(count);
    } catch (e) {
      setLikeCount(next ? likeCount + 1 : Math.max(0, likeCount - 1));
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto py-12"
      onClick={onClose}
    >
      {/* 半透明黑色背景 */}
      <div className="fixed inset-0 bg-black/80" />

      {/* 内容容器 */}
      <div className="relative flex items-start gap-6">
        {/* 主内容区 - 白色卡片 */}
        <div 
          className="relative w-[900px] bg-white rounded-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 主图 */}
          <div className="relative bg-gray-100">
            <img
              src={resource.image}
              alt={resource.title}
              className="w-full aspect-[16/9] object-cover"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Modal image failed to load:', resource.image);
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="900" height="506"%3E%3Crect fill="%23f0f0f0" width="900" height="506"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E图片加载失败%3C/text%3E%3C/svg%3E';
              }}
            />
            {false && showMemberBanner && <div />}
          </div>

          {/* 内容区 */}
          <div className="p-8">
            {showMemberBanner && !isLocked && (
              <div className="mb-5 flex justify-center" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-4 bg-black/80 text-white rounded-full shadow-2xl px-6 py-3">
                  <div className="text-xs font-semibold bg-white/10 px-2 py-1 rounded-full border border-white/20">{resource.isFree ? '免费资源' : 'VIP订阅专属'}</div>
                  <div className="text-base font-semibold">{resource.title}</div>
                  <div className="text-xs text-white/70">{resource.updateDate ? resource.updateDate : new Date().toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }).replace('/', '月') + '日'}</div>
                  <div className="flex items-center gap-3 ml-2">
                    <button
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        const url = 'https://javier.xyz/pintr';
                        try {
                          window.open(url, '_blank', 'noopener,noreferrer');
                        } catch {
                          location.href = url;
                        }
                      }}
                      className="shrink-0 bg-white text-black rounded-full px-4 py-2 text-sm font-medium shadow hover:shadow-lg hover:bg-gray-50 transition-all"
                    >
                      一键跳转
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowMemberBanner(false); }}
                      className="text-white/70 hover:text-white"
                      aria-label="关闭"
                    >
                      <CloseIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
            {!isLocked && (
              <div 
                className="w-full mt-8 mb-12"
                style={{
                  height: '1px',
                  backgroundImage: 'repeating-linear-gradient(to right, #e5e7eb 0, #e5e7eb 8px, transparent 8px, transparent 16px)'
                }}
              />
            )}
            {/* 标题区域 */}
            <div className="mb-6">
              <h1 className="text-2xl mb-2">{resource.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span>{resource.author}</span>
                <span>·</span>
                <span>{resource.type === 'website' ? '网站' : '模板'}</span>
              </div>
            </div>

            {/* 描述 */}
            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
              <p className="text-sm leading-relaxed text-gray-700">
                {resource.description}
              </p>
            </div>

            {/* 标签 */}
            <div className="mb-6 flex gap-2 flex-wrap">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-xs text-gray-600 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 正文内容 */}
            {isLocked ? (
              <div className="mb-6 p-8 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">该资源属于订阅专享资源，立即加入订阅</div>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/subscribe'); }}
                  className="shrink-0 bg-black text-white rounded-full px-4 py-2 text-sm font-medium shadow hover:shadow-lg hover:opacity-80 transition-all"
                >
                  立即加入订阅
                </button>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {resource.content.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('# ')) {
                    return (
                      <h2 key={index} className="text-xl mt-8 mb-3">
                        {paragraph.replace('# ', '')}
                      </h2>
                    );
                  } else if (paragraph.startsWith('## ')) {
                    return (
                      <h3 key={index} className="text-lg mt-6 mb-2">
                        {paragraph.replace('## ', '')}
                      </h3>
                    );
                  } else if (paragraph.startsWith('- ')) {
                    return (
                      <li key={index} className="ml-6 mb-2 text-sm text-gray-700">
                        {paragraph.replace('- ', '')}
                      </li>
                    );
                  } else if (paragraph.trim()) {
                    return (
                      <p key={index} className="mb-3 text-sm leading-relaxed text-gray-700">
                        {paragraph}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            )}
          </div>
        </div>

        {/* 右侧悬浮操作栏 - 独立在白色卡片外 */}
        <div 
          className="sticky top-16 flex flex-col items-center gap-8 py-6"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => toast.info('该功能还在开发中')}
            className="flex flex-col items-center gap-2 group focus:outline-none focus-visible:outline-none"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all bg-white hover:scale-110`}>
              <Bookmark className={`w-5 h-5 text-black`} />
            </div>
            <span className="text-xs text-white">收藏</span>
          </button>

          {/* 点赞 */}
          <button
            onClick={handleLike}
            className="flex flex-col items-center gap-2 group focus:outline-none focus-visible:outline-none"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isLiked 
                ? 'bg-blue-500' 
                : 'bg-white hover:scale-110'
            }`}>
              <Heart className={`w-5 h-5 ${isLiked ? 'text-white fill-white' : 'text-black'}`} />
            </div>
            <span className="text-xs text-white">
              {isLiked ? `已赞` : '点赞'}
            </span>
            {likeCount > 0 && (
              <span className="text-xs text-white -mt-1">{likeCount}</span>
            )}
          </button>

          <button 
            onClick={() => toast.info('该功能还在开发中')}
            className="flex flex-col items-center gap-2 group focus:outline-none focus-visible:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-all">
              <MessageCircle className="w-5 h-5 text-black" />
            </div>
            <span className="text-xs text-white">评论</span>
          </button>

          <button 
            onClick={() => toast.info('该功能还在开发中')}
            className="flex flex-col items-center gap-2 group focus:outline-none focus-visible:outline-none"
          >
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-all">
              <Share2 className="w-5 h-5 text-black" />
            </div>
            <span className="text-xs text-white">分享</span>
          </button>
        </div>
      </div>

      {/* 页面底部固定条已移除，改为文章内容顶部居中显示 */}
    </div>
  );
}
