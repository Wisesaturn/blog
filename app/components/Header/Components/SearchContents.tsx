import React, { useEffect, useState, useContext, forwardRef, Ref } from 'react';
import { Link } from '@remix-run/react';

import { EnvContext } from '@app/root';
import useDebounce from '@hooks/useDebounce';

import type { LoadingT } from '@utils/stores/env';
import searchAllDB from '@utils/api/searchAllDB.client';

import type { IFirebasePostReturn } from '@Types/post';

interface ISearchBar {
  input?: string;
  focusIdx: number;
}

const SearchContents = forwardRef((props: ISearchBar, ref: Ref<HTMLElement>) => {
  const { input = '', focusIdx } = props;
  const [isLoadingState, setIsLoadingState] = useState<LoadingT>('loading');
  const debouncedInput = useDebounce(input, 450);
  const [postData, setPostData] = useState<IFirebasePostReturn[]>([]);
  const { ENV: env } = useContext(EnvContext);

  useEffect(() => {
    setIsLoadingState('loading');
    searchAllDB({ env }).then((res: IFirebasePostReturn[]) => {
      const isFilteringData = res
        .filter((data: IFirebasePostReturn) => {
          const lowerCaseTitle = data.plain_title.toLowerCase();
          const lowerCaseInput = debouncedInput.toLowerCase();

          return lowerCaseTitle.includes(lowerCaseInput);
        })
        .slice(0, 5);

      if (isFilteringData.length === 0) setIsLoadingState('empty');
      else setIsLoadingState('none');
      setPostData(isFilteringData);
    });
  }, [debouncedInput, env]);

  const SearchResultCondition: { [k in LoadingT]: React.ReactElement } = {
    none: (
      <>
        {postData.map((data: IFirebasePostReturn, idx) => {
          const focusClass = idx === focusIdx ? 'bg-gray-200' : '';
          return (
            <Link
              reloadDocument
              key={idx}
              to={`${
                data.category
                  ? `/${data.category}/${String(data.plain_title).replace(/\s+/g, '-')}`
                  : `${String(data.plain_title).replace(/\s+/g, '-')}`
              }`}
            >
              <div
                key={idx}
                className={`p-2 px-4 border-t-2 text-black border-gray-100 w-full text-ellipsis overflow-x-hidden whitespace-nowrap hover:bg-gray-100 duration-200 hover:border-gray-100 ${focusClass}`}
              >
                {data.title}
              </div>
            </Link>
          );
        })}
      </>
    ),
    loading: (
      <div className="w-full py-10 flex items-center justify-center">
        <div className="spinner" />
      </div>
    ),
    empty: (
      <span className="p-2 block text-black border-t-2 w-full px-4 border-green-main no-search">
        검색결과가 없습니다
      </span>
    ),
  };

  const SearchResultComponent = () => SearchResultCondition[isLoadingState];

  return (
    <section ref={ref} className="absolute top-12 left-0 w-full bg-white z-9 shadow-md z-[999]">
      {debouncedInput && <SearchResultComponent />}
    </section>
  );
});

export default SearchContents;
