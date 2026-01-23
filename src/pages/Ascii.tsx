import { Footer } from "../components/Footer";

export function Ascii() {
  return (
    <div className="bg-white">
      <div className="fixed inset-x-0 top-[57px] bottom-[72px]">
        <iframe
          src="/ascii/index.html"
          title="ASCII效果生成器"
          className="w-full h-full border-0"
        />
      </div>
      <div className="fixed left-0 right-0 bottom-0 z-40">
        <Footer />
      </div>
    </div>
  );
}
