import { motion } from 'framer-motion';

export default function Works({ animation }: GlobalAnimation) {
  return (
    <>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Works (Accordian)
      </motion.h3>
    </>
  );
}
