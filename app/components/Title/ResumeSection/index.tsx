import React from 'react';

export default function ResumeSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={title}>
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
