export function Ascii() {
  return (
    <div className="bg-white">
      <div className="fixed inset-0 top-[57px]">
        <iframe
          src="/ascii/index.html"
          title="ASCII效果生成器"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
