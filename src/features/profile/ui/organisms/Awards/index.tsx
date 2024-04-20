import { motion } from 'framer-motion';

export default function Awards({ animation }: GlobalAnimation) {
  return (
    <>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Awards
      </motion.h3>
    </>
  );
}
