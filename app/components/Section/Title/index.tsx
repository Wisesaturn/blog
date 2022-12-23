import type { TitleProps } from './types';

/**
 *
 * @param isContent 제목 <h1>
 * @param isSubContent 소제목 <h4>
 */

export default function TitleSection(props: TitleProps) {
  const { isContent = 'Seize the day', isSubContent = '' } = props;

  return (
    <section className="flex flex-col gap-4 items-center justify-center max-w-full mx-auto pt-12 pb-20">
      <h1>
        <span className="text-gray-200">{'<'}</span> {isContent}{' '}
        <span className="text-gray-200">{'/>'}</span>
      </h1>
      <h4>{isSubContent}</h4>
    </section>
  );
}
