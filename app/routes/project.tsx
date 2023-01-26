import styles from 'highlight.js/styles/github-dark-dimmed.css';
import type { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import TitleSection from '@components/Section/Title';

export const links: LinksFunction = () => {
  return [
    {
      rel: 'stylesheet',
      href: styles,
    },
  ];
};

const ProjectLayout = () => {
  return (
    <>
      <Header isContent="🛠 프로젝트 회고" />
      <TitleSection isContent="🛠 프로젝트 회고" />
      <div className="isWrapper flex flex-col h-full">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default ProjectLayout;
