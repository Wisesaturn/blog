import styles from './index.module.css';

export default function Skeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonItem} />
      <div className={styles.skeletonItem} />
      <div className={styles.skeletonItem} />
      <div className={styles.skeletonItem} />
      <div className={styles.skeletonItem} />
    </div>
  );
}
