export default function PostSkeleton() {
  return (
    <div className="flex flex-col w-full gap-4">
      <div className="skeleton h-[500px] max-md:h-[250px]" style={{ borderRadius: '1.5rem' }} />
      <div className="flex flex-col gap-2 h-full justify-start">
        <div className="skeleton h-[24px] max-md:h-[20px] w-32 max-md:w-24" />
        <div className="skeleton h-[46px] max-md:h-[32px] w-96 max-md:w-72" />
        <div className="skeleton h-[28px] max-md:h-[24px] w-[600px] max-md:w-[400px]" />
        <div className="skeleton h-[24px] max-md:h-[20px] w-24 max-md:w-16" />
      </div>
      <div className="flex gap-4 pt-4 w-full h-full justify-center max-mad:flex-col max-md:flex-col-reverse">
        <div className="skeleton h-[800px] w-3/4 max-md:w-full max-md:h-[600px]" />
        <div className="skeleton h-[200px] w-1/4 max-md:w-full" />
      </div>
    </div>
  );
}
