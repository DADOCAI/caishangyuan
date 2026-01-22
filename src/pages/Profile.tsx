import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import defaultAvatar from 'figma:asset/a664b1ecf8d530f63304885306bfd145f1bcda7d.png';
import { ArrowRight, LogOut, Edit2, Check, X, Key, AlertTriangle, Crown } from 'lucide-react';

type MenuSection = 'center' | 'notifications' | 'security';

async function compressImage(file: File, maxSize = 256, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * ratio));
      const height = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('no canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const mime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mime, quality);
      resolve(dataUrl);
    };
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(e as any);
    };
    img.src = url;
  });
}

export function Profile() {
  const { user, logout, updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState<MenuSection>('center');
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || '');
  
  // 密码相关状态
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // 注销账号相关状态
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const avatarData = await compressImage(file, 256, 0.85);
        updateUser({ avatar: avatarData });
      } catch {}
    }
  };

  const handleSaveName = () => {
    if (newDisplayName.trim()) {
      updateUser({ displayName: newDisplayName });
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setNewDisplayName(user?.displayName || '');
    setIsEditingName(false);
  };
  
  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError('请填写所有字段');
      setPasswordSuccess('');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('新密码和确认密码不一致');
      setPasswordSuccess('');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('新密码长度不能少于6位');
      setPasswordSuccess('');
      return;
    }
    // 这里可以添加实际的密码更改逻辑
    setPasswordError('');
    setPasswordSuccess('密码更改成功');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess('');
    }, 2000);
  };
  
  const handleDeleteAccount = () => {
    // 这里可以添加实际的账号注销逻辑
    alert('账号已注销');
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <p className="text-black text-sm">请先登录</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-40 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex gap-20">
          {/* 左侧导航 */}
          <aside className="w-64 flex-shrink-0 flex flex-col min-h-[calc(100vh-12rem)]">
            {/* 头像 */}
            <div className="mb-12 relative w-16">
              <div className="w-16 h-16 rounded-full border-2 border-[#3b82f6] overflow-hidden">
                <img 
                  src={user.avatar || defaultAvatar} 
                  alt="User avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* 编辑头像按钮 */}
              <label 
                htmlFor="avatar-upload" 
                className="absolute -right-2 bottom-0 w-6 h-6 bg-white border-2 border-[#3b82f6] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3b82f6] hover:text-white transition-colors group"
              >
                <Edit2 className="w-3 h-3 text-[#3b82f6] group-hover:text-white" />
              </label>
              <input 
                id="avatar-upload"
                type="file" 
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* 导航菜单 */}
            <nav className="space-y-2 flex-1">
              <button
                onClick={() => setActiveSection('center')}
                className="flex items-center gap-2 text-black hover:opacity-60 transition-opacity text-left group relative"
              >
                {activeSection === 'center' && (
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#3b82f6] rounded-full" />
                )}
                <span className="text-3xl font-medium">个人中心</span>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#3b82f6]" />
              </button>
              
              <button
                onClick={() => setActiveSection('notifications')}
                className="flex items-center gap-2 text-black hover:opacity-60 transition-opacity text-left group relative"
              >
                {activeSection === 'notifications' && (
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#3b82f6] rounded-full" />
                )}
                <span className="text-3xl font-medium">通知消息</span>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#3b82f6]" />
              </button>
              
              <button
                onClick={() => setActiveSection('security')}
                className="flex items-center gap-2 text-black hover:opacity-60 transition-opacity text-left group relative"
              >
                {activeSection === 'security' && (
                  <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#3b82f6] rounded-full" />
                )}
                <span className="text-3xl font-medium">安全设置</span>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity text-[#3b82f6]" />
              </button>
            </nav>

            {/* 底部登出按钮 */}
            <div className="mt-auto pt-8">
              <button
                onClick={logout}
                className="flex items-center gap-2 text-black hover:opacity-60 transition-opacity"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">登出</span>
              </button>
            </div>
          </aside>

          {/* 右侧内容区 */}
          <main className="flex-1">
            {activeSection === 'center' && (
              <div className="space-y-6">
                <div className="bg-white p-6">
                  <h3 className="text-black text-base mb-4">基本信息</h3>
                  <div className="space-y-3 text-sm">
                    {/* 用户类型 */}
                    <div className="flex items-center">
                      <span className="w-24 text-gray-600">用户类型</span>
                      <div className="flex items-center gap-2">
                        {user.memberType === 'vip' ? (
                          <>
                            <Crown className="w-5 h-5 text-[#FFD700]" />
                            <span className="text-black font-medium" style={{ 
                              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text'
                            }}>
                              订阅会员
                            </span>
                          </>
                        ) : (
                          <span className="text-black">普通用户</span>
                        )}
                      </div>
                    </div>
                    
                    {/* VIP 有效期 */}
                    {user.memberType === 'vip' && user.memberExpiry && (
                      <div className="flex">
                        <span className="w-24 text-gray-600">有效期至</span>
                        <span className="text-black">{user.memberExpiry}</span>
                      </div>
                    )}
                    
                    <div className="flex">
                      <span className="w-24 text-gray-600">用户名</span>
                      {isEditingName ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newDisplayName}
                            onChange={(e) => setNewDisplayName(e.target.value)}
                            className="border border-gray-300 px-2 py-1 rounded"
                          />
                          <Check
                            className="w-4 h-4 text-green-500 cursor-pointer hover:opacity-60"
                            onClick={handleSaveName}
                          />
                          <X
                            className="w-4 h-4 text-red-500 cursor-pointer hover:opacity-60"
                            onClick={handleCancelEdit}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-black">{user.displayName}</span>
                          <Edit2
                            className="w-4 h-4 text-[#3b82f6] cursor-pointer hover:opacity-60"
                            onClick={() => setIsEditingName(true)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex">
                      <span className="w-24 text-gray-600">邮箱</span>
                      <span className="text-black">{user.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="bg-white p-8 text-center">
                <p className="text-sm text-gray-600">暂无新消息</p>
              </div>
            )}
            
            {activeSection === 'security' && (
              <div className="space-y-6">
                {/* 密码设置 */}
                <div className="bg-white p-8">
                  <h3 className="text-black text-base mb-6">密码设置</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Key className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-600">更改密码</span>
                      <button
                        onClick={() => {
                          setIsChangingPassword(!isChangingPassword);
                          setPasswordError('');
                          setPasswordSuccess('');
                        }}
                        className="ml-auto text-sm text-[#3b82f6] hover:opacity-60 transition-opacity"
                      >
                        {isChangingPassword ? '取消' : '更改'}
                      </button>
                    </div>
                    {isChangingPassword && (
                      <div className="ml-7 space-y-3 pt-2">
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">旧密码</span>
                          <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="flex-1 border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:border-[#3b82f6]"
                            placeholder="请输入旧密码"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">新密码</span>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="flex-1 border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:border-[#3b82f6]"
                            placeholder="请输入新密码（至少6位）"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">确认密码</span>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="flex-1 border border-gray-300 px-3 py-1.5 rounded text-sm focus:outline-none focus:border-[#3b82f6]"
                            placeholder="请再次输入新密码"
                          />
                        </div>
                        {passwordError && (
                          <div className="text-sm text-red-500">{passwordError}</div>
                        )}
                        {passwordSuccess && (
                          <div className="text-sm text-green-500">{passwordSuccess}</div>
                        )}
                        <button
                          onClick={handleChangePassword}
                          className="w-full bg-[#3b82f6] text-white py-2 rounded hover:opacity-90 transition-opacity text-sm"
                        >
                          确认更改
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 注销账号 */}
                <div className="bg-white p-8">
                  <h3 className="text-black text-base mb-6">账号安全</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-gray-600">注销账号</span>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="ml-auto text-sm text-red-500 hover:opacity-60 transition-opacity"
                      >
                        注销
                      </button>
                    </div>
                    <p className="ml-7 text-xs text-gray-500">
                      注销账号后，您的所有数据将被永久删除且无法恢复
                    </p>
                  </div>
                </div>

                {/* 注销账号确认对话框 */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                        <h3 className="text-lg">确认注销账号</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-6">
                        此操作不可撤销。注销后，您的所有个人信息、使用记录和数据将被永久删除。
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50 transition-colors text-sm"
                        >
                          取消
                        </button>
                        <button
                          onClick={handleDeleteAccount}
                          className="flex-1 bg-red-500 text-white py-2 rounded hover:opacity-90 transition-opacity text-sm"
                        >
                          确认注销
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
