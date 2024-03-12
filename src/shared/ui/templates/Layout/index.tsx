import Copyright from './Copyright';
import Header from './Header';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Copyright />
    </>
  );
}
