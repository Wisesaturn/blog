import React from 'react';

function Ping({ isActive }: { isActive?: boolean }) {
  const activeClass = isActive ? `bg-green-main` : `bg-gray-300`;
  const activeBrighterClass = isActive ? `animate-ping bg-green-brighter` : `hidden`;

  return (
    <span className="relative flex items-center justify-center h-2 w-2 mr-6">
      <span
        className={`${activeBrighterClass} absolute inline-flex h-3 w-3 rounded-full opacity-50`}
      />
      <span className={`${activeClass} relative inline-flex rounded-full h-2 w-2`} />
    </span>
  );
}

export default React.memo(Ping);
