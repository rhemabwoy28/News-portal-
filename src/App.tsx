import TopNavBar from "./components/TopNavBar";
import Footer from "./components/Footer";
import Article from "./components/Article";
import Sidebar from "./components/Sidebar";
import BreakingNews from "./components/BreakingNews";
import ReadingProgress from "./components/ReadingProgress";
import { motion } from "motion/react";

export default function App() {
  return (
    <div className="min-h-screen bg-surface-bright text-on-surface font-body selection:bg-primary/20 selection:text-primary">
      <ReadingProgress />
      <TopNavBar />
      <BreakingNews />
      
      <main className="max-w-[1440px] mx-auto px-6 md:px-12 py-8 grid grid-cols-1 lg:grid-cols-12 gap-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-8"
        >
          <Article />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-4"
        >
          <Sidebar />
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
