import { Link } from '@remix-run/react';

export default function Logo() {
  return (
    <Link to="/">
      <h1 className="md:text-2xl md:block hidden text-base p-2 font-semibold hover:cursor-pointer">
        사툰사툰
      </h1>
    </Link>
  );
}
