import {
  TEAMPROJECT_GOTCHA,
  TEAMPROJECT_브이토피아,
  TEAMPROJECT_아주그라운드,
  TEAMPROJECT_언더바,
  TEAMPROJECT_유클러버스,
  TEAMPROJECT_펫탈로그,
} from '@utils/constant/resume/teamProject';

import ProjectSection from '../Common/ProjectSection';

const teamprojectSection = [
  TEAMPROJECT_브이토피아,
  TEAMPROJECT_아주그라운드,
  TEAMPROJECT_언더바,
  TEAMPROJECT_펫탈로그,
  TEAMPROJECT_유클러버스,
  TEAMPROJECT_GOTCHA,
];

export default function TeamProjects() {
  return (
    <div className="flex pt-8 pb-4 gap-20 w-full flex-col">
      {teamprojectSection.map((data, idx) => (
        <ProjectSection key={idx} data={data} isActive={false} />
      ))}
    </div>
  );
}
