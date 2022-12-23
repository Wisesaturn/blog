export default function PostCardSection() {
  return (
    <section className="max-w-3xl mx-auto w-11/12 flex flex-wrap flex-col justify-between align-center gap-10 md:flex-row">
      <div className="flex flex-col gap-6 md:gap-8 relative md:flex-row md:h-40">
        <div className="w-full h-80 md:h-auto overflow-hidden shadow-md shadow-gray-300 md:min-w-[25%] md:w-1/2">
          <img
            className="rounded-lg w-full h-full object-cover object-left-top"
            alt="Thumbnail"
            src="https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA14SFf6.img?w=560&h=839&m=6&x=227&y=160&s=92&d=92"
          />
        </div>
        <div className="overflow-hidden flex justify-between flex-col">
          <div className="flex justify-between items-center pb-3 md:pb-2">
            <h2 className="md:before:content-['*'] md:before:pr-2 md:before:text-red-300 md:before:absolute md:before:-translate-x-4 md:before:translate-y-0.5">
              글 제목 영역
            </h2>
            <h4>2022. 11. 13</h4>
          </div>
          <p className="h-16 md:h-24 after:content-[''] after:bg-gradient-to-r after:from-[rgb(255,255,255,0)] after:to-[rgb(255,255,255,1)] after:p-3 after:pl-10 after:bottom-0 after:right-0 after:absolute after:-ml-10">
            글 내용은 이러합니다. 글 내용은 이러합니다.글 내용은 이러합니다.글 내용은 이러합니다.글
            내용은 이러합니다.글 내용은 이러합니다.글 내용은 이러합니다. 글 내용은 이러합니다.글
            내용은 이러합니다.글 내용은 이러합니다.글 내용은 이러합니다.글 내용은 이러합니다.글
            내용은 이러합니다. 내용은 이러합니다.글 내용은 이러합니다.글 내용은 이러합니다. 글
            내용은 이러합니다.글 내용은 이러합니다.글 내용은 이러합니다.글 내용은 이러합니다.글
            내용은 이러합니다.글 내용은 이러합니다.내용은 이러합니다.글 내용은 이러합니다.글 내용은
            이러합니다. 글 내용은 이러합니다.글 내용은 이러합니다.글
          </p>
        </div>
      </div>
    </section>
  );
}
