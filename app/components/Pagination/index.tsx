import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';

import Button from '@components/Button';

export default function Pagination() {
  return (
    <div className="isWrapper text-justify align-center justify-center gap-5">
      <Button isLabel={<MdKeyboardArrowLeft size="20" />} />
      <ul className="flex gap-4 text-justify p-2">
        <li className="text-sm md:text-xl">1</li>
      </ul>
      <Button isLabel={<MdKeyboardArrowRight size="20" />} />
    </div>
  );
}
