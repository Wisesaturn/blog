/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import { useRef } from 'react';
import { useNavigate } from '@remix-run/react';
import { motion } from 'framer-motion';

import Input from '$shared/ui/molecules/Input';
import instance from '$shared/api/instance';
import convertString from '$shared/lib/convertString';

export default function SnippetCreater(props: GlobalAnimation) {
  const { animation } = props;
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleCreateSnippet = async () => {
    const inputValue = inputRef.current?.value;
    if (!inputValue) return;
    const snippet = await instance.post('snippet', { title: inputValue });
    navigate(`/snippets/${convertString(snippet.plainTitle, 'spaceToDash')}`);
  };

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <motion.div variants={animation?.variants} className="py-4">
          <Input
            handleSearch={handleCreateSnippet}
            inputType="search"
            ref={inputRef}
            placeholder="스니펫 제목을 입력하세요"
          />
        </motion.div>
      )}
    </>
  );
}
