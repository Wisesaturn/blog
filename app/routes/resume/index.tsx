import { useEffect, useState, useCallback } from 'react';

import ResumeSection from '@components/Title/ResumeSection';
import ResumeButton from '@components/Button/ResumeButton';
import MainProfile from '@components/ResumeSection/MainProfile';
import Works from '@components/ResumeSection/Works';
import TeamProjects from '@components/ResumeSection/TeamProjects';
import PersonalProjects from '@components/ResumeSection/PersonalProjects';
import Experiences from '@components/ResumeSection/Experiences';

import { getIntersectionObserver } from '@utils/lib/getIntersectionObserver';

const sectionArray = {
  Profile: <MainProfile />,
  Works: <Works />,
  'Team Projects': <TeamProjects />,
  'Personal Projects': <PersonalProjects />,
  Experiences: <Experiences />,
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
  const [selectProjectThumbnail, setSelectProjectThumbnail] = useState('');
  const [CategorySection, setCategorySection] = useState<Category[]>([]);
  const [imageVisible, setImageVisible] = useState(false);

  const handleCategory = useCallback(
    (category: SectionType) => {
      const getScrollY = CategorySection.filter((section) => section.id === category)[0].scrollY;
      window.scrollTo({ top: getScrollY, behavior: 'smooth' });
    },
    [CategorySection],
  );

  const setCategory = useCallback((category: string) => {
    if (isSectionType(category)) {
      setSelectCategory(category);
    }
  }, []);

  const setProject = useCallback((thumbnail: string) => {
    setSelectProjectThumbnail(thumbnail);
  }, []);

  useEffect(() => {
    const categoryObserver = getIntersectionObserver(setCategory, [0.05]);
    const projectObserver = getIntersectionObserver(setProject, [0.7], '0% 0px -70% 0px');

    const categoryElements = Array.from(document.querySelectorAll('section'));
    const projectElements = Array.from(document.querySelectorAll('h3'));

    const categorySection = categoryElements.map((section) => ({
      id: section.id as SectionType,
      scrollY: section.offsetTop,
    }));
    setCategorySection(categorySection);

    categoryElements.map((header) => {
      return categoryObserver.observe(header);
    });

    projectElements.map((header) => {
      return projectObserver.observe(header);
    });

    return () => {
      categoryObserver.disconnect();
      projectObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    setImageVisible(false);
    if (selectProjectThumbnail !== '') {
      setTimeout(() => {
        setImageVisible(true);
      }, 10);
    }
  }, [selectProjectThumbnail]);

  return (
    <>
      <div className="hidden xl:block whitespace-nowrap">
        {imageVisible && (
          <div className="animate-slideRight fixed left-8 top-8 flex-col flex gap-3 items-baseline text-lg leading-relaxed w-60">
            <img
              className="inline-block min-w-[15rem] object-cover"
              src={selectProjectThumbnail}
              alt="프로젝트 썸네일"
              loading="lazy"
            />
          </div>
        )}
      </div>
      <div className="w-full mb-60">
        <h1 id="Profile" className="text-center max-md:py-10 font-light space-x-2 max-md:text-2xl">
          <span className="text-gray-200">{'<'}</span>
          <span className="text-gray-600">이력서</span>
          <span className="text-gray-200">{'/>'}</span>
        </h1>
        <div className="block pb-20">
          {Object.entries(sectionArray).map(([key, value]) => (
            <ResumeSection key={key} title={key} showTitle={!disallowTitleSection.includes(key)}>
              {value}
            </ResumeSection>
          ))}
        </div>
      </div>
      <aside className="hidden xl:block whitespace-nowrap">
        <div className="fixed m-8 flex-col flex gap-3 items-baseline text-lg leading-relaxed">
          {Object.keys(sectionArray).map((item) => {
            if (isSectionType(item)) {
              return (
                <ResumeButton
                  key={item}
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
