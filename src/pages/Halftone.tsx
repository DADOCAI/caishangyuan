export function Halftone() {
  return (
    <div className="bg-white">
      <div className="fixed inset-0 top-[57px]">
        <iframe
          src="/halftone/index.html"
          title="点状效果生成工具"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
