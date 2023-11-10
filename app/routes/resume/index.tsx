import { useState } from 'react';

import ResumeSection from '@components/Title/ResumeSection';
import ResumeButton from '@components/Button/ResumeButton';
import MainProfile from '@components/ResumeSection/MainProfile';
import Contact from '@components/ResumeSection/Contact';
import Works from '@components/ResumeSection/Works';

const sectionArray = {
  Profile: <MainProfile />,
  Contact: <Contact />,
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

export default function ResumePage() {
  const [selectCategory, setSelectCategory] = useState<SectionType>('Profile');

  const handleCategory = (category: SectionType) => {
    setSelectCategory(category);

    if (category === 'Profile') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <>
      <section className="w-full">
        <h1 className="text-center py-10 font-light space-x-2">
          <span className="text-gray-200">{'<'}</span>
          <span className="text-gray-600">
            안녕하세요 <span className="text-black font-semibold">송재한</span> 입니다
          </span>
          <span className="text-gray-200">{'/>'}</span>
        </h1>
        <div className="block space-y-10 pb-20">
          {Object.entries(sectionArray).map(([key, value], idx) => (
            <ResumeSection key={idx} title={key} showTitle={!disallowTitleSection.includes(key)}>
              {value}
            </ResumeSection>
          ))}
        </div>
      </section>
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
