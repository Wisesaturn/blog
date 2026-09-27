import { motion } from 'motion/react';

import { useListStats } from '@/features/view-count';

import { ISnippet, SnippetCard, snippetStatKey } from '@/entities/snippet';

interface Props extends GlobalAnimation {
  snippets: Omit<ISnippet, 'body'>[];
}

export default function SnippetList(props: Props) {
  const { animation, snippets } = props;
  const stats = useListStats('snippet');
  return (
    <motion.div className="columns-3 max-lg:columns-2 max-sm:columns-1 gap-4 mt-6">
      {snippets.map((snippet) => (
        <div key={snippet.index} className="break-inside-avoid mb-4">
          <SnippetCard
            animation={animation}
            {...snippet}
            views={stats.views(snippetStatKey(snippet))}
            likes={stats.likes(snippetStatKey(snippet))}
          />
        </div>
      ))}
    </motion.div>
  );
}
