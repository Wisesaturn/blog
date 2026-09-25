import { motion } from 'motion/react';

import Icons from '@/commons/ui/icons/Icons';
import Button from '@/commons/ui/button/Button';

import sharePage from '../lib/sharePage';

export default function ProjectShareButton(props: GlobalAnimation) {
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
