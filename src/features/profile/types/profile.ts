export type ProfileItemTypes = 'default' | 'accordion';

interface DefaultItems {
  subTitle?: string;
  date?: string;
  link?: string;
  list?: string[];
}

interface AccordionItems {
  subTitle: string;
  list: string[];
}

interface ProfileItems {
  default: DefaultItems;
  accordion: AccordionItems[];
}

export interface IProfile<T extends ProfileItemTypes> {
  type: T;
  title: string;
  items: ProfileItems[T];
}
