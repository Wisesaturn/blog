import { motion } from 'framer-motion';

import sharePage from '$features/post/lib/sharePage';

import Icons from '$shared/ui/atoms/icons';
import Button from '$shared/ui/molecules/Button';

export default function ArticleShareButton(props: GlobalAnimation) {
  const { animation } = props;

  return (
    <motion.div className="mx-auto w-fit py-10" variants={animation?.variants}>
      <Button onClick={sharePage}>
        <Button.Icon>
          <Icons.Share />
        </Button.Icon>
        <Button.Text>공유하기</Button.Text>
      </Button>
    </motion.div>
  );
}
