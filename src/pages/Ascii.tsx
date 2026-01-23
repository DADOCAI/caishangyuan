export function Ascii() {
  return (
    <div className="bg-white">
      <div className="fixed inset-x-0 top-[57px] bottom-0">
        <iframe
          src="/ascii/index.html"
          title="ASCII效果生成器"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
