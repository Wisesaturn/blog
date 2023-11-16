import { EXPERIENCE_육군사관학교 } from '@utils/constant/resume/experience';

import TextSection from '../Common/TextSection';

const experiencesSection = [EXPERIENCE_육군사관학교];

export default function Experiences() {
  return (
    <div className="flex pt-8 pb-4 gap-20 w-full flex-col">
      {experiencesSection.map((item, idx) => (
        <TextSection {...item} key={idx} />
      ))}
    </div>
  );
}
