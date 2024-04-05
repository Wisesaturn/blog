import { motion } from 'framer-motion';

import { ISnippet } from '$features/snippet/types/snippet';

import SnippetCard from '../../molecules/SnippetCard';

interface Props extends GlobalAnimation {
  snippets: Omit<ISnippet, 'body'>[];
}

export default function SnippetList(props: Props) {
  const { animation, snippets } = props;
  return (
    <motion.div className="grid grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1 gap-4 mt-6">
      {snippets.map((snippet) => (
        <SnippetCard animation={animation} key={snippet.index} {...snippet} />
      ))}
    </motion.div>
  );
}
