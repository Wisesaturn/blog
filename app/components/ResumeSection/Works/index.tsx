import { WORK_이지일렉트릭 } from '@utils/constant/resume/work';

import ProjectSection from '../Common/ProjectSection';

const workSection = [WORK_이지일렉트릭];

export default function Work() {
  return (
    <div className="flex pt-8 pb-4 gap-16 w-full flex-col max-md:gap-2">
      {workSection.map((data, idx) => (
        <ProjectSection data={data} isActive={idx === 0} />
      ))}
    </div>
  );
}
