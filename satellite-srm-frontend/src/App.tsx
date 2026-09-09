import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { EnhancePage } from './pages/EnhancePage';
import { ComparePage } from './pages/ComparePage';
import { AnalysisPage } from './pages/AnalysisPage';
import { GalleryPage } from './pages/GalleryPage';
import { UseCasesPage } from './pages/UseCasesPage';
import { AboutPage } from './pages/AboutPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#020c1b] text-slate-300 font-sans selection:bg-cyan-500/30 selection:text-cyan-100">
        <Navbar />
        
        <main className="flex-1 flex flex-col relative z-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/enhance" element={<EnhancePage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
