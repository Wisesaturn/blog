import styles from './style.module.css';

interface SpinnerProps {
  layout?: 'full';
}

export default function Spinner(props: SpinnerProps) {
  const { layout } = props;
  return (
    <>
      {layout === 'full' ? (
        <div className="fixed top-10 left-1/2 w-full h-full z-[10000]">
          <div className="border-[1px] w-fit px-8 py-4 rounded-md shadow-md bg-white dark:bg-green-dark -translate-x-1/2 -translate-y-1/2">
            <div className={styles.spinner}></div>
          </div>
        </div>
      ) : (
        <div className={styles.spinner}></div>
      )}
    </>
  );
}
