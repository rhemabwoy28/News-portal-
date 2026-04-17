import { GoogleGenAI, Type } from "@google/genai";
import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GNN_BOT_KEY || process.env.GEMINI_API_KEY });

const parser = new Parser();

const SOURCES = [
  { name: "Joy News", url: "https://www.myjoyonline.com/feed/" },
  { name: "Daily Graphic", url: "https://www.graphic.com.gh/news.feed?type=rss" }
];

async function getSubjectImage(subject: string) {
  try {
    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: process.env.GOOGLE_SEARCH_API_KEY,
        cx: process.env.GOOGLE_SEARCH_CX,
        q: `${subject} ghana news`,
        searchType: "image",
        num: 1,
        safe: "active"
      }
    });
    return response.data.items?.[0]?.link || "https://picsum.photos/seed/ghana/1200/800";
  } catch (error) {
    console.error("Image search failed:", error);
    return "https://picsum.photos/seed/ghana/1200/800";
  }
}

async function harvest() {
  console.log("Starting News Harvest...");
  
  const allArticles = [];
  
  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      allArticles.push(...feed.items.map(item => ({ ...item, sourceName: source.name })));
    } catch (e) {
      console.error(`Failed to fetch ${source.name}:`, e);
    }
  }

  // Sort by date and pick the freshest one not yet processed
  const sorted = allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  const target = sorted[0];

  if (!target) return;

  console.log(`Processing: ${target.title}`);

  // Use Gemini to categorize and rewrite
  const model = "gemini-3-flash-preview";
  const prompt = `
    Rewrite this news story for Ghana Network News (GNN). 
    Source: ${target.sourceName}
    Title: ${target.title}
    Link: ${target.link}
    Summary: ${target.contentSnippet || target.description}

    Requirements:
    - Determine the best category (POLITICS, ECONOMY, TECHNOLOGY, SPORTS, BUSINESS, EDUCATION, ENTERTAINMENT, LIFESTYLE).
    - Extract the main person or subject of the photo (e.g., "John Mahama", "Black Stars").
    - Write a descriptive, authoritative headline that contains the key details of the story.
    - Write a professional, authoritative version of the story (3-5 paragraphs).
    - Suggest 3 relevant tags.

    Return as JSON:
    {
      "category": "string",
      "title": "string",
      "subject": "string",
      "content": ["paragraph1", "paragraph2", ...],
      "tags": ["tag1", "tag2", "tag3"],
      "caption": "string"
    }
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  const data = JSON.parse(response.text);
  
  // Get real image
  const imageUrl = await getSubjectImage(data.subject);

  const newArticle = {
    id: Date.now().toString(),
    ...data,
    image: imageUrl,
    date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    readTime: "4 Min Read",
    author: "GNN Editorial Bot",
    status: "pending" // All stories start as pending for your approval
  };

  // Check if auto-publish is on
  let settings = { autoPublish: false };
  try {
    settings = JSON.parse(fs.readFileSync("./data/settings.json", "utf8"));
  } catch (e) {}

  if (settings.autoPublish) {
    newArticle.status = "published";
  }

  // Save to pending list
  let pending = [];
  try {
    pending = JSON.parse(fs.readFileSync("./data/pending.json", "utf8"));
  } catch (e) {}

  pending.unshift(newArticle);
  fs.writeFileSync("./data/pending.json", JSON.stringify(pending.slice(0, 50), null, 2));

  // Facebook Posting
  if (newArticle.status === "published") {
    try {
      console.log("Posting to Facebook...");
      const siteUrl = process.env.WEBSITE_URL || "https://gnn-ghana.vercel.app";
      const hashtags = "#GNN #Viral #Explorepage #Ghana #GNNGhana #NewsUpdate #Africa #GhPolitics #News #AfricaNews #CurrentAffairs #Vlog";
      const fbResponse = await axios.post(`https://graph.facebook.com/${process.env.FACEBOOK_PAGE_ID}/feed`, {
        message: `${newArticle.title}\n\nDetails here: ${siteUrl}/article/${newArticle.id}\n\n${hashtags}`,
        link: `${siteUrl}/article/${newArticle.id}`,
        picture: newArticle.image,
        access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
      });
      console.log("Facebook Success:", fbResponse.data.id);
    } catch (fbError: any) {
      console.error("Facebook Failed:", fbError.response?.data || fbError.message);
    }
  }

  console.log(`Success: Added "${newArticle.title}" to queue.`);
}

harvest().catch(console.error);
