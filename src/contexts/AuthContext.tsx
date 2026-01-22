import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface User {
  email: string;
  displayName: string;
  avatar?: string;
  memberType: 'normal' | 'vip';
  memberExpiry?: string; // VIP到期时间，格式：YYYY-MM-DD
}

interface StoredAuth {
  user: User;
  expiresAt: number;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  showLoginDialog: boolean;
  setShowLoginDialog: (show: boolean) => void;
  showRegisterDialog: boolean;
  setShowRegisterDialog: (show: boolean) => void;
  register: (email: string, password: string) => boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'dadooooo_auth';
const REGISTERED_USERS_KEY = 'dadooooo_users';
const USER_OVERRIDES_KEY = 'dadooooo_profile_overrides';
const ONE_MONTH_MS = 30 * 24 * 60 * 60 * 1000; // 30天的毫秒数

// 测试账号数据
const TEST_ACCOUNTS = {
  'dado@qq.com': {
    password: '123456',
    memberType: 'normal' as const,
  },
  'dado2@qq.com': {
    password: '456789',
    memberType: 'vip' as const,
    memberExpiry: '2026-08-20',
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  // 初始化时从 localStorage 恢复登录状态
  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedAuth) {
      try {
        const parsedAuth: StoredAuth = JSON.parse(storedAuth);
        const now = Date.now();
        
        // 检查是否过期
        if (parsedAuth.expiresAt > now) {
          let restoredUser = parsedAuth.user;
          // 合并覆盖，确保刷新后头像/昵称保留
          try {
            const overridesRaw = localStorage.getItem(USER_OVERRIDES_KEY);
            if (overridesRaw) {
              const overrides = JSON.parse(overridesRaw);
              const ov = overrides[restoredUser.email];
              if (ov) {
                restoredUser = {
                  ...restoredUser,
                  displayName: ov.displayName ?? restoredUser.displayName,
                  avatar: ov.avatar ?? restoredUser.avatar,
                };
              }
            }
          } catch (e) {
            console.error('Failed to merge overrides on restore:', e);
          }
          setUser(restoredUser);
          setIsLoggedIn(true);
        } else {
          // 已过期，清除存储
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch (error) {
        console.error('Failed to parse stored auth:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  const saveAuthToStorage = (user: User) => {
    const expiresAt = Date.now() + ONE_MONTH_MS;
    const authData: StoredAuth = { user, expiresAt };
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    } catch (e) {
      console.error('Failed to save auth to storage:', e);
      try {
        const minimal = { ...user } as any;
        if (minimal.avatar && typeof minimal.avatar === 'string' && minimal.avatar.length > 1000000) {
          delete minimal.avatar;
        }
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ user: minimal, expiresAt }));
        toast.error('头像过大，已临时不保存头像');
      } catch {}
    }
  };

  const login = (email: string, password: string) => {
    // 检查测试账号
    if (email in TEST_ACCOUNTS) {
      const testAccount = TEST_ACCOUNTS[email as keyof typeof TEST_ACCOUNTS];
      if (testAccount.password === password) {
        const displayName = email.split('@')[0];
        let userData: User = {
          email,
          displayName,
          memberType: testAccount.memberType,
          memberExpiry: testAccount.memberExpiry,
        };
        // 合并本地覆盖（头像、昵称等），避免重新登录丢失
        try {
          const overridesRaw = localStorage.getItem(USER_OVERRIDES_KEY);
          if (overridesRaw) {
            const overrides = JSON.parse(overridesRaw);
            const current = overrides[email];
            if (current) {
              userData = {
                ...userData,
                displayName: current.displayName ?? userData.displayName,
                avatar: current.avatar ?? userData.avatar,
              };
            }
          }
        } catch (e) {
          console.error('Failed to load profile overrides:', e);
        }
        setUser(userData);
        setIsLoggedIn(true);
        setShowLoginDialog(false);
        saveAuthToStorage(userData);
        return true;
      }
    }

    // 检查已注册用户
    const registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '{}');
    if (registeredUsers[email] && registeredUsers[email].password === password) {
      let userData = registeredUsers[email];
      // 合并覆盖（头像、昵称等），避免重新登录丢失
      try {
        const overridesRaw = localStorage.getItem(USER_OVERRIDES_KEY);
        if (overridesRaw) {
          const overrides = JSON.parse(overridesRaw);
          const current = overrides[email];
          if (current) {
            userData = {
              ...userData,
              displayName: current.displayName ?? userData.displayName,
              avatar: current.avatar ?? userData.avatar,
            };
          }
        }
      } catch (e) {
        console.error('Failed to load profile overrides:', e);
      }
      setUser(userData);
      setIsLoggedIn(true);
      setShowLoginDialog(false);
      saveAuthToStorage(userData);
      return true;
    }
    
    return false;
  };

  const register = (email: string, password: string) => {
    // 简单的注册逻辑（实际应用中应该调用API）
    const registeredUsers = JSON.parse(localStorage.getItem(REGISTERED_USERS_KEY) || '{}');
    if (!registeredUsers[email]) {
      const displayName = email.split('@')[0]; // 使用邮箱前缀作为默认名字
      const userData: User = { 
        email, 
        displayName, 
        password,
        memberType: 'normal', // 默认为普通用户
      };
      registeredUsers[email] = userData;
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
      setUser(userData);
      setIsLoggedIn(true);
      setShowRegisterDialog(false);
      saveAuthToStorage(userData);
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      saveAuthToStorage(updatedUser);

      // 同步更新到注册用户存储，确保刷新或重新登录后头像等字段仍然存在
      try {
        const registeredUsersRaw = localStorage.getItem(REGISTERED_USERS_KEY);
        if (registeredUsersRaw) {
          const registeredUsers = JSON.parse(registeredUsersRaw);
          if (registeredUsers[user.email]) {
            registeredUsers[user.email] = { ...registeredUsers[user.email], ...updates };
            localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
          }
        }
      } catch (e) {
        console.error('Failed to persist user updates to registered users storage:', e);
      }

      // 统一持久化覆盖到独立 profile overrides（适用于测试账号和所有账号）
      try {
        const overridesRaw = localStorage.getItem(USER_OVERRIDES_KEY);
        const overrides = overridesRaw ? JSON.parse(overridesRaw) : {};
        overrides[user.email] = {
          displayName: updatedUser.displayName,
          avatar: updatedUser.avatar,
        };
        localStorage.setItem(USER_OVERRIDES_KEY, JSON.stringify(overrides));
      } catch (e) {
        console.error('Failed to persist profile overrides:', e);
      }
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn,
        user,
        login, 
        logout, 
        showLoginDialog, 
        setShowLoginDialog,
        showRegisterDialog,
        setShowRegisterDialog,
        register,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
