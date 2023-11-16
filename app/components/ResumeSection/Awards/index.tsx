import { AWARDS_아주톤 } from '@utils/constant/resume/awards';

import TextSection from '../Common/TextSection';

const activitiesSection = [AWARDS_아주톤];

export default function Awards() {
  return (
    <div className="flex pt-8 pb-4 gap-10 w-full flex-col">
      {activitiesSection.map((item, idx) => (
        <TextSection {...item} key={idx} />
      ))}
    </div>
  );
}
