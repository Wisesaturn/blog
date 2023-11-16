import { TECHSTACK } from '@utils/constant/resume/techStack';

import TextSection from '../Common/TextSection';

export default function TechStacks() {
  return (
    <div className="flex pt-8 pb-4 gap-10 w-full flex-col">
      {TECHSTACK.map((item, idx) => (
        <TextSection {...item} key={idx} />
      ))}
    </div>
  );
}
