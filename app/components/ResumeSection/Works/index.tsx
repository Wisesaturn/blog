import { WORK_이지일렉트릭 } from '@utils/constant/resume';

import WorkSection from './WorkSection';

const workSection = [WORK_이지일렉트릭];

export default function Works() {
  return (
    <div className="flex pt-8 pb-4 gap-4 w-full flex-col max-md:gap-2">
      {workSection.map((data, idx) => (
        <WorkSection data={data} isActive={idx === 0} />
      ))}
    </div>
  );
}
