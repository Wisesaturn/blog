import { Link } from '@remix-run/react';

export default function Logo({ title, category }: { title?: string; category?: string }) {
  return (
    <Link to="/">
      {/* 기본 타이틀 */}
      {title === '' && (
        <h1 className="md:text-2xl text-base p-2 font-semibold hover:cursor-pointer">사툰사툰</h1>
      )}
      {/* 커스텀 타이틀 */}
      {title !== '' && (
        <div className="flex flex-col">
          {category !== '' && (
            <span className="text-gray-400 font-normal leading-tight">{category}</span>
          )}
          <p className="font-bold text-sm leading-tight">{title}</p>
        </div>
      )}
    </Link>
  );
}
