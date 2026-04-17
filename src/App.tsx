import { useState, useMemo, useEffect } from "react";
import TopNavBar from "./components/TopNavBar";
import Footer from "./components/Footer";
import Article from "./components/Article";
import Sidebar from "./components/Sidebar";
import BreakingNews from "./components/BreakingNews";
import ReadingProgress from "./components/ReadingProgress";
import AdminDashboard from "./components/AdminDashboard";
import SectionsView from "./components/SectionsView";
import SearchView from "./components/SearchView";
import Login from "./components/Login";
import CategoryView from "./components/CategoryView";
import { motion, AnimatePresence } from "motion/react";
import { getArticles } from "./services/storageService";
import { ArticleData } from "./types";

export default function App() {
  const [view, setView] = useState<"reader" | "login" | "admin" | "sections" | "search" | "category">("reader");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [articles, setArticles] = useState<ArticleData[]>([]);
  const [currentArticleId, setCurrentArticleId] = useState<string>("");

  useEffect(() => {
    const loaded = getArticles();
    setArticles(loaded);
    if (loaded.length > 0) setCurrentArticleId(loaded[0].id);
  }, []);

  const currentArticle = useMemo(() => 
    articles.find(a => a.id === currentArticleId) || articles[0]
  , [currentArticleId, articles]);

  const handleArticleSelect = (id: string) => {
    setCurrentArticleId(id);
    setView("reader");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSectionSelect = (category: string) => {
    setSelectedCategory(category);
    setView("category");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const refreshArticles = () => {
    setArticles(getArticles());
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setView("admin");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView("reader");
  };

  if (view === "login") {
    return <Login onLogin={handleLogin} />;
  }

  if (view === "admin" && isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} onUpdate={refreshArticles} />;
  }

  return (
    <div className="min-h-screen bg-surface-bright text-on-surface font-body selection:bg-primary/20 selection:text-primary transition-colors duration-300">
      <AnimatePresence>
        {view === "sections" && (
          <SectionsView 
            onClose={() => setView("reader")} 
            onSectionSelect={handleSectionSelect}
          />
        )}
        {view === "search" && (
          <SearchView 
            onClose={() => setView("reader")} 
          />
        )}
        {view === "category" && (
          <CategoryView 
            category={selectedCategory}
            articles={articles}
            onClose={() => setView("reader")}
            onArticleSelect={handleArticleSelect}
          />
        )}
      </AnimatePresence>

      <ReadingProgress />
      <TopNavBar 
        onHome={() => articles[0] && handleArticleSelect(articles[0].id)} 
        onSectionSelect={handleSectionSelect}
        onMenuClick={() => setView("sections")}
        onSearchClick={() => setView("search")}
      />
      <BreakingNews />
      
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentArticleId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              {currentArticle && <Article data={currentArticle} />}
            </motion.div>
          </AnimatePresence>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <Sidebar onArticleSelect={handleArticleSelect} articles={articles} />
        </motion.div>
      </main>

      <Footer 
        onHome={() => articles[0] && handleArticleSelect(articles[0].id)} 
        onAdminClick={() => setView(isLoggedIn ? "admin" : "login")}
        onSectionSelect={handleSectionSelect}
      />
    </div>
  );
}
