import type { postingTypes } from '@Types/post';
import { Link } from '@remix-run/react';

export default function PostCardSection(props: { data: any }) {
  const { data } = props;
  return (
    <ul className="isWrapper w-full flex-col gap-10 justify-between align-center md:flex-row">
      {data
        .sort((a: postingTypes, b: postingTypes) => {
          return a.created < b.created ? 1 : -1;
        })
        .map((post: postingTypes) => (
          <Link className="w-full" key={post.index} to={String(post.title).replace(/\s+/g, '-')}>
            <li className="flex flex-col justify-between gap-6 md:gap-8 relative md:flex-row md:h-40">
              <div className="rounded-lg w-full aspect-video md:h-auto overflow-hidden shadow-md shadow-gray-300 md:w-1/2">
                <img
                  className="rounded-lg w-full h-full object-cover object-left-top"
                  alt="썸네일"
                  src={
                    post.thumbnail === ''
                      ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACHCAMAAAAfrCTZAAAAt1BMVEU6wak8v6k6wac6watoOgk+v6ddNhBYNBRoOAg6w6g8v6tlNwtOMhpEMCBjNw5WNBRwz79VyLNHn4JCrZJkQA5KMBxqOARSNBdAtZlKMhpaNw5eOA2F1chcybd608NjzLxWcUtVd05oPgxPhmVYakNaZDxNjWxfUyhDMx1eXDJKmXhgzbei39Rqzb9MkWxCr5deUB5aSiRkShhQgVw+MCRUMhhYVC5WbkZSOhxORChCs5OT3c+x5d3ghZmcAAACKUlEQVR4nO3XaW/aQBCAYa/vGNt4AR/EF6HcOE1K2iaN+/9/VxfnaKW26hciGut9PnlYI814dgejaQAAAAAAAAAAAAAAAAAAAAAAAAAA/Id08Wt0oYnRbOS9rglheZ5+hrTezvjq483PKFutk3Q+en4I4/VkMrldfjhPZm/kahjbnxar7NjG0XKeu4mfHrKntbtwELuJPbHOmuFp6dtk6kz9OF0YWmYmiW/Hvm0vn9Zuw/jSnn6e96hg4ybPbdNxzGChadYh9APbVD12VmpTGyPTvQzd0OlTh8VVPo3t1AzTlYruBnkS+u4wGE4eVThz/SDPh8HtubM8pXVifwmD4WaeqZ5mk8RNA9MeDOKtbhhb1/XDcOhs+zSms7vtwRwkwbobzDMztUPHNZ3A3una7utmY8fT6f25kzy18Wp5WHVX2dY1w8AcPtyPj13VrZvd8iHv18+Somp7edWwlpebb4udJbpdrKu3Et167NHM+oNx1u/6fiP+fcv7pqvNq1948jns6jU8o3yJavm3b75Tqp5I6kYhy2N9XZ37othXmihq0bayinpWcSVEFJVe1FZ1VdVNWetiX7R1rdVNoRdSVo28OHeOJ1WVddVU+7aNZFFH34tK18Re1OJYsCgjWdZevwqW11K1U8hSaF4tpJTq3IpKneO2aSN1gns4xMRxNllNc60Z6h9/91GhDm93IZumPmduAAAAAAAAAAAAAAAAAAAAAAAAAADg1Q88LCON01YgWQAAAABJRU5ErkJggg=='
                      : post.thumbnail
                  }
                />
              </div>
              <div className="overflow-hidden flex justify-between flex-col md:w-full md:pl-5 ">
                <div className="flex justify-between items-center pb-3 md:pb-2">
                  <h2 className="md:before:content-['*'] md:before:pr-2 md:before:text-red-300 md:before:absolute md:before:-translate-x-4 md:before:translate-y-0.5">
                    {post.title ?? '글 제목 영역'}
                  </h2>
                  <h4>{post.created ?? '작성일'}</h4>
                </div>
                <p className="h-16 md:h-24 after:content-[''] after:bg-gradient-to-r after:from-[rgb(255,255,255,0)] after:to-[rgb(255,255,255,1)] after:p-3 after:pl-10 after:bottom-0 after:right-0 after:absolute after:-ml-10">
                  {post.description ?? '글 내용'}
                </p>
              </div>
            </li>
          </Link>
        ))}
    </ul>
  );
}
