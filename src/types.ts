export interface ArticleData {
  id: string;
  category: string;
  title: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  caption: string;
  content: string[]; // Array of paragraphs
  pullQuote?: {
    text: string;
    author: string;
  };
  keyProvisions?: string[];
  tags: string[];
}
