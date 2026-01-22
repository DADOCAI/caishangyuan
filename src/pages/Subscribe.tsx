import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Footer } from '../components/Footer';

export function Subscribe() {
  const { isLoggedIn, setShowLoginDialog } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    if (!isLoggedIn) {
      setShowLoginDialog(true);
      return;
    }
    setSelectedPlan(plan);
    // TODO: 后续实现支付逻辑
    alert(`您选择了${plan === 'monthly' ? '月度' : '年度'}会员，支付功能即将上线`);
  };

  return (
    <>
      <div className="min-h-screen pt-32 pb-20 px-8">
        <div className="max-w-6xl mx-auto">
          {/* 标题区域 */}
        <div className="text-center mb-24">
          <h1 
            className="text-5xl mb-6 tracking-tight"
            style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Microsoft Yahei", "SimHei", sans-serif', letterSpacing: '-0.02em', fontWeight: 900 }}
          >
            订阅 dadoooo Pro  加速你的创作进程
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Microsoft Yahei", "SimHei", sans-serif' }}>
            您的订阅奉献将全部用于工具迭代，<br className="hidden md:block" />同时解锁高清 / 视频导出、无水印及视觉资源收藏
          </p>
        </div>

        {/* 会员计划 */}
        <div className="flex flex-row justify-center items-stretch gap-6 max-w-full mx-auto mb-32 px-4 overflow-x-auto">
            <div 
              className="flex-1 min-w-[300px] border-2 p-8 transition-all duration-300 cursor-default hover:shadow-2xl border-gray-200 hover:border-gray-400 flex flex-col"
            >
              <div className="text-center flex flex-col h-full">
                <div className="h-[180px]">
                  <h2 className="text-2xl mb-4">免费版</h2>
                  <div className="mb-8">
                    <span className="text-5xl">¥0</span>
                  </div>
                </div>
                <div className="w-full">
                  <button
                    className="w-full h-12 flex items-center justify-center border border-gray-300 bg-white text-black hover:bg-gray-50 transition-colors"
                  >
                    免费使用
                  </button>
                  <div className="space-y-2 text-left mx-auto max-w-xs mt-6">
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>部分工具免费使用</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>精选资源免费分享</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>基础图片导出（含水印）</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>标准分辨率导出</span></div>
                  </div>
                </div>
              </div>
            </div>
            {/* 月度会员 */}
            <div 
              className={`flex-1 min-w-[300px] border-2 p-8 transition-all duration-300 cursor-pointer hover:shadow-2xl flex flex-col ${
                selectedPlan === 'monthly' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="text-center flex flex-col h-full">
                <div className="h-[180px]">
                  <h2 className="text-2xl mb-4">月度会员</h2>
                  <div className="mb-8">
                    <span className="text-5xl">¥66</span>
                    <span className="text-gray-600 ml-2">/月</span>
                  </div>
                </div>
                <div className="w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe('monthly');
                    }}
                    className="w-full h-12 flex items-center justify-center border border-transparent bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    立即订阅
                  </button>
                  <div className="space-y-2 text-left mx-auto max-w-xs mt-6">
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>高清图片 / 视频导出</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>全工具解锁</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>无水印导出</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>精选资源库解锁</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>优先客服支持</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 年度会员 */}
            <div 
              className={`flex-1 min-w-[300px] border-2 p-8 transition-all duration-300 cursor-pointer hover:shadow-2xl relative flex flex-col ${
                selectedPlan === 'yearly' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
              }`}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-1 text-sm">
                推荐
              </div>
              <div className="text-center flex flex-col h-full">
                <div className="h-[180px]">
                  <h2 className="text-2xl mb-4">年度会员</h2>
                  <div className="mb-2">
                    <span className="text-5xl">¥159</span>
                    <span className="text-gray-600 ml-2">/年</span>
                  </div>
                  <p className="text-sm text-gray-600">平均每月 ¥13.3，节省 80%</p>
                </div>
                <div className="w-full">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubscribe('yearly');
                    }}
                    className="w-full h-12 flex items-center justify-center border border-transparent bg-black text-white hover:bg-gray-800 transition-colors"
                  >
                    立即订阅
                  </button>
                  <div className="space-y-2 text-left mx-auto max-w-xs mt-6">
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>高清图片 / 视频导出</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>全工具解锁</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>无水印导出</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>精选资源库解锁</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>专属客服支持</span></div>
                    <div className="flex items-start gap-2"><span className="text-green-600">✓</span><span>新功能 / 新工具优先体验</span></div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* 会员特权 */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl text-center mb-16">会员特权</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
            <div className="flex gap-6">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl mb-2">无限使用工具</h3>
                <p className="text-gray-600">
                  解锁全部视觉工具与核心功能，订阅期间不限使用次数，支持个人与商业创作。
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl mb-2">高清导出</h3>
                <p className="text-gray-600">
                  支持高清图片与视频导出，输出无水印成品，满足实际交付与商用需求。
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl mb-2">优先支持</h3>
                <p className="text-gray-600">
                  享受会员优先客服支持，问题反馈与使用协助更快响应。
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl mb-2">更多视觉资源</h3>
                <p className="text-gray-600">
                  解锁会员专属与进阶视觉资源，用于工具测试、风格探索与创作参考。
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl mb-2">独家功能体验</h3>
                <p className="text-gray-600">
                  会员可优先体验新工具、新功能与实验性特性，提前参与工具演进过程。
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <h3 className="text-xl mb-2">商用创作授权</h3>
                <p className="text-gray-600">
                  使用本站工具生成的作品，可用于个人或商业项目发布与交付，版权归创作者本人所有。
                </p>
              </div>
            </div>
          </div>
        </div>

        

        {/* 常见问题 */}
        <div className="max-w-3xl mx-auto mt-32">
          <h2 className="text-3xl text-center mb-16">常见问题</h2>
          <div className="space-y-8">
            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl mb-3">可以申请退款吗？</h3>
              <p className="text-gray-600">
                会员服务属于数字化服务，一经开通即视为服务开始使用。请在购买前充分确认需求，会员开通后暂不支持退款或退订，敬请理解。
              </p>
            </div>

            <div className="border-b border-gray-200 pb-8">
              <h3 className="text-xl mb-3">会员服务主要包含哪些内容？</h3>
              <p className="text-gray-600">
                会员服务主要用于支持本站视觉工具的持续开发与运行。会员可在订阅有效期内使用对应权限内的工具功能，并享受高清 / 无水印导出及会员专属权益。
              </p>
            </div>

            <div className="pb-8">
              <h3 className="text-xl mb-3">购买后无法使用怎么办？</h3>
              <p className="text-gray-600">
                如遇到功能异常、权限未生效或使用问题，可通过客服渠道联系处理。建议在购买前确认网络环境与设备条件符合网站使用要求
              </p>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
