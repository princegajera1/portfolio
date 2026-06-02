import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import gsap from 'gsap';
import { seoArticles } from '../firebase/blogs';

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    // Reset window scroll to top on mount
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo('.blog-card', 
        { opacity: 0, scale: 0.96, y: 25 },
        { 
          opacity: 1, scale: 1, y: 0,
          duration: 0.5, 
          stagger: 0.05, 
          ease: 'back.out(1.1)' 
        }
      );
    });
    return () => ctx.revert();
  }, [searchQuery, activeCategory]);

  const categories = ['All', 'React', 'Java', 'Python', 'Firebase', 'WebDev', 'Animations', 'SEO', 'DevOps', 'Trends'];

  const filteredArticles = seoArticles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          art.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || art.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative min-h-screen bg-dark w-full pt-32 pb-20 px-6 sm:px-12">
      <ParticleBackground color="#00e5ff" density={90} />
      
      {/* Glow shadow backing */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-[#7c6fff]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 font-sans">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left select-none">
          <span className="font-mono text-xs sm:text-sm text-secondary block mb-2">// technical.insights</span>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight leading-tight py-2">
            Engineering & SEO Blog
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mt-2 leading-relaxed">
            Technical papers and search-optimized guides exploring React performance rendering, Java enterprise libraries, Python AI scripts, and web systems engineering.
          </p>
        </div>

        {/* Filters and Search Matrices */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="w-full md:max-w-xs relative select-none">
            <input 
              type="text" 
              placeholder="Search articles or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-[#13132a]/45 border border-white/5 rounded-xl text-xs sm:text-sm text-white placeholder-gray-600 focus:outline-none focus:border-secondary transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 text-xs font-mono">✕</span>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#13132a]/60 p-1.5 rounded-xl border border-white/5 select-none font-mono text-[9px] sm:text-xs">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Listing Grid */}
        {filteredArticles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600 font-mono text-xs uppercase tracking-wider select-none">
            No articles matches your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredArticles.map(art => (
              <Link 
                to={`/blog/${art.id}`}
                key={art.id}
                className="blog-card bg-[#13132a]/30 border border-white/5 p-6 rounded-2xl hover:border-secondary/45 hover:shadow-[0_0_20px_rgba(0,212,255,0.03)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Category & Read Time Row */}
                  <div className="flex items-center justify-between font-mono text-[9px] sm:text-[10px] tracking-wider text-secondary uppercase mb-4 select-none">
                    <span className="bg-[#00e5ff]/5 border border-[#00e5ff]/15 px-2 py-0.5 rounded">
                      {art.category}
                    </span>
                    <span className="text-gray-500">
                      {art.readTime}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <h3 className="text-white text-base sm:text-lg font-bold font-display group-hover:text-secondary transition-colors duration-300 mb-2 leading-snug">
                    {art.title}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                    {art.summary}
                  </p>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 font-mono text-[9px] sm:text-[10px] select-none text-gray-600">
                  <span>📅 Published: {art.createdAt}</span>
                  <span className="text-secondary group-hover:underline flex items-center gap-1">
                    Read Article
                    <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
