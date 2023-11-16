import { WORK_이지일렉트릭 } from '@utils/constant/resume/work';

import ProjectSection from '../Common/ProjectSection';

const workSection = [WORK_이지일렉트릭];

export default function Work() {
  return (
    <div className="flex pt-8 pb-4 gap-20 w-full flex-col">
      {workSection.map((data, idx) => (
        <ProjectSection key={idx} data={data} isActive={idx === 0} />
      ))}
    </div>
  );
}
