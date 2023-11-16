import { EDUCATION } from '@utils/constant/resume/education';

import TextSection from '../Common/TextSection';

export default function Education() {
  return (
    <div className="flex pt-8 pb-4 gap-4 w-full flex-col">
      {EDUCATION.map((item, idx) => (
        <TextSection {...item} key={idx} />
      ))}
    </div>
  );
}
