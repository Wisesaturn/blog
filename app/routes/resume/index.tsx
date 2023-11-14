import { useEffect, useState, useCallback } from 'react';

import ResumeSection from '@components/Title/ResumeSection';
import ResumeButton from '@components/Button/ResumeButton';
import MainProfile from '@components/ResumeSection/MainProfile';
import Works from '@components/ResumeSection/Works';

import { getIntersectionObserver } from '@utils/lib/getIntersectionObserver';

const sectionArray = {
  Profile: <MainProfile />,
  Works: <Works />,
  'Team Projects': <></>,
  'Personal Projects': <></>,
  Experiences: <></>,
  Activities: <></>,
  'Tech Stacks': <></>,
  Awards: <></>,
};

const disallowTitleSection = ['Contact', 'Profile'];

export type SectionType = keyof typeof sectionArray;

const isSectionType = (item: string): item is SectionType => {
  return item in sectionArray;
};

interface Category {
  id: SectionType;
  scrollY: number;
}

export default function ResumePage() {
  const [selectCategory, setSelectCategory] = useState<SectionType>('Profile');
  const [CategorySection, setCategorySection] = useState<Category[]>([]);

  const handleCategory = useCallback(
    (category: SectionType) => {
      const getScrollY = CategorySection.filter((section) => section.id === category)[0].scrollY;
      window.scrollTo({ top: getScrollY, behavior: 'smooth' });
    },
    [CategorySection],
  );

  useEffect(() => {
    const observer = getIntersectionObserver(setSelectCategory);
    const headingElements = Array.from(document.querySelectorAll('section'));

    const categorySection = headingElements.map((section) => ({
      id: section.id as SectionType,
      scrollY: section.offsetTop,
    }));
    setCategorySection(categorySection);

    headingElements.map((header) => {
      return observer.observe(header);
    });
  }, []);

  return (
    <>
      <div className="w-full">
        <h1
          id="Resume Title"
          className="text-center max-md:py-10 font-light space-x-2 max-md:text-2xl"
        >
          <span className="text-gray-200">{'<'}</span>
          <span className="text-gray-600">이력서</span>
          <span className="text-gray-200">{'/>'}</span>
        </h1>
        <div className="block space-y-10 pb-20">
          {Object.entries(sectionArray).map(([key, value], idx) => (
            <ResumeSection key={idx} title={key} showTitle={!disallowTitleSection.includes(key)}>
              {value}
            </ResumeSection>
          ))}
        </div>
      </div>
      <aside className="hidden md:block whitespace-nowrap">
        <div className="fixed top-8 m-8 flex-col flex gap-3 items-baseline text-lg leading-relaxed">
          {Object.keys(sectionArray).map((item, idx) => {
            if (isSectionType(item)) {
              return (
                <ResumeButton
                  key={idx}
                  target={item}
                  onClick={handleCategory}
                  selected={selectCategory}
                />
              );
            }
            return null;
          })}
        </div>
      </aside>
    </>
  );
}
