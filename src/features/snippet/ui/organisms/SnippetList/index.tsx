import { motion } from 'framer-motion';

import { ISnippet } from '$features/snippet/types/snippet';

import SnippetCard from '../../molecules/SnippetCard';

interface Props extends GlobalAnimation {
  snippets: Omit<ISnippet, 'body'>[];
}

export default function SnippetList(props: Props) {
  const { animation, snippets } = props;
  return (
    <motion.div className="columns-3 max-lg:columns-2 max-sm:columns-1 gap-4 mt-6">
      {snippets.map((snippet) => (
        <div key={snippet.index} className="break-inside-avoid mb-4">
          <SnippetCard animation={animation} {...snippet} />
        </div>
      ))}
    </motion.div>
  );
}
