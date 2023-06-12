import React, { useEffect, useState, useContext } from 'react';
import { Link } from '@remix-run/react';

import useDebounce from '@hooks/useDebounce';
import { EnvContext } from 'root';

import type { LoadingT } from '@utils/stores/env';
import searchAllDB from '@utils/api/searchAllDB.client';

import type { IPost } from '@Types/post';

interface ISearchBar {
  input?: string;
}

export default function SearchContents(props: ISearchBar) {
  const { input = '' } = props;
  const [isLoadingState, setIsLoadingState] = useState<LoadingT>('loading');
  const debouncedInput = useDebounce(input, 450);
  const [postData, setPostData] = useState<IPost[]>([]);
  const env = useContext(EnvContext);

  useEffect(() => {
    setIsLoadingState('loading');
    searchAllDB(5, env).then((res: any) => {
      const isFilteringData = res.filter((data: IPost) => {
        return data.plain_title.includes(debouncedInput);
      });

      if (isFilteringData.length === 0) setIsLoadingState('empty');
      else setIsLoadingState('none');
      setPostData(isFilteringData);
    });
  }, [debouncedInput, env]);

  const SearchResultCondition: { [k in LoadingT]: React.ReactElement } = {
    none: (
      <>
        {postData.map((data: IPost, idx) => {
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
              <div key={idx} className="p-2 px-4 border-t-2 border-green-main">
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
      <span className="p-2 block border-t-2 w-full px-4 border-green-main">
        검색결과가 없습니다
      </span>
    ),
  };

  const SearchResultComponent = () => SearchResultCondition[isLoadingState];

  return (
    <section className="absolute top-12 left-0 w-full bg-white z-9 shadow-md">
      {debouncedInput && <SearchResultComponent />}
    </section>
  );
}