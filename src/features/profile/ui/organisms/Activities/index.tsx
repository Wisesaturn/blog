import { motion } from 'framer-motion';

export default function Activities({ animation }: GlobalAnimation) {
  return (
    <>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Activities (Accordian)
      </motion.h3>
    </>
  );
}
