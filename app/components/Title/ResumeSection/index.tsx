import React from 'react';

function ResumeSection({
  title,
  showTitle,
  children,
}: {
  title: string;
  showTitle: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={title} className="py-8">
      {showTitle && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
      {children}
    </section>
  );
}

export default React.memo(ResumeSection);
