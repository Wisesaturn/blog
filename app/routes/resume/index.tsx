import { useState } from 'react';

import ResumeSection from '@components/Title/ResumeSection';
import ResumeButton from '@components/Button/ResumeButton';

import MainProfile from './components/MainProfile';
import Contact from './components/Contact';

const sectionArray = {
  Profile: <MainProfile />,
  Contact: <Contact />,
  'Tech Stacks': <></>,
  Experiences: <></>,
  'Team Projects': <></>,
  'Personal Projects': <></>,
  Activities: <></>,
  Awards: <></>,
};

export type SectionType = keyof typeof sectionArray;

export default function ResumePage() {
  const [selectCategory, setSelectCategory] = useState<keyof typeof sectionArray>('Profile');

  const handleCategory = (category: keyof typeof sectionArray) => {
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
            <ResumeSection key={idx} title={key !== 'Profile' ? key : ''}>
              {value}
            </ResumeSection>
          ))}
        </div>
      </section>
      <section className="hidden md:block whitespace-nowrap">
        <div className="fixed top-8 m-8 flex-col flex gap-3 items-baseline text-lg leading-relaxed">
          {Object.keys(sectionArray).map((item, idx) => (
            <ResumeButton
              key={idx}
              target={item}
              onClick={handleCategory}
              selected={selectCategory}
            />
          ))}
        </div>
      </section>
    </>
  );
}
