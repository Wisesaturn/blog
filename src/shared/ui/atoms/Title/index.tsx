import { motion } from 'framer-motion';

interface TitleProps extends GlobalAnimation {
  title: string;
  subtitle?: string;
}

/**
 * @summary 페이지 혹은 카테고리의 타이틀 컴포넌트
 * @returns
 */
export default function Title(props: TitleProps) {
  const { title, subtitle, animation } = props;

  return (
    <motion.div variants={animation?.variants} className="mt-8">
      <motion.h1 className="text-[3.5rem] leading-tight tracking-tight max-md:text-4xl">
        {title}
      </motion.h1>
      {subtitle && (
        <motion.h2 className="text-2xl text-gray-400 font-light max-md:text-base max-md:leading-tight max-md:pt-1">
          {subtitle}
        </motion.h2>
      )}
    </motion.div>
  );
}
