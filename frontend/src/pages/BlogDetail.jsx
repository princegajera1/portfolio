import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';
import { seoArticles } from '../firebase/blogs';

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const found = seoArticles.find(art => art.id === id);
    if (!found) {
      navigate('/blog', { replace: true });
    } else {
      setArticle(found);
    }
  }, [id, navigate]);

  // Dynamic Metadata Overrides & JSON-LD Structured Data Schema Injections
  useEffect(() => {
    if (!article) return;

    // Cache original head elements
    const originalTitle = document.title;
    const originalDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');

    // Update primary page titles & descriptions
    document.title = `${article.seoTitle || article.title} | Prince Gajera Blog`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', article.summary);
    }

    // Generate dynamic Breadcrumb schema list
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://princegajera.vercel.app/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://princegajera.vercel.app/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": article.title,
          "item": `https://princegajera.vercel.app/blog/${article.id}`
        }
      ]
    };

    // Generate dynamic BlogPosting schema
    const blogPostingSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://princegajera.vercel.app/blog/${article.id}`
      },
      "headline": article.title,
      "description": article.summary,
      "image": "https://princegajera.vercel.app/robot.png",
      "author": {
        "@type": "Person",
        "name": "Prince Gajera",
        "url": "https://princegajera.vercel.app"
      },
      "publisher": {
        "@type": "Person",
        "name": "Prince Gajera",
        "logo": {
          "@type": "ImageObject",
          "url": "https://princegajera.vercel.app/robot.png"
        }
      },
      "datePublished": "2026-06-02",
      "dateModified": "2026-06-02"
    };

    // Create & inject Breadcrumb schema node
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.id = `schema-breadcrumb-${article.id}`;
    breadcrumbScript.innerHTML = JSON.stringify(breadcrumbSchema);
    document.head.appendChild(breadcrumbScript);

    // Create & inject BlogPosting schema node
    const blogPostingScript = document.createElement('script');
    blogPostingScript.type = 'application/ld+json';
    blogPostingScript.id = `schema-blogposting-${article.id}`;
    blogPostingScript.innerHTML = JSON.stringify(blogPostingSchema);
    document.head.appendChild(blogPostingScript);

    // Cleanup logic on article change or unmount to prevent head element pollution
    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
      const existingBC = document.getElementById(`schema-breadcrumb-${article.id}`);
      if (existingBC) document.head.removeChild(existingBC);
      
      const existingBP = document.getElementById(`schema-blogposting-${article.id}`);
      if (existingBP) document.head.removeChild(existingBP);
    };
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center text-gray-500 font-mono text-xs uppercase select-none">
        Loading Article...
      </div>
    );
  }

  // Parse custom newlines/sections to HTML grids safely
  const renderParagraphs = (bodyText) => {
    return bodyText.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="text-xl sm:text-2xl font-bold font-display text-white mt-8 mb-4 border-b border-white/5 pb-2">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="text-base sm:text-lg font-bold font-display text-secondary mt-6 mb-3">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('• ')) {
        return (
          <ul key={index} className="list-disc pl-6 space-y-2 text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed my-4">
            {paragraph.split('\n').map((li, lIdx) => (
              <li key={lIdx}>{li.replace('• ', '')}</li>
            ))}
          </ul>
        );
      }
      if (paragraph.startsWith('1. ') || paragraph.startsWith('2. ') || paragraph.startsWith('3. ')) {
        return (
          <ol key={index} className="list-decimal pl-6 space-y-2 text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed my-4">
            {paragraph.split('\n').map((li, lIdx) => (
              <li key={lIdx}>{li.replace(/^\d+\.\s+/, '')}</li>
            ))}
          </ol>
        );
      }
      if (paragraph.startsWith('`')) {
        return (
          <pre key={index} className="bg-[#13132a]/40 border border-white/5 p-4 rounded-xl font-mono text-[10px] sm:text-xs text-gray-300 overflow-x-auto my-6 select-text">
            <code>{paragraph.replace(/```[a-z]*\n|```/g, '')}</code>
          </pre>
        );
      }
      return (
        <p key={index} className="text-gray-400 text-xs sm:text-sm md:text-base leading-relaxed mb-6 font-sans">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <div className="relative min-h-screen bg-dark w-full pt-32 pb-20 px-6 sm:px-12">
      <ParticleBackground color="#7c6fff" density={80} />
      
      {/* Background neon soft blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10 font-sans">
        
        {/* Back navigation */}
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-white font-mono text-xs uppercase tracking-wider mb-8 transition-colors select-none"
        >
          &larr; Back To Insights
        </Link>

        {/* Dynamic Breadcrumbs visual component */}
        <nav className="flex items-center gap-2 font-mono text-[9px] sm:text-[10px] text-gray-500 mb-4 select-none uppercase tracking-wider">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-white">Blog</Link>
          <span>/</span>
          <span className="text-secondary font-bold line-clamp-1">{article.title}</span>
        </nav>

        {/* Main Content Layout */}
        <article className="border border-white/5 bg-[#13132a]/20 p-6 sm:p-10 rounded-3xl backdrop-blur-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[9px] sm:text-[10px] uppercase text-secondary tracking-wider pb-6 border-b border-white/5 mb-8 select-none">
            <span className="bg-[#7c6fff]/5 border border-[#7c6fff]/15 px-2.5 py-0.5 rounded-lg text-primary font-bold">
              {article.category}
            </span>
            <div className="flex items-center gap-4 text-gray-500">
              <span>⏱️ {article.readTime}</span>
              <span>📅 {article.createdAt}</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          {/* Full content renderer */}
          <div className="select-text">
            {renderParagraphs(article.body)}
          </div>

          {/* Stack keywords tags */}
          <div className="mt-12 pt-8 border-t border-white/5 select-none">
            <h4 className="text-[#a0aec0] font-mono text-[10px] uppercase font-bold tracking-widest mb-3">Topic Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((k, idx) => (
                <span key={idx} className="bg-white/5 border border-white/5 text-[9px] sm:text-[10px] text-gray-400 font-mono px-3 py-1 rounded-xl">
                  #{k.replace(/\s+/g, '-').toLowerCase()}
                </span>
              ))}
            </div>
          </div>
        </article>

      </div>
    </div>
  );
}
