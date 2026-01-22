import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import logo from 'figma:asset/e5c375aeb9d5459e76d1f4b4579b4d2ffbb0055e.png';
import { Captcha } from "./Captcha";
import { toast } from "sonner";

export function RegisterDialog() {
  const { showRegisterDialog, setShowRegisterDialog, register, setShowLoginDialog } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [errors, setErrors] = useState({ 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });

  // 邮箱格式验证
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 密码强度验证
  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "密码长度至少为6位";
    }
    if (password.length > 20) {
      return "密码长度不能超过20位";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 重置错误
    setErrors({ email: "", password: "", confirmPassword: "" });
    
    // 验证邮箱格式
    if (!validateEmail(email)) {
      toast.error("邮箱格式错误", {
        description: "请输入有效的邮箱地址，例如：user@example.com"
      });
      setErrors(prev => ({ ...prev, email: "邮箱格式不正确" }));
      return;
    }

    // 验证密码强度
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error("密码强度不足", {
        description: passwordError
      });
      setErrors(prev => ({ ...prev, password: passwordError }));
      return;
    }

    // 验证密码匹配
    if (password !== confirmPassword) {
      toast.error("密码不匹配", {
        description: "两次输入的密码不一致，请重新输入"
      });
      setErrors(prev => ({ ...prev, confirmPassword: "密码不一致" }));
      return;
    }
    
    // 验证码检查
    if (!isCaptchaValid) {
      toast.error("验证码错误", {
        description: "请输入正确的验证码"
      });
      return;
    }
    
    // 尝试注册
    const success = register(email, password);
    
    if (success) {
      toast.success("注册成功", {
        description: `欢迎加入！${email}`
      });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setErrors({ email: "", password: "", confirmPassword: "" });
    } else {
      toast.error("注册失败", {
        description: "该邮箱已被注册，请使用其他邮箱或直接登录"
      });
    }
  };

  return (
    <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
      <DialogContent 
        className="sm:max-w-[425px] bg-white border border-blue-500 rounded-none shadow-none p-0"
        style={{
          outline: 'none',
        }}
      >
        <div className="p-8">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <DialogTitle className="sr-only">注册</DialogTitle>
            <DialogDescription className="sr-only">创建新账号</DialogDescription>
            <div className="ml-2">
              <img 
                src={logo}
                alt="dado logo"
                className="h-14 object-contain"
              />
            </div>
          </div>

          {/* 注册表单 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="register-email" className="text-black">
                邮箱
              </Label>
              <Input
                id="register-email"
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
              <Label htmlFor="register-password" className="text-black">
                密码
              </Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-blue-500 rounded-none focus-visible:ring-blue-500 bg-white"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-black">
                确认密码
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-blue-500 rounded-none focus-visible:ring-blue-500 bg-white"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            {/* 验证码 */}
            <div className="space-y-2">
              <Label htmlFor="captcha" className="text-black">
                验证码
              </Label>
              <Captcha
                onChange={setIsCaptchaValid}
              />
            </div>

            {/* 注册按钮 */}
            <button
              type="submit"
              className="w-full bg-white border border-blue-500 text-blue-500 py-3 hover:bg-blue-50 transition-colors flex items-center justify-center"
              style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
            >
              注册
            </button>

            {/* 登录提示 */}
            <p className="text-center text-gray-500 text-sm mt-4">
              已有账号？{" "}
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() => {
                  setShowRegisterDialog(false);
                  // 打开登录对话框
                  setTimeout(() => {
                    setShowLoginDialog(true);
                  }, 100);
                }}
              >
                立即登录
              </button>
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}