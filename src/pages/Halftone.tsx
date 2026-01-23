export function Halftone() {
  return (
    <div className="bg-white">
      <div className="fixed inset-x-0 top-[57px] bottom-0">
        <iframe
          src="/halftone/index.html"
          title="点状效果生成工具"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
