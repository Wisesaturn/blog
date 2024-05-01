import { motion } from 'framer-motion';
import React from 'react';

import { IProfile } from '$features/profile/types/profile';

interface Props extends GlobalAnimation {
  info: IProfile<'separate'>;
}

export default function ProfileSeparateInfo({ animation, info }: Props) {
  const { title, items } = info;
  const { projects, summary } = items;
  const { role, isWorking, date, department, introduction, link, linkTitle = '홈페이지' } = summary;

  return (
    <motion.div
      variants={animation?.variants}
      className="grid grid-cols-4 max-md:grid-cols-1 gap-4 max-md:gap-0"
    >
      <aside className="col-span-1 max-md:pb-4 max-md:border-b-[1px]">
        <h4 className="text-2xl max-md:text-xl font-medium">{title}</h4>
        <div className="layout-text space-x-1.5 max-md:space-x-1">
          <p className="inline-block">{date}</p>
          {isWorking && (
            <p className="text-green-main dark:text-green-brighter inline-block">재직 중</p>
          )}
        </div>
        <p className="layout-text">{role}</p>
        <p className="layout-text">{department}</p>
        <p className="break-keep layout-text pt-10 text-gray-500 dark:text-gray-400">
          {introduction}
        </p>
        {link && (
          <span className="markdown-body">
            <a target="_blank" href={link} className="text-sm" rel="noreferrer">
              {linkTitle}
            </a>
          </span>
        )}
      </aside>
      <section className="block max-md:pt-4 col-span-3 space-y-4">
        {projects.map((project, idx) => (
          <div key={project.title + idx}>
            <h5 className="font-semibold text-lg max-md:text-base">{project.title}</h5>
            <ul className="p-2 pl-4 space-y-2">
              {project.list.map((content, i) => (
                <li key={i} className="list-disc text-sm markdown-body">
                  {content}
                </li>
              ))}
            </ul>
          </div>
        ))}
        {projects.length === 0 && (
          <h5 className="text-sm text-gray-400">열심히 성과 쌓는 중입니다 😊</h5>
        )}
      </section>
    </motion.div>
  );
}
