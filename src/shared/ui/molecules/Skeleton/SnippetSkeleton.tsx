export default function SnippetSkeleton() {
  return (
    <div className="flex flex-col w-full gap-4 pt-4">
      <div className="flex flex-col gap-2 h-full justify-start">
        <div className="skeleton h-[46px] max-md:h-[32px] w-96 max-md:w-72" />
        <div className="skeleton h-[28px] max-md:h-[24px] w-[600px] max-md:w-[400px]" />
        <div className="skeleton h-[24px] max-md:h-[20px] w-24 max-md:w-16" />
      </div>
      <div className="skeleton h-[400px] w-full" />
    </div>
  );
}
