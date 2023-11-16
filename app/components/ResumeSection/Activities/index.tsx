import { ACTIVITY_GDSC, ACTIVITY_두잇, ACTIVITY_모각소 } from '@utils/constant/resume/activities';

import TextSection from '../Common/TextSection';

const activitiesSection = [ACTIVITY_GDSC, ACTIVITY_모각소, ACTIVITY_두잇];

export default function Activities() {
  return (
    <div className="flex pt-8 pb-4 gap-10 w-full flex-col">
      {activitiesSection.map((item, idx) => (
        <TextSection {...item} key={idx} />
      ))}
    </div>
  );
}
