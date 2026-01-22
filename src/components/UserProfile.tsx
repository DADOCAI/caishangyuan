import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultAvatar from 'figma:asset/a664b1ecf8d530f63304885306bfd145f1bcda7d.png';
import { useAuth } from '../contexts/AuthContext';

export function UserProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 hover:opacity-60 transition-opacity"
      >
        <img 
          src={user.avatar || defaultAvatar} 
          alt="User avatar" 
          className="w-8 h-8 rounded-full object-cover"
        />
        <span className="text-black text-sm">{user.displayName}</span>
      </button>

      {showMenu && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setShowMenu(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-black z-50 shadow-lg">
            <button
              onClick={() => {
                navigate('/profile');
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors"
            >
              个人主页
            </button>
            <div className="border-t border-gray-200" />
            <button
              onClick={() => {
                logout();
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 transition-colors"
            >
              登出
            </button>
          </div>
        </>
      )}
    </div>
  );
}
