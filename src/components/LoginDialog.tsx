import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import logo from 'figma:asset/e5c375aeb9d5459e76d1f4b4579b4d2ffbb0055e.png';
import { ForgotPasswordDialog } from "./ForgotPasswordDialog";
import { toast } from "sonner";

export function LoginDialog() {
  const { showLoginDialog, setShowLoginDialog, login, setShowRegisterDialog } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // 邮箱格式验证
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 重置错误
    setErrors({ email: "", password: "" });
    
    // 验证邮箱格式
    if (!validateEmail(email)) {
      toast.error("邮箱格式错误", {
        description: "请输入有效的邮箱地址"
      });
      setErrors(prev => ({ ...prev, email: "邮箱格式不正确" }));
      return;
    }

    // 验证密码长度
    if (password.length < 6) {
      toast.error("密码错误", {
        description: "密码长度至少为6位"
      });
      setErrors(prev => ({ ...prev, password: "密码长度至少为6位" }));
      return;
    }

    // 尝试登录
    const success = login(email, password);
    
    if (success) {
      toast.success("登录成功", {
        description: `欢迎回来！${email}`
      });
      setEmail("");
      setPassword("");
      setErrors({ email: "", password: "" });
    } else {
      toast.error("登录失败", {
        description: "邮箱或密码错误，请检查后重试"
      });
    }
  };

  return (
    <>
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent 
          className="sm:max-w-[425px] bg-white border border-blue-500 rounded-none shadow-none p-0"
          style={{
            outline: 'none',
          }}
        >
          <div className="p-8">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <DialogTitle className="sr-only">登录</DialogTitle>
              <DialogDescription className="sr-only">登录以使用工具</DialogDescription>
              <div className="ml-2">
                <img 
                  src={logo}
                  alt="dado logo"
                  className="h-14 object-contain"
                />
              </div>
            </div>

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  邮箱
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-blue-500 rounded-none focus-visible:ring-blue-500 bg-white"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-black">
                    密码
                  </Label>
                  <button
                    type="button"
                    className="text-xs text-blue-500 hover:underline"
                    onClick={() => {
                      setShowLoginDialog(false);
                      setShowForgotPassword(true);
                    }}
                  >
                    忘记密码？
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border-blue-500 rounded-none focus-visible:ring-blue-500 bg-white"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                className="w-full bg-white border border-blue-500 text-blue-500 py-3 hover:bg-blue-50 transition-colors flex items-center justify-center"
                style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
              >
                登录
              </button>

              {/* 注册提示 */}
              <p className="text-center text-gray-500 text-sm mt-4">
                还没有账号？{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline"
                  onClick={() => {
                    setShowRegisterDialog(true);
                  }}
                >
                  立即注册
                </button>
              </p>
            </form>
          </div>
        </DialogContent>
      </Dialog>
      
      <ForgotPasswordDialog 
        open={showForgotPassword} 
        onOpenChange={setShowForgotPassword}
      />
    </>
  );
}