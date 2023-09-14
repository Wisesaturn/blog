import type { TitleProps } from './types';

/**
 *
 * @param isContent 제목 <h1>
 * @param isSubContent 소제목 <p>
 */

export default function Title(props: TitleProps) {
  const { isContent = 'Seize the day', isSubContent = '' } = props;

  return (
    <section className="flex flex-col gap-4 items-center justify-center max-w-full mx-auto pt-4 pb-10 md:pt-12 md:pb-20">
      <h2>
        <span className="text-gray-200">{'<'}</span> {isContent}{' '}
        <span className="text-gray-200">{'/>'}</span>
      </h2>
      <p>{isSubContent}</p>
    </section>
  );
}
