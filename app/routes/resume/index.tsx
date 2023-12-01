import { useEffect, useState, useCallback, memo } from 'react';

import ResumeSection from '@components/Title/ResumeSection';
import ResumeButton from '@components/Button/ResumeButton';
import MainProfile from '@components/ResumeSection/MainProfile';
import Works from '@components/ResumeSection/Works';
import TeamProjects from '@components/ResumeSection/TeamProjects';
import PersonalProjects from '@components/ResumeSection/PersonalProjects';
import Experiences from '@components/ResumeSection/Experiences';
import Activities from '@components/ResumeSection/Activities';
import TechStacks from '@components/ResumeSection/TechStacks';
import Awards from '@components/ResumeSection/Awards';
import Education from '@components/ResumeSection/Education';

import { getIntersectionObserver } from '@utils/lib/getIntersectionObserver';

const sectionArray = {
  Profile: <MainProfile />,
  Works: <Works />,
  'Team Projects': <TeamProjects />,
  'Personal Projects': <PersonalProjects />,
  Experiences: <Experiences />,
  Activities: <Activities />,
  'Tech Stacks': <TechStacks />,
  Awards: <Awards />,
  Education: <Education />,
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
  const [selectThumbnail, setSelectThumbnail] = useState('');
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

  const setThumbnail = useCallback((thumbnail: string) => {
    setSelectThumbnail(thumbnail);
  }, []);

  useEffect(() => {
    const categoryObserver = getIntersectionObserver(setCategory, [0.05, 0.95]);
    const thumbnailObserver = getIntersectionObserver(setThumbnail, [0.7], '0% 0px -70% 0px');

    const categoryElements = Array.from(document.querySelectorAll('section'));
    const thumbnailElements = Array.from(document.querySelectorAll('h3'));

    const categorySection = categoryElements.map((section) => ({
      id: section.id as SectionType,
      scrollY: section.offsetTop,
    }));
    setCategorySection(categorySection);

    categoryElements.map((header) => {
      return categoryObserver.observe(header);
    });

    thumbnailElements.map((header) => {
      return thumbnailObserver.observe(header);
    });

    return () => {
      categoryObserver.disconnect();
      thumbnailObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    setImageVisible(false);
    if (selectThumbnail !== '') {
      setTimeout(() => {
        setImageVisible(true);
      }, 10);
    }
  }, [selectThumbnail]);

  return (
    <>
      <div className="hidden xl:block whitespace-nowrap">
        {imageVisible && (
          <div className="animate-slideRight fixed left-8 top-8 flex-col flex gap-3 items-baseline text-lg leading-relaxed w-60">
            <img
              className="inline-block min-w-[15rem] object-cover"
              src={selectThumbnail}
              alt="프로젝트 썸네일"
              loading="lazy"
            />
          </div>
        )}
      </div>
      <div className="w-full mb-40 max-md:mb-0">
        <h1 className="text-center max-md:py-4 font-light space-x-2 max-md:text-2xl">
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
        <div className="fixed m-8 flex-col flex gap-3 items-baseline text-lg leading-none">
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
