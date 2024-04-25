export type ProfileItemTypes = 'default' | 'accordion';

interface DefaultItems {
  badge?: string;
  date?: string;
  link?: string;
  list?: React.ReactNode[];
}

interface AccordionItems {
  subTitle: string;
  list: React.ReactNode[];
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
