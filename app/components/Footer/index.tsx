import { GiHouse, GiNotebook } from 'react-icons/gi';

export default function Footer() {
  return (
    <>
      <div className="h-[3.6875rem]" />
      <footer className="glassMorphism flex justify-around items-center shadow-invert fixed bottom-0 w-full pt-2 pb-1">
        <div className="justify-between flex gap-0.5 flex-col items-center hover:cursor-pointer">
          <GiHouse size="1.5rem" />
          <span className="text-[0.875rem]">홈</span>
        </div>
        <div className="justify-between flex gap-0.5 flex-col items-center hover:cursor-pointer">
          <GiNotebook size="1.5rem" />
          <span className="text-[0.875rem]">블로그</span>
        </div>
      </footer>
    </>
  );
}
