import { motion } from 'framer-motion';

export default function Experiences({ animation }: GlobalAnimation) {
  return (
    <>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Experiences (Accordian)
      </motion.h3>
    </>
  );
}
