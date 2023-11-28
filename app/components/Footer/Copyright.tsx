import Contact from '@components/ResumeSection/Contact';

export default function Copyright() {
  return (
    <footer className="text-xs md:text-sm flex justify-center flex-col items-center bg-gray-100 dark:bg-[#232323] mt-10 py-6 gap-1">
      <Contact />
      <span className="text-gray-400 dark:text-gray-200">
        {' '}
        © 2023 Copyright <span className="text-gray-500 dark:text-white">사툰사툰</span>, based on{' '}
        <span className="text-gray-500 dark:text-white">remix</span>
      </span>
    </footer>
  );
}
