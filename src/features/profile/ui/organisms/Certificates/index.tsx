import { motion } from 'framer-motion';

export default function Certificates({ animation }: GlobalAnimation) {
  return (
    <>
      <motion.h3 className="text-3xl max-md:text-lg" variants={animation?.variants}>
        Certificates
      </motion.h3>
    </>
  );
}
