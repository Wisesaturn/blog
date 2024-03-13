// export async function loader() {
//   const searchAllData = await searchAllDB(5);

import IntroduceSection from '$features/home/ui/organisms/Section/Introduce';

//   return searchAllData;
// }

export const MainPage = () => {
  // const recentDB = useLoaderData();

  const categoryClass = `flex gap-1 items-center justify-center py-1 px-4 max-md:text-sm max-md:px-2 max-md:py-1 rounded-lg border-2 text-white border-white dark:border-[#222] before:hidden font-light duration-200`;

  return (
    <>
      <IntroduceSection />
    </>
  );
};

export default MainPage;
