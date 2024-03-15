const HOVER_CLASS = `fill-gray-300 dark:fill-gray-200 hover:cursor-pointer hover:dark:fill-white hover:fill-gray-600 rounded active:bg-gray-200 duration-200 hover:bg-gray-100 hover:dark:bg-[#111]`;
const PURE_ICON_CLASS = `flex items-center p-1 ${HOVER_CLASS}`;
const ICON_SIZE_CLASS = `md:w-[28px] md:h-[28px] w-[24px] h-[24px]`;

const Theme = {
  HOVER_CLASS,
  PURE_ICON_CLASS,
  ICON_SIZE_CLASS,
  ICON_CLASS: `border-[1px] ${ICON_SIZE_CLASS} ${PURE_ICON_CLASS}`,
};

export default Theme;
