import { motion } from 'motion/react';

import sharePage from '@/features/post/lib/sharePage';

import Icons from '@/commons/ui/icons';
import Button from '@/commons/ui/button/Button';

export default function ArticleShareButton(props: GlobalAnimation) {
  const { animation } = props;

  return (
    <motion.div className="w-fit" variants={animation?.variants}>
      <Button hierarchy="secondary" onClick={sharePage}>
        <Button.Icon>
          <Icons.Share />
        </Button.Icon>
        <Button.Text>공유하기</Button.Text>
      </Button>
    </motion.div>
  );
}
