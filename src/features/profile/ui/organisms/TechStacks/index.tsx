import { motion } from 'framer-motion';

export default function TechStacks({ animation }: GlobalAnimation) {
  return (
    <>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Tech Stacks (Accordian)
      </motion.h3>
    </>
  );
}
