/**
 * @summary 아래에서 위 방향으로 Fade In Animation
 * @field container
 */
export const ANIMATE_FADE_UP_CONTAINER = {
  show: {
    transition: {
      staggerChildren: 0.125,
    },
  },
};

/**
 * @summary 아래에서 위 방향으로 Fade In Animation
 * @field item
 */
export const ANIMATE_FADE_UP_ITEM = {
  hidden: { opacity: 0, transform: 'translateY(10px)' },
  show: {
    opacity: 1,
    transform: 'translateY(0px)',
  },
};
