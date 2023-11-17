export default function SearchSection({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div className="pb-4">
      <input
        placeholder="게시물을 검색하세요"
        className="border-2 rounded-md w-full p-3"
        onFocus={onSearchClick}
        onChange={onSearchClick}
        value=""
      />
    </div>
  );
}
