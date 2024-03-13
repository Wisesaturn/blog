import React from 'react';

/**
 * @summary Desktop 또는 Mobile 반응형 Layout
 * @returns
 */
function Responsive({ children }: { children: React.ReactNode }) {
  if (!children) {
    throw new Error('Responsive 내부에 Mobile 또는 Desktop Container를 담아야 합니다.');
  }

  const isDesktop = React.isValidElement(children) && children.type === Responsive.Desktop;
  const isMobile = React.isValidElement(children) && children.type === Responsive.Mobile;

  return <>{isDesktop || isMobile ? children : null}</>;
}

Responsive.Desktop = function DesktopContainer({ children }: { children: React.ReactNode }) {
  return <div className="md:block hidden">{children}</div>;
};

Responsive.Mobile = function MobileContainer({ children }: { children: React.ReactNode }) {
  return <div className="block md:hidden">{children}</div>;
};

export default Responsive;
