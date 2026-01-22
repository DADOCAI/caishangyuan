import { Footer } from '../components/Footer';

export function VipAgreement() {
  return (
    <>
      <div className="min-h-screen pt-32 pb-20 px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <h1 className="text-4xl font-bold mb-6">dadoooo 会员与付费服务协议</h1>
            <div className="w-16 h-1 bg-black mx-auto"></div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none text-gray-800 space-y-12">
            <section>
              <p className="text-lg leading-relaxed">
                欢迎使用 dadoooo（以下简称「本站」）。<br />
                为了支持平台的长期维护、工具的持续迭代，以及资源整理工作的稳定推进，本站才启用了订阅会员机制。<br />
                订阅费用主要用于网站开发、服务器与域名等基础设施支出，以及相关功能与服务的持续优化。在使用本站提供的工具、资源整理服务及相关功能前，请你仔细阅读并理解本协议内容。一旦你完成付费或继续使用相关服务，即视为你已理解并同意本协议的全部条款。
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">一、平台与服务性质说明</h2>
              <p className="mb-4">dadoooo 是一个以实验性视觉创作工具开发与整理型内容服务为核心的个人创作平台。</p>
              <p className="mb-4">本站提供的服务主要包括但不限于：</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>原创或整合的视觉创作工具</li>
                <li>工具相关的功能解锁与导出服务</li>
                <li>设计相关的学习资料、参考资源的整理与索引</li>
                <li>与视觉创作流程相关的实验性功能与内容展示</li>
              </ul>
              <p>本站并非素材版权交易平台，也不提供任何第三方设计资源的版权转让或使用授权服务。</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">二、工具服务与功能说明</h2>
              <p className="mb-4">本站提供的部分工具可免费使用，部分工具或功能可能需要在订阅或付费后解锁，包括但不限于：</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>高清导出</li>
                <li>视频或动态格式导出</li>
                <li>去除水印</li>
                <li>特定功能或参数解锁</li>
              </ul>
              <p className="mb-4">工具的免费或付费状态可能会随着产品迭代进行调整，本站保留对工具功能结构进行更新与优化的权利。</p>
              <p>本站所提供的工具服务，属于技术与功能层面的服务，不构成对任何设计结果、商业用途或创作成果的保证。</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">三、工具生成内容的使用权说明</h2>
              <p className="mb-4">用户通过 dadoooo 工具生成的图像、视频或其他创作结果，其版权归用户本人所有。</p>
              <p className="mb-4">用户可自行决定生成内容的使用方式，包括但不限于：</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>个人使用</li>
                <li>商业使用</li>
                <li>品牌、产品、客户项目使用</li>
              </ul>
              <p>本站不对用户使用工具生成内容所产生的任何后续行为承担责任，也不对生成内容主张署名权、分成权或追溯权。</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">四、资源整理内容的性质与免责声明</h2>
              <p className="mb-4">本站所展示或提供的资源内容，主要来源于互联网公开信息或用户自行整理分享，属于学习、参考与研究用途的整理与索引内容。</p>
              <p className="mb-4">相关资源的版权、著作权及其他权利，均归原作者或权利人所有。</p>
              <p className="mb-4">用户在使用相关资源时，应自行判断其版权状态及使用范围。如需用于商业用途，用户应自行通过合法渠道取得相应授权。</p>
              <p>因用户使用本站所整理或索引的第三方资源而产生的任何版权纠纷、法律责任或经济损失，均由用户自行承担，本站不承担任何连带责任。</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">五、会员订阅与费用说明</h2>
              <p className="mb-4">会员或订阅费用主要用于支持以下事项：</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>工具的持续开发与功能迭代</li>
                <li>网站服务器、域名、带宽等基础设施支出</li>
                <li>平台日常维护与运营成本</li>
              </ul>
              <p className="mb-4">会员费用不构成对任何第三方资源的购买、转让或授权费用。</p>
              <p>在开通会员服务前，请你充分确认自身需求。一旦会员服务成功开通，原则上不支持退款。</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">六、使用边界与违规处理</h2>
              <p className="mb-4">会员服务仅限本人使用，不得以任何形式进行账号共享、转售、出租或用于其他商业性分发行为。</p>
              <p className="mb-4">对于明显异常、滥用或影响平台正常运行的使用行为，本站有权在不另行通知的情况下，采取包括但不限于限制功能、暂停或终止服务等措施。</p>
              <p>上述处理不视为违约责任认定，亦不构成对用户的其他承诺。</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">七、信息准确性与风险提示</h2>
              <p className="mb-4">本站不保证所提供信息、工具或第三方内容的完整性、准确性或持续可用性。</p>
              <p>用户应自行评估使用本站服务可能带来的风险，并对自身行为承担相应责任。</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">八、侵权处理与联系</h2>
              <p className="mb-4">若你认为本站所展示或整理的内容侵犯了你的合法权益，请通过以下方式联系本站。<br />在核实相关情况后，本站将配合进行必要的处理或删除。</p>
              <p className="font-medium">联系方式：<br />微信：dadoooo</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">九、协议更新与解释权</h2>
              <p className="mb-4">本站有权在必要时对本协议内容进行调整或更新，更新后的协议一经发布即生效。</p>
              <p>本协议的最终解释权归 dadoooo 所有。</p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
