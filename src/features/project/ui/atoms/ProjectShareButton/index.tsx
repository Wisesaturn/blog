import { motion } from 'framer-motion';

import sharePage from '$features/post/lib/sharePage';

import Icons from '$shared/ui/atoms/icons';
import Button from '$shared/ui/molecules/Button';

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
