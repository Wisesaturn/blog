import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { useCallback } from 'react';

import Icons from '@/commons/ui/icons/Icons';
import Button from '@/commons/ui/button/Button';

export default function ArticleListButton(props: GlobalAnimation) {
  const { animation } = props;
  const navigate = useNavigate();

  const goToList = useCallback(() => {
    navigate('/posts');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div className="w-fit" variants={animation?.variants}>
      <Button onClick={goToList}>
        <Button.Icon className="text-white dark:text-gray-200">
          <Icons.List />
        </Button.Icon>
        <Button.Text>목록으로</Button.Text>
      </Button>
    </motion.div>
  );
}
