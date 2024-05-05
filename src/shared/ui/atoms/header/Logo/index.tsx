import { Link } from '@remix-run/react';

export default function Logo() {
  return (
    <Link to="/">
      <p className="md:text-2xl text-base p-2 font-semibold hover:cursor-pointer w-fit">사툰사툰</p>
    </Link>
  );
}
