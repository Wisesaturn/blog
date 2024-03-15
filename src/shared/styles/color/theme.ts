const HOVER_CLASS = `fill-gray-300 hover:cursor-pointer hover:border-gray-400 hover:bg-gray-100 hover:fill-gray-600 dark:fill-gray-200 hover:dark:border-green-main hover:dark:fill-green-main active:dark:border-green-darker active:dark:fill-green-darker hover:dark:bg-transparent rounded active:bg-gray-200 duration-200`;
const PURE_ICON_CLASS = `flex items-center p-1 ${HOVER_CLASS}`;
const ICON_SIZE_CLASS = `md:w-[28px] md:h-[28px] w-[24px] h-[24px]`;

const Theme = {
  HOVER_CLASS,
  PURE_ICON_CLASS,
  ICON_SIZE_CLASS,
  ICON_CLASS: `border-[1px] ${ICON_SIZE_CLASS} ${PURE_ICON_CLASS}`,
};

export default Theme;
