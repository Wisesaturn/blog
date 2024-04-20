import { motion } from 'framer-motion';

interface Props extends GlobalAnimation {
  children: string;
}

export default function ProfileCategory({ animation, children }: Props) {
  return (
    <motion.h3
      className="text-3xl max-md:text-2xl pt-12 max-md:pt-8"
      variants={animation?.variants}
    >
      {children}
    </motion.h3>
  );
}
