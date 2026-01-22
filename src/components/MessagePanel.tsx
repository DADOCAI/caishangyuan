export function MessagePanel() {
  return (
    <div 
      className="absolute right-0 top-full w-[420px]"
      onMouseEnter={(e) => e.stopPropagation()}
    >
      {/* 扩大hover区域的透明区域 */}
      <div className="h-2" />
      
      <div className="bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden">
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-medium text-base">信息</h3>
        </div>

        {/* 空状态 */}
        <div className="flex flex-col items-center justify-center py-20 px-5">
          <div className="w-20 h-20 bg-gradient-to-br from-cyan-300 to-cyan-500 rounded-full flex items-center justify-center mb-4 relative">
            <svg 
              className="w-10 h-10 text-white"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-xs">💤</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">没有新消息。</p>
        </div>
      </div>
    </div>
  );
}