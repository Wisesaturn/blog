import MainProfile from './components/MainProfile';
import Contact from './components/Contact';

export default function ResumePage() {
  return (
    <>
      <section className="w-full">
        <h1 className="text-center py-10 font-light space-x-2">
          <span className="text-gray-200">{'<'}</span>
          <span className="text-gray-600">
            안녕하세요 <span className="text-black font-semibold">송재한</span> 입니다
          </span>
          <span className="text-gray-200">{'/>'}</span>
        </h1>
        <MainProfile />
        <div className="block space-y-10 pb-20">
          <Contact />
          <div className="">
            <h2 className="text-3xl font-semibold tracking-tight">Tech Stacks</h2>
            <p>내용</p>
          </div>
          <div className="">
            <h2 className="text-3xl font-semibold tracking-tight">Experiences</h2>
            <p>내용</p>
          </div>
          <div className="">
            <h2 className="text-3xl font-semibold tracking-tight">Team Projects</h2>
            <p>내용</p>
          </div>
          <div className="">
            <h2 className="text-3xl font-semibold tracking-tight">Personal Projects</h2>
            <p>내용</p>
          </div>
          <div className="">
            <h2 className="text-3xl font-semibold tracking-tight">Activities</h2>
            <p>내용</p>
          </div>
          <div className="">
            <h2 className="text-3xl font-semibold tracking-tight">Awards</h2>
            <p>내용</p>
          </div>
        </div>
      </section>
      <section className="hidden md:block whitespace-nowrap">
        <div className="fixed top-8 m-8 flex-col flex gap-3 items-baseline text-lg leading-relaxed">
          <button type="button" className="px-6 py-1 bg-[#18191b] rounded-full text-white">
            Profile
          </button>
          <button type="button" className="px-6 py-1 bg-white rounded-full text-black">
            Contact
          </button>
          <button type="button" className="px-6 py-1 bg-white rounded-full text-black">
            Tech Stacks
          </button>
          <button type="button" className="px-6 py-1 bg-white rounded-full text-black">
            Experiences
          </button>
          <button type="button" className="px-6 py-1 bg-white rounded-full text-black">
            Team Projects
          </button>
          <button type="button" className="px-6 py-1 bg-white rounded-full text-black">
            Personal Projects
          </button>
          <button type="button" className="px-6 py-1 bg-white rounded-full text-black">
            Activities
          </button>
          <button type="button" className="px-6 py-1 bg-white rounded-full text-black">
            Awards
          </button>
        </div>
      </section>
    </>
  );
}
