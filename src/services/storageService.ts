import { ArticleData } from "../types";
import PUBLISHED_ARTICLES from "../data/published.json";

const ARTICLES_KEY = "gnn_articles_storage";
const SUBS_KEY = "gnn_subscribers_storage";

export const getArticles = (): ArticleData[] => {
  const stored = localStorage.getItem(ARTICLES_KEY);
  if (!stored) {
    // Standard site boot: use published articles from the bot/git
    localStorage.setItem(ARTICLES_KEY, JSON.stringify(PUBLISHED_ARTICLES));
    return PUBLISHED_ARTICLES as ArticleData[];
  }
  return JSON.parse(stored);
};

export const saveArticle = (article: ArticleData) => {
  const articles = getArticles();
  const index = articles.findIndex(a => a.id === article.id);
  
  if (index >= 0) {
    articles[index] = article;
  } else {
    articles.unshift({ ...article, id: Date.now().toString() });
  }
  
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  return articles;
};

export const deleteArticle = (id: string) => {
  const articles = getArticles().filter(a => a.id !== id);
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
  return articles;
};

export const subscribeToNewsletter = async (email: string) => {
  const subs = JSON.parse(localStorage.getItem(SUBS_KEY) || "[]");
  if (!subs.includes(email)) {
    subs.push(email);
    localStorage.setItem(SUBS_KEY, JSON.stringify(subs));
  }
  return { success: true };
};

export const getSubscribers = (): string[] => {
  return JSON.parse(localStorage.getItem(SUBS_KEY) || "[]");
};
