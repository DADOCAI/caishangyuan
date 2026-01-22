export function Raster() {
  return (
    <div className="bg-white">
      <div className="fixed inset-0 top-[57px]">
        <iframe
          src="/raster/index.html"
          title="光栅效果生成器"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
