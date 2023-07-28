import React from 'react';

export default function ResumeSection({
  title,
  showTitle,
  children,
}: {
  title: string;
  showTitle: boolean;
  children: React.ReactNode;
}) {
  return (
    <section id={title}>
      {showTitle && <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>}
      {children}
    </section>
  );
}
