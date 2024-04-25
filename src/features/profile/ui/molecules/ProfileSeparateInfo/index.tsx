import { motion } from 'framer-motion';
import React from 'react';

import { IProfile } from '$features/profile/types/profile';

interface Props extends GlobalAnimation {
  info: IProfile<'separate'>;
}

export default function ProfileSeparateInfo({ animation, info }: Props) {
  const { title, items } = info;
  const { projects, summary } = items;
  const { role, date, department, introduction, link, linkTitle = '홈페이지' } = summary;

  return (
    <motion.div
      variants={animation?.variants}
      className="grid grid-cols-4 max-md:grid-cols-1 gap-4"
    >
      <aside className="h-full col-span-1 max-md:pb-4 max-md:border-b-[1px]">
        <h4 className="text-2xl max-md:text-xl font-medium">{title}</h4>
        <p className="layout-text">{date}</p>
        <p className="layout-text">{role}</p>
        <p className="layout-text">{department}</p>
        <p className="break-keep layout-text pt-10 text-gray-500 dark:text-gray-400">
          {introduction}
        </p>
        {link && (
          <span className="markdown-body">
            <a target="_blank" href={link} className="text-sm max-md:text-xs" rel="noreferrer">
              {linkTitle}
            </a>
          </span>
        )}
      </aside>
      <section className="block max-md:pt-4 col-span-3">
        {projects.map((project, idx) => (
          <React.Fragment key={project.title + idx}>
            <h5 className="font-semibold text-lg max-md:text-base">{project.title}</h5>
            <ul className="p-2 pl-4 space-y-2">
              {project.list.map((content, i) => (
                <li key={i} className="list-disc text-sm">
                  {content}
                </li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </section>
    </motion.div>
  );
}
