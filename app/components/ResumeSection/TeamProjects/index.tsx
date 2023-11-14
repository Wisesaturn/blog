import { TEAMPROJECT_아주그라운드, TEAMPROJECT_언더바 } from '@utils/constant/resume/teamProject';

import ProjectSection from '../Common/ProjectSection';

const teamprojectSection = [TEAMPROJECT_아주그라운드, TEAMPROJECT_언더바];

export default function TeamProjects() {
  return (
    <div className="flex pt-8 pb-4 gap-16 w-full flex-col">
      {teamprojectSection.map((data) => (
        <ProjectSection data={data} isActive={false} />
      ))}
    </div>
  );
}
