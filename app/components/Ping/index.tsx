import React from 'react';

function Ping({
  isActive,
  noMargin,
  small,
}: {
  isActive?: boolean;
  noMargin?: boolean;
  small?: boolean;
}) {
  const activeClass = isActive ? `bg-green-main` : `bg-gray-300`;
  const activeBrighterClass = isActive ? `animate-ping bg-green-brighter` : `hidden`;

  return (
    <span
      className={`relative flex items-center justify-center ${small ? 'h-1 w-1 mr-1' : 'h-2 w-2'} ${
        noMargin ? `` : 'mr-6 max-md:mr-3'
      }`}
    >
      <span
        className={`${activeBrighterClass} absolute inline-flex ${
          small ? 'h-2 w-2' : 'h-3 w-3'
        } rounded-full opacity-50`}
      />
      <span
        className={`${activeClass} relative inline-flex rounded-full ${
          small ? 'h-1 w-1' : 'h-2 w-2'
        }`}
      />
    </span>
  );
}

export default React.memo(Ping);
