import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../contexts/AuthContext";
import logo from 'figma:asset/e5c375aeb9d5459e76d1f4b4579b4d2ffbb0055e.png';
import { toast } from "sonner";

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPasswordDialog({ open, onOpenChange }: ForgotPasswordDialogProps) {
  const { setShowLoginDialog } = useAuth();
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("邮箱格式错误", {
        description: "请输入有效的邮箱地址"
      });
      return;
    }
    
    // 模拟发送重置邮件
    if (email) {
      setIsSent(true);
      toast.success("密码重置邮件已发送", {
        description: `我们已向 ${email} 发送了密码重置链接，请查收邮件。`
      });
      
      // 3秒后关闭对话框并重置状态
      setTimeout(() => {
        onOpenChange(false);
        setTimeout(() => {
          setIsSent(false);
          setEmail("");
        }, 300);
      }, 3000);
    }
  };

  const handleBackToLogin = () => {
    onOpenChange(false);
    setShowLoginDialog(true);
    setIsSent(false);
    setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[425px] bg-white border border-blue-500 rounded-none shadow-none p-0"
        style={{
          outline: 'none',
        }}
      >
        <div className="p-8">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <DialogTitle className="sr-only">忘记密码</DialogTitle>
            <DialogDescription className="sr-only">重置您的密码</DialogDescription>
            <div className="ml-2">
              <img 
                src={logo}
                alt="dado logo"
                className="h-14 object-contain"
              />
            </div>
          </div>

          {!isSent ? (
            <>
              {/* 标题和说明 */}
              <div className="mb-6 text-center">
                <h2 className="text-xl mb-2">忘记密码</h2>
                <p className="text-sm text-gray-600">
                  输入您的注册邮箱，我们将向您发送密码重置链接
                </p>
              </div>

              {/* 找回密码表单 */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-black">
                    邮箱
                  </Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border-blue-500 rounded-none focus-visible:ring-blue-500 bg-white"
                  />
                </div>

                {/* 发送按钮 */}
                <button
                  type="submit"
                  className="w-full bg-white border border-blue-500 text-blue-500 py-3 hover:bg-blue-50 transition-colors flex items-center justify-center"
                  style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
                >
                  发送重置链接
                </button>

                {/* 返回登录 */}
                <p className="text-center text-gray-500 text-sm mt-4">
                  想起密码了？{" "}
                  <button
                    type="button"
                    className="text-blue-500 hover:underline"
                    onClick={handleBackToLogin}
                  >
                    返回登录
                  </button>
                </p>
              </form>
            </>
          ) : (
            // 发送成功提示
            <div className="text-center py-8">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg 
                    className="w-8 h-8 text-blue-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" 
                    />
                  </svg>
                </div>
                <h2 className="text-xl mb-2">邮件已发送</h2>
                <p className="text-sm text-gray-600">
                  请检查您的邮箱 <span className="text-black">{email}</span>
                  <br />
                  并按照邮件中的说明重置密码
                </p>
              </div>
              
              <button
                type="button"
                className="text-blue-500 hover:underline text-sm"
                onClick={handleBackToLogin}
              >
                返回登录
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}