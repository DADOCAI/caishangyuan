import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Notification {
  id: number;
  icon: string;
  title: string;
  description: string;
  action?: {
    text: string;
    link: string;
  };
  time: string;
}

// 示例通知数据
const notifications: Notification[] = [
  {
    id: 4,
    icon: 'dado',
    title: '新年活动开始',
    description: '新年游戏上线，通关领取红包封面。',
    action: {
      text: '去参与活动',
      link: '/activity'
    },
    time: '今天'
  },
  {
    id: 3,
    icon: 'dado',
    title: '新功能上线通知',
    description: '我们刚刚发布了全新的资料库功能，你可以在这里找到更多优质的设计资源和模板。',
    action: {
      text: '查看资料库',
      link: '/library'
    },
    time: '1周前'
  },
  {
    id: 1,
    icon: 'dado',
    title: '欢迎来到dado设计工具平台',
    description: '探索我们精心准备的设计工具和资源，开始你的创意之旅。浏览工具库，发现更多可能性。',
    action: {
      text: '开始探索',
      link: '/'
    },
    time: '2天前'
  },
  {
    id: 2,
    icon: 'dado',
    title: 'dado版本更新',
    description: '我们分析了今年最受欢迎的设计作品，总结出2026年将主导设计领域的创意趋势。',
    action: {
      text: '查看更新',
      link: '/updates'
    },
    time: '5天前'
  }
];

export function NotificationPanel() {
  return (
    <div 
      className="absolute right-0 top-full w-[420px]"
      onMouseEnter={(e) => e.stopPropagation()}
    >
      {/* 扩大hover区域的透明区域 */}
      <div className="h-2" />
      
      <div className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-base">您的通知</h3>
        </div>

        {/* 通知列表 */}
        <div className="max-h-[500px] overflow-y-auto">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className="px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex gap-3">
                {/* 图标 */}
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  Da
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 text-black">
                    {notification.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed mb-3">
                    {notification.description}
                  </p>

                  {/* 操作按钮 */}
                  {notification.action && (
                    <Link
                      to={notification.action.link}
                      className="inline-block text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {notification.action.text}
                    </Link>
                  )}

                  {/* 时间 */}
                  <p className="text-xs text-gray-400 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
