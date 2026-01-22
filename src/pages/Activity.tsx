import { useState } from 'react';
import { Calendar, Users, Trophy, Sparkles, MapPin, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import dadoLogo from 'figma:asset/436af43621e018c50b65365e8b2e98a1fa445235.png';

interface ActivityItem {
  id: number;
  title: string;
  type: '比赛' | '工作坊' | '挑战' | '聚会';
  status: '进行中' | '即将开始' | '报名中' | '长期有效';
  image: string;
  date: string;
  location?: string;
  participants?: number;
  description: string;
  details: string;
  tags: string[];
}

const activities: ActivityItem[] = [
  {
    id: 1,
    title: '2024设计挑战赛',
    type: '比赛',
    status: '进行中',
    image: 'https://images.unsplash.com/photo-1631346392930-acbe6c686a19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBjb250ZXN0JTIwZXZlbnR8ZW58MXx8fHwxNzY4MjA1NDE4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    date: '2024.01.15 - 2024.02.15',
    participants: 1247,
    description: '参加我们的年度设计挑战赛，展示你的创意才华，赢取丰厚奖品！',
    details: `# 2024设计挑战赛

欢迎参加dado年度设计挑战赛！这是一个展示你创意才华的绝佳机会。

## 活动详情

- **参赛时间**：2024年1月15日 - 2月15日
- **主题**：未来生活
- **奖品**：总价值50,000元奖品
- **参赛资格**：所有设计师均可参与

## 奖项设置

- **金奖**（1名）：20,000元现金 + 专业设备
- **银奖**（3名）：8,000元现金
- **铜奖**（10名）：2,000元现金
- **优秀奖**（50名）：精美周边礼品

## 评审标准

- 创意性 (40%)
- 实用性 (30%)
- 视觉表现 (20%)
- 完成度 (10%)

立即参与，让你的作品被更多人看见！`,
    tags: ['设计比赛', '奖金丰厚', '热门'],
  },
];

export function Activity() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(null);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
        return 'bg-green-500';
      case '即将开始':
        return 'bg-blue-500';
      case '报名中':
        return 'bg-orange-500';
      case '长期有效':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case '比赛':
        return <Trophy className="w-5 h-5" />;
      case '工作坊':
        return <Users className="w-5 h-5" />;
      case '挑战':
        return <Sparkles className="w-5 h-5" />;
      case '聚会':
        return <Calendar className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[57px]">
      {/* 活动展示 */}
      <div className="max-w-[1680px] mx-auto px-12 py-16">
        <div className="max-w-2xl mx-auto">
          {activities.map((activity) => (
            <div 
              key={activity.id}
              onClick={() => setSelectedActivity(activity)}
              className="group cursor-pointer bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              {/* 图片 */}
              <div className="relative h-96 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* 状态标签 */}
                <div className={`absolute top-4 left-4 ${getStatusColor(activity.status)} text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg`}>
                  {activity.status}
                </div>
                {/* 类型图标 */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg">
                  {getTypeIcon(activity.type)}
                </div>
              </div>

              {/* 内容 */}
              <div className="p-8">
                <h3 className="text-3xl font-bold mb-4 group-hover:text-blue-600 transition-colors" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                  {activity.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                  {activity.description}
                </p>

                {/* 信息栏 */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-base text-gray-500">
                    <Calendar className="w-5 h-5" />
                    <span>{activity.date}</span>
                  </div>
                  {activity.location && (
                    <div className="flex items-center gap-3 text-base text-gray-500">
                      <MapPin className="w-5 h-5" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                  {activity.participants && (
                    <div className="flex items-center gap-3 text-base text-gray-500">
                      <Users className="w-5 h-5" />
                      <span>{activity.participants} 人已参与</span>
                    </div>
                  )}
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2">
                  {activity.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* dado logo - 跳转到工具页 */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/');
                    }}
                    className="flex flex-col items-center gap-2 mx-auto hover:opacity-60 transition-opacity"
                  >
                    <img 
                      src={dadoLogo} 
                      alt="dado" 
                      className="h-4 object-contain"
                    />
                    <span className="text-xs text-gray-400">原创开发小工具</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 活动详情模态框 */}
      {selectedActivity && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-8"
          onClick={() => setSelectedActivity(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部图片 */}
            <div className="relative h-80">
              <img
                src={selectedActivity.image}
                alt={selectedActivity.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg"
              >
                <X className="w-6 h-6" />
              </button>
              <div className={`absolute top-6 left-6 ${getStatusColor(selectedActivity.status)} text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg`}>
                {selectedActivity.status}
              </div>
            </div>

            {/* 内容 */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-320px)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gray-100 rounded-full">
                  {getTypeIcon(selectedActivity.type)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{selectedActivity.type}</p>
                  <h2 className="text-3xl font-bold" style={{ fontFamily: '"Noto Sans SC", sans-serif' }}>
                    {selectedActivity.title}
                  </h2>
                </div>
              </div>

              {/* 信息栏 */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">时间</p>
                    <p className="font-medium">{selectedActivity.date}</p>
                  </div>
                </div>
                {selectedActivity.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">地点</p>
                      <p className="font-medium">{selectedActivity.location}</p>
                    </div>
                  </div>
                )}
                {selectedActivity.participants && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">参与人数</p>
                      <p className="font-medium">{selectedActivity.participants} 人</p>
                    </div>
                  </div>
                )}
              </div>

              {/* 详细介绍 */}
              <div 
                className="prose prose-sm max-w-none mb-8"
                style={{ fontFamily: '"Noto Sans SC", sans-serif' }}
              >
                {selectedActivity.details.split('\n').map((line, index) => {
                  if (line.startsWith('# ')) {
                    return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
                  } else if (line.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-5 mb-3">{line.substring(3)}</h2>;
                  } else if (line.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-bold mt-4 mb-2">{line.substring(4)}</h3>;
                  } else if (line.startsWith('- ')) {
                    return <li key={index} className="ml-6">{line.substring(2)}</li>;
                  } else if (line.trim() === '') {
                    return <br key={index} />;
                  } else {
                    return <p key={index} className="mb-2 text-gray-700">{line}</p>;
                  }
                })}
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedActivity.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 底部按钮 */}
              <div className="flex gap-4">
                <button className="flex-1 bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-all">
                  我要参加
                </button>
                <button className="px-6 py-4 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all">
                  分享给朋友
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}