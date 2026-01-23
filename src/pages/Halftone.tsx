import { Footer } from "../components/Footer";

export function Halftone() {
  return (
    <div className="bg-white">
      <div className="fixed inset-x-0 top-[57px] bottom-[72px]">
        <iframe
          src="/halftone/index.html"
          title="点状效果生成工具"
          className="w-full h-full border-0"
        />
      </div>
      <div className="fixed left-0 right-0 bottom-0 z-40">
        <Footer />
      </div>
    </div>
  );
}
