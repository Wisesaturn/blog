import { useSpring, motion, useScroll } from 'framer-motion';

export default function ProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress);

  return (
    <>
      <motion.div
        className={`z-[10000] w-full fixed h-0.5 bg-green-dark left-0`}
        style={{ transformOrigin: 'left', scaleX }}
      />
      <div className="w-full z-[9999] fixed h-0.5 left-0" />
    </>
  );
}
