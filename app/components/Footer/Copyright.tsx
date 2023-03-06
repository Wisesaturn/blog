import { Link } from '@remix-run/react';

export default function Copyright() {
  return (
    <div className="text-[12px] md:text-sm flex justify-center flex-col items-center bg-gray-100 mt-10 py-6">
      <span className="text-gray-400"> © 2023 Copyright by Wisesaturn, based on remix</span>
      <Link to="/write">
        <span className="text-green-main">글쓰기</span>
      </Link>
    </div>
  );
}
