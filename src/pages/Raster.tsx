export function Raster() {
  return (
    <div className="bg-white">
      <div className="fixed inset-x-0 top-[57px] bottom-0">
        <iframe
          src="/raster/index.html"
          title="光栅效果生成器"
          className="w-full h-full border-0"
        />
      </div>
    </div>
  );
}
