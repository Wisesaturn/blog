import React from 'react';

function Ping() {
  return (
    <span className="relative flex h-2 w-2 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-brighter opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-main" />
    </span>
  );
}

export default React.memo(Ping);
