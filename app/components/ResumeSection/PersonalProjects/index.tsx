import {
  PERSONALPROJECT_블로그,
  PERSONALPROJECT_푸드모아,
} from '@utils/constant/resume/personalProject';

import ProjectSection from '../Common/ProjectSection';

const personalProjectsSection = [PERSONALPROJECT_푸드모아, PERSONALPROJECT_블로그];

export default function PersonalProjects() {
  return (
    <div className="flex pt-8 pb-4 gap-16 w-full flex-col">
      {personalProjectsSection.map((data, idx) => (
        <ProjectSection key={idx} data={data} isActive={false} />
      ))}
    </div>
  );
}
