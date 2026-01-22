export function Updates() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-medium mb-12">更新日志</h1>
          
          <div className="space-y-12">
            {/* 版本 1.0 */}
            <div className="border-l-2 border-[#3b82f6] pl-8">
              <div className="flex items-baseline gap-4 mb-4">
                <h3 className="text-2xl font-medium">版本 1.0</h3>
                <span className="text-sm text-gray-500">2024.12.20</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700" style={{ lineHeight: '1.8' }}>
                <li>• 发布三大核心工具：抠图智能化工具、点状效果生成工具、ASCII效果生成器</li>
                <li>• 实现极简风格的2x2网格布局</li>
                <li>• 添加工具面板的蓝色扫描线悬停效果</li>
                <li>• 实现Header中logo的dado/dadoooo切换动画</li>
                <li>• 添加反馈表单弹窗和屏幕保护程序</li>
                <li>• 完成关于页面的交互式信封组件设计</li>
                <li>• 建立完整的设计系统和视觉规范</li>
              </ul>
            </div>

            {/* 版本 0.9 Beta */}
            <div className="border-l-2 border-gray-300 pl-8 opacity-60">
              <div className="flex items-baseline gap-4 mb-4">
                <h3 className="text-2xl font-medium">版本 0.9 Beta</h3>
                <span className="text-sm text-gray-500">2024.12.10</span>
              </div>
              <ul className="space-y-2 text-sm text-gray-700" style={{ lineHeight: '1.8' }}>
                <li>• 内部测试版本发布</li>
                <li>• 完成基础架构搭建</li>
                <li>• 初步设计系统建立</li>
                <li>• 核心功能原型开发</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}