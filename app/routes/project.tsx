import styles from 'highlight.js/styles/github-dark-dimmed.css';
import type { LinksFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import Header from '@components/Header';
import Footer from '@components/Footer';
import TitleSection from '@components/Section/Title';
import Pagination from '@components/Pagination';

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
      <Outlet />
      <Pagination />
      <Footer />
    </>
  );
};

export default ProjectLayout;
