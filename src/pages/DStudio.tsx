export function DStudio() {
  return (
    <div className="bg-white">
      <div className="fixed inset-x-0 top-[57px] bottom-0">
        <iframe
          src="/dstudio/index.html"
          title="D · Studio 效果应用"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
