export default function Works() {
  return (
    <div className="flex gap-4 w-full">
      <div className="w-10 flex items-center justify-center">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-brighter opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-main" />
        </span>
      </div>
      <div>
        <h3 className="text-xl font-semibold">이지일렉트릭</h3>
      </div>
    </div>
  );
}
