// export async function loader() {
//   const searchAllData = await searchAllDB(5);

//   return searchAllData;
// }

export const MainPage = () => {
  // const recentDB = useLoaderData();
  // const headerRef = useRef<HeaderElement | null>(null);

  const categoryClass = `flex gap-1 items-center justify-center py-1 px-4 max-md:text-sm max-md:px-2 max-md:py-1 rounded-lg border-2 text-white border-white dark:border-[#222] before:hidden font-light duration-200`;

  // const onSearchClick = () => {
  //   if (headerRef.current) headerRef.current.onToggleSearchBar();
  // };

  return (
    <>
      {/* <main className="isWrapper min-h-screen flex flex-col">
        <ProfileSection />
        <SearchSection onSearchClick={onSearchClick} />
        <section className="flex gap-2 whitespace-nowrap flex-wrap text-center mb-8">
          {CATEGORY_DATA.map((item: CategoryType) => (
            <Link key={item.name} prefetch="none" to={item.link}>
              <div
                css={css`
                  background-color: ${item.color || '#333'};
                  :hover {
                    border-color: ${item.color || '#333'};
                    color: ${item.color || '#333'};
                    background-color: white;
                  }
                `}
                className={categoryClass}
              >
                {item.icon && item.icon}
                {item.name}
              </div>
            </Link>
          ))}
        </section>
        <div className="flex justify-between items-center">
          <h2>최신글</h2>
          <span className={`${TWstyleIconWrapper} h-min`}>
            <Link to="all" aria-label="show all my posts">
              <SlArrowRight className={`${TWstyleIcon}`} size="1.75rem" />
            </Link>
          </span>
        </div>
        <PostListSection data={recentDB} />
      </main>
      <Copyright />
      <Footer /> */}
    </>
  );
};

export default MainPage;
