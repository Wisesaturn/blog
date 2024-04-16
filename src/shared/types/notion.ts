/**
 * Notion Property
 */
interface BaseProperty {
  id: string;
}

interface File {
  url: string;
  expiry_time: string;
}

interface External {
  url: string;
  expiry_time: string;
}

interface Cover {
  type: string;
  file?: File;
  external?: External;
}

interface Name extends BaseProperty {
  type: 'title';
  title: {
    plain_text: string;
  }[];
}

interface Icon {
  type: 'emoji';
  emoji: string;
}

interface DateBlock {
  // YYYY-MM-DD
  start: string;
  // YYYY-MM-DD
  end: string;
  time_zone: string;
}

interface RichTextBlock {
  type: 'text';
  text: {
    content: string;
    link: string | null;
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
  plain_text: string;
  href: string | null;
}

interface SelectBlock extends BaseProperty {
  color: string;
  name: string;
}

interface Select extends BaseProperty {
  type: 'select';
  select: SelectBlock;
}

interface MultiSelect extends BaseProperty {
  type: 'multi_select';
  multi_select: SelectBlock[];
}

interface CreatedTime extends BaseProperty {
  type: 'created_time';
  created_time: string;
}

interface LastEditedTime extends BaseProperty {
  type: 'last_edited_time';
  last_edited_time: string;
}

interface Link extends BaseProperty {
  type: 'url';
  url: string;
}

interface Text extends BaseProperty {
  type: 'rich_text';
  rich_text: RichTextBlock[];
}

interface Date extends BaseProperty {
  type: 'date';
  date: DateBlock;
}

/**
 * Notion Base Page
 */
interface BasePage {
  object: 'page';
  id: string;
  created_time: string;
  last_edited_time: string;
  cover: Cover | null;
  icon: Icon | null;
  archived: boolean;
  url: string;
}

/**
 * Notion Properties
 */
interface BaseProperties {
  이름: Name;
}

interface PostProperties {
  category: Select;
  tags: MultiSelect;
  createdAt: CreatedTime;
  description: Text;
  lastEditedAt: LastEditedTime;
}

interface ProjectProperties {
  category: Select;
  skills: MultiSelect;
  lastEditedAt: LastEditedTime;
  github: Link;
  website: Link;
  description: Text;
  date: Date;
  role: MultiSelect;
  createdAt: CreatedTime;
  theme: Text;
}

interface SnippetProperties {
  skills: MultiSelect;
  description: Text;
  createdAt: CreatedTime;
  lastEditedAt: LastEditedTime;
}

interface INotion {
  post: PostProperties;
  project: ProjectProperties;
  snippet: SnippetProperties;
}

/**
 * Notion Interface
 */
export interface NotionPage<K> extends BasePage {
  properties: K extends keyof INotion ? INotion[K] & BaseProperties : unknown;
}

export interface INotionList<T> {
  object: 'list';
  results: Array<NotionPage<T>>;
  type: 'page_or_database';
}
