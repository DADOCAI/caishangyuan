import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

interface CaptchaProps {
  onChange: (isValid: boolean) => void;
}

export function Captcha({ onChange }: CaptchaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [captchaText, setCaptchaText] = useState("");
  const [userInput, setUserInput] = useState("");

  // 生成随机验证码文本
  const generateCaptchaText = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 排除易混淆字符
    let text = "";
    for (let i = 0; i < 4; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return text;
  };

  // 绘制验证码
  const drawCaptcha = (text: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 背景填充为白色
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 添加干扰线
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.15 + 0.05})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // 添加干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3 + 0.1})`;
      ctx.beginPath();
      ctx.arc(
        Math.random() * canvas.width,
        Math.random() * canvas.height,
        1,
        0,
        2 * Math.PI
      );
      ctx.fill();
    }

    // 绘制验证码文字
    const fontSize = 28;
    ctx.font = `bold ${fontSize}px 'Noto Sans SC', Arial, sans-serif`;
    ctx.textBaseline = "middle";

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const x = 15 + i * 28;
      const y = canvas.height / 2;
      
      // 随机旋转角度
      const angle = (Math.random() - 0.5) * 0.3;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      
      // 随机颜色（深色系）
      const color = `rgba(0, 0, 0, ${Math.random() * 0.4 + 0.6})`;
      ctx.fillStyle = color;
      ctx.fillText(char, 0, 0);
      
      ctx.restore();
    }
  };

  // 刷新验证码
  const refreshCaptcha = () => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    drawCaptcha(newText);
    setUserInput("");
    onChange(false);
  };

  // 初始化验证码
  useEffect(() => {
    refreshCaptcha();
  }, []);

  // 验证用户输入
  useEffect(() => {
    if (userInput.length === 4) {
      const isValid = userInput.toUpperCase() === captchaText;
      onChange(isValid);
    } else {
      onChange(false);
    }
  }, [userInput, captchaText]);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* 验证码画布 */}
        <div className="border border-blue-500 bg-white">
          <canvas
            ref={canvasRef}
            width={130}
            height={45}
            className="cursor-default"
          />
        </div>

        {/* 刷新按钮 */}
        <button
          type="button"
          onClick={refreshCaptcha}
          className="p-2 border border-blue-500 bg-white hover:bg-blue-50 transition-colors"
          title="刷新验证码"
        >
          <RefreshCw className="w-5 h-5 text-blue-500" />
        </button>
      </div>

      {/* 验证码输入框 */}
      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value.slice(0, 4))}
        placeholder="请输入验证码"
        maxLength={4}
        required
        className="w-full px-3 py-2 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black placeholder:text-gray-400"
        style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
      />
    </div>
  );
}
