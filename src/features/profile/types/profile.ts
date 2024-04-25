export type ProfileItemTypes = 'default' | 'accordion' | 'separate';

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

interface SeparateItems {
  summary: {
    date: string;
    role: string;
    department: string;
    introduction: string;
    link?: string;
    linkTitle?: string;
  };
  projects: {
    title: string;
    list: React.ReactNode[];
  }[];
}

interface ProfileItems {
  default: DefaultItems;
  separate: SeparateItems;
  accordion: AccordionItems[];
}

export interface IProfile<T extends ProfileItemTypes> {
  type: T;
  title: string;
  items: ProfileItems[T];
}
