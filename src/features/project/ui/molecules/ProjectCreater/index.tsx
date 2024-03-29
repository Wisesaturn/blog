/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useRef } from 'react';
import { useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';

import { IPost } from '$features/post/types/post';

import Input from '$shared/ui/molecules/Input';
import instance from '$shared/api/instance';
import convertString from '$shared/lib/convertString';

export default function ProjectCreater(props: GlobalAnimation) {
  const { animation } = props;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCreateProject = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue) return;
    const { plain_title }: IPost = await instance.post('project', { title: inputValue });
    navigate(`/projects/${convertString(plain_title, 'spaceToDash')}`);
  };

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <motion.div variants={animation?.variants} className="py-4">
          <Input
            handleSearch={handleCreateProject}
            inputType="search"
            ref={inputRef}
            placeholder="프로젝트 제목을 입력하세요"
          />
        </motion.div>
      )}
    </>
  );
}
