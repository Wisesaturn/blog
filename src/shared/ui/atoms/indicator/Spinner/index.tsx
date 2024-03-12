import styles from './style.module.css';

interface SpinnerProps {
  layout?: 'full';
}

export default function Spinner(props: SpinnerProps) {
  const { layout } = props;
  return (
    <>
      {layout === 'full' ? (
        <div className="fixed top-0 left-0 bg-gray-300 dark:bg-[#111] dark:bg-opacity-25 h-full translate-1/2 z-[10000] bg-opacity-25 w-full py-10 flex items-center justify-center">
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <div className={styles.spinner}></div>
      )}
    </>
  );
}
