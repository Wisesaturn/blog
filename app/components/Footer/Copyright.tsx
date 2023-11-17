export default function Copyright() {
  return (
    <div className="text-xs md:text-sm flex justify-center flex-col items-center bg-gray-100 mt-10 py-6 gap-1">
      <span className="text-gray-400">
        {' '}
        © 2023 Copyright <span className="text-gray-500">사툰사툰</span>, based on{' '}
        <span className="text-gray-500">remix</span>
      </span>
    </div>
  );
}
