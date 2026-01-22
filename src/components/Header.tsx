import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Bell } from 'lucide-react';
import logoDefault from 'figma:asset/cb7518acee88e4f203be6734e15429ff9c58e4e1.png';
import logoHover from 'figma:asset/e5c375aeb9d5459e76d1f4b4579b4d2ffbb0055e.png';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from './UserProfile';
import { NotificationPanel } from './NotificationPanel';
import { MessagePanel } from './MessagePanel';

export function Header() {
  const [isHovered, setIsHovered] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, setShowLoginDialog } = useAuth();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <nav className="px-8">
        <div className="flex justify-between items-center h-[57px]">
          {/* 左侧：Logo + 导航 */}
          <div className="flex items-center gap-8 h-full">
            <div 
              className="relative cursor-pointer"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleLogoClick}
            >
              <img 
                src={isHovered ? logoHover : logoDefault}
                alt="dado logo"
                className={`h-10 object-contain transition-opacity duration-300 ${
                  isHovered ? 'animate-flicker' : ''
                }`}
              />
            </div>
            <div className="flex gap-8 text-black text-base items-center h-full" style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Microsoft Yahei", "SimHei", sans-serif', fontWeight: 700, letterSpacing: '-0.02em' }}>
              <Link 
                to="/" 
                className="hover:opacity-60 transition-opacity relative h-full flex items-center"
              >
                工具
                {location.pathname === '/' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </Link>
              <Link 
                to="/library" 
                className="hover:opacity-60 transition-opacity relative h-full flex items-center"
              >
                资料库
                {location.pathname === '/library' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </Link>
              <Link 
                to="/activity" 
                className="hover:opacity-60 transition-opacity relative h-full flex items-center"
              >
                活动
                {location.pathname === '/activity' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </Link>
              <Link 
                to="/about" 
                className="hover:opacity-60 transition-opacity relative h-full flex items-center"
              >
                关于
                {location.pathname === '/about' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </Link>
              <Link 
                to="/updates" 
                className="hover:opacity-60 transition-opacity relative h-full flex items-center"
              >
                更新
                {location.pathname === '/updates' && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
                )}
              </Link>
            </div>
          </div>

          {/* 右侧：图标 + 订阅 + 登录 */}
          <div className="flex gap-6 items-center">
            {/* 消息图标 */}
            <div 
              className="relative flex items-center pt-0.5"
              onMouseEnter={() => setShowMessages(true)}
              onMouseLeave={() => setShowMessages(false)}
            >
              <button className="hover:opacity-60 transition-opacity">
                <Mail className="w-5 h-5 text-black" />
              </button>
              {showMessages && <MessagePanel />}
            </div>

            {/* 通知图标 */}
            <div 
              className="relative flex items-center pt-0.5"
              onMouseEnter={() => setShowNotifications(true)}
              onMouseLeave={() => setShowNotifications(false)}
            >
              <button className="hover:opacity-60 transition-opacity">
                <Bell className="w-5 h-5 text-black" />
              </button>
              {showNotifications && <NotificationPanel />}
            </div>

            <Link 
              to="/subscribe" 
              className="px-4 py-1.5 border border-black text-black text-sm hover:bg-black hover:text-white transition-all rounded"
            >
              订阅
            </Link>
            {isLoggedIn ? (
              <UserProfile />
            ) : (
              <button 
                onClick={() => setShowLoginDialog(true)}
                className="hover:opacity-60 transition-opacity text-sm"
              >
                登录
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
