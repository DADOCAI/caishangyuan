import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScrambleText } from "./ScrambleText";
import logoDefault from 'figma:asset/e5c375aeb9d5459e76d1f4b4579b4d2ffbb0055e.png';

export function Envelope() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="relative">
        {/* Invite 手写体文字 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute -top-44 left-1/2 -translate-x-1/2"
              style={{ fontFamily: "'Kunstler Script', 'Dancing Script', cursive", fontSize: "120px", color: "#3b82f6" }}
            >
              Invite
            </motion.div>
          )}
        </AnimatePresence>

        {/* 信封主体 */}
        <motion.div
          className="relative cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <svg
            width="480"
            height="320"
            viewBox="0 0 480 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* 信封背面 */}
            <rect
              x="1"
              y="1"
              width="478"
              height="318"
              fill="white"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            
            {/* 信封内部阴影线 */}
            <line x1="1" y1="1" x2="240" y2="160" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
            <line x1="479" y1="1" x2="240" y2="160" stroke="#3b82f6" strokeWidth="0.5" opacity="0.3" />
            
            {/* 信封顶盖 - 根据状态旋转 */}
            <motion.g
              animate={isOpen ? { rotateX: 180 } : { rotateX: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ originX: "240px", originY: "1px" }}
            >
              <polygon
                points="1,1 240,160 479,1"
                fill="white"
                stroke="#3b82f6"
                strokeWidth="1"
              />
              <line x1="1" y1="1" x2="240" y2="160" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" />
              <line x1="479" y1="1" x2="240" y2="160" stroke="#3b82f6" strokeWidth="0.5" opacity="0.5" />
            </motion.g>

            {/* 信封封口线 */}
            <motion.line
              x1="1"
              y1="1"
              x2="479"
              y2="1"
              stroke="#3b82f6"
              strokeWidth="1"
              animate={isOpen ? { opacity: 0.3 } : { opacity: 1 }}
            />
          </svg>
        </motion.div>

        {/* 纸张 */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: 0, opacity: 0, scale: 0.8 }}
              animate={{ y: -220, opacity: 1, scale: 1 }}
              exit={{ y: 0, opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2"
              style={{ zIndex: 10 }}
            >
              <svg
                width="520"
                height="640"
                viewBox="0 0 520 640"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 纸张背景 */}
                <rect
                  x="1"
                  y="1"
                  width="518"
                  height="638"
                  fill="white"
                  stroke="#3b82f6"
                  strokeWidth="1"
                />
                
                {/* 信件内容 */}
                <foreignObject x="40" y="40" width="440" height="560">
                  <div className="relative p-6 h-full flex flex-col justify-start text-gray-800 pb-24" style={{ fontFamily: "'Noto Sans SC', sans-serif", fontSize: "13px", lineHeight: "1.8" }}>
                    <p className="mb-4">
                      <ScrambleText delay={300} speed={30}>
                        这是一个围绕视觉工具与创作实验展开的设计项目。
                      </ScrambleText>
                    </p>
                    
                    <p className="mb-4">
                      <ScrambleText delay={600} speed={25}>
                        项目起点并非概念设想，而是自真实的设计工作流程。在长期的实践中，我们不断遇到同一个问题：现有工具功能复杂、路径冗长，却难以快速验证视觉判断。
                      </ScrambleText>
                    </p>
                    
                    <p className="mb-4">
                      <ScrambleText delay={1000} speed={25}>
                        因此，这里逐步构建了一组以「效率、可控性与实验性」为核心的视觉工具。它们被用于日常设计、方案测试与风格探索，并在持续使用中不断迭代。
                      </ScrambleText>
                    </p>
                    
                    <p className="mb-4">
                      <ScrambleText delay={1400} speed={25}>
                        项目并不限定特定的创作者身份。无论你是设计师、开发者、影像创作者，还是以视觉作为主要表达方式的实践者，都可以在这一系统中建立、测试并发展属于自己的视觉语言。
                      </ScrambleText>
                    </p>
                    
                    <p className="mb-4">
                      <ScrambleText delay={1400} speed={25}>
                        目前，0.9 测试版已完成。 为了保障工具的持续维护、功能更新与服务器等基础成本，项目将进入付费阶段，相关费用将全部用于项目的长期运转与改进。
                      </ScrambleText>
                    </p>
                    
                    <p style={{ fontWeight: 600 }}>
                      <ScrambleText delay={2200} speed={25}>
                        可以关注我们的公众号 Dadoooo LAB， 获取工具更新、使用说明以及后续实验内容。
                      </ScrambleText>
                    </p>

                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.8, duration: 0.8 }}
                      src="/dadoooo-lab-qr.jpg"
                      alt="Dadoooo LAB 公众号二维码"
                      className="mt-auto self-start w-20 h-auto"
                      loading="lazy"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo1.png'; }}
                    />
                  </div>
                </foreignObject>
                
                {/* 右下角关闭三角形 */}
                <g
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="cursor-pointer"
                  style={{ transition: "opacity 0.2s" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.7";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                  }}
                >
                  <polygon
                    points="470,590 520,590 520,640"
                    fill="#3b82f6"
                    stroke="#3b82f6"
                    strokeWidth="1"
                  />
                </g>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 提示文字 */}
        {!isOpen && (
          <div className="text-center mt-8">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-500 mb-4"
            >
              点击打开
            </motion.p>
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              src={logoDefault}
              alt="dadoooo logo"
              className="h-14 mx-auto object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
