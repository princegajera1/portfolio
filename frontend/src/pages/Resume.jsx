import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FiDownload, FiMaximize, FiAward, FiBookOpen, FiCode, FiMail } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ChatBot from '../components/ChatBot/ChatBot';
import CommandPalette from '../components/CommandPalette/CommandPalette';
import useSettings from '../hooks/useSettings';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import useAnalytics from '../hooks/useAnalytics';

export default function Resume() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('/resume');
  }, [trackPageView]);

  const resumeUrl = settings?.resumeUrl || '/resume.pdf';

  const handleDownload = () => {
    // Increment download count in database
    import('../firebase/resume').then(({ incrementDownloadCount }) => {
      incrementDownloadCount().catch(err => console.error(err));
    });

    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = 'Prince_Gajera_Resume.pdf';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFullScreen = () => {
    // Also track fullscreen view as a download/view action
    import('../firebase/resume').then(({ incrementDownloadCount }) => {
      incrementDownloadCount().catch(err => console.error(err));
    });
    window.open(resumeUrl, '_blank', 'noopener,noreferrer');
  };

  const highlights = [
    {
      title: 'Education Milestone',
      icon: FiBookOpen,
      items: [
        'Bachelor of Engineering in Computer Engineering',
        'SAL Engineering and Technical Institute (GTU)',
        'Focus on Data Systems, Algorithms and Software Scaffoldings'
      ]
    },
    {
      title: 'Frontend Specialization',
      icon: FiCode,
      items: [
        'Modular state routing using React Router v6',
        'Interactive component animations via Framer Motion',
        'CSS utility grid styling using Tailwind CSS v3'
      ]
    },
    {
      title: 'Cloud Architectures',
      icon: FiAward,
      items: [
        'Serverless Firestore reads/writes integration',
        'Strict database security validation rules',
        'Asset storage structures & admin configurations'
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Recruiter Resume | Prince Gajera CV Viewer</title>
        <meta name="description" content="View Prince Gajera's developer CV, download the PDF, or review academic computer engineering milestones." />
      </Helmet>

      <Navbar />

      <main className="bg-bg-dark pt-32 pb-16 text-left relative overflow-hidden font-sans">
        
        {/* Background grids */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015] z-0">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#6C63FF 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-6 sm:px-12 relative z-10 space-y-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border-light dark:border-border-dark pb-8">
            <div className="space-y-3">
              <Badge variant="primary" size="sm" className="uppercase text-[9px] tracking-wider font-bold">
                Recruiter Portal
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary-light dark:text-text-primary-dark tracking-tight">
                Curriculum Vitae
              </h1>
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs sm:text-sm font-mono">
                Last Updated: June 2026
              </p>
            </div>

            <div className="flex items-center gap-3 select-none">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleFullScreen}
                className="gap-1.5"
              >
                <FiMaximize className="w-4 h-4" />
                <span>View Fullscreen</span>
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleDownload}
                className="gap-1.5"
              >
                <FiDownload className="w-4 h-4" />
                <span>Download CV</span>
              </Button>
            </div>
          </div>

          {/* Embedded PDF iframe viewer */}
          <Card className="border border-border-light dark:border-border-dark p-0 overflow-hidden shadow-2xl bg-black/10 select-none">
            <div className="w-full aspect-[4/5] sm:aspect-video h-[500px] sm:h-[600px]">
              <iframe
                src={resumeUrl.startsWith('data:') ? resumeUrl : `${resumeUrl}#toolbar=0&navpanes=0`}
                title="Prince Gajera Recruiter Resume"
                className="w-full h-full border-none"
                loading="eager"
              />
            </div>
          </Card>

          {/* Key Highlights Section */}
          <div className="space-y-6">
            <h3 className="font-display font-extrabold text-base text-text-primary-light dark:text-text-primary-dark select-none">
              Resume Highlights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 select-none">
              {highlights.map((group) => {
                const Icon = group.icon;
                return (
                  <Card key={group.title} className="border border-border-light dark:border-border-dark p-6 flex flex-col justify-between group h-full">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <h4 className="font-display font-extrabold text-xs text-text-primary-light dark:text-text-primary-dark">
                          {group.title}
                        </h4>
                      </div>
                      
                      <ul className="space-y-2.5 pl-1.5 text-left">
                        {group.items.map((item, idx) => (
                          <li key={idx} className="text-[11px] text-text-secondary-light dark:text-text-text-secondary-dark font-sans leading-relaxed list-disc ml-3">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Bottom CTA Card */}
          <div className="py-8 select-none text-center max-w-lg mx-auto space-y-4 border-t border-border-light dark:border-border-dark pt-12">
            <h3 className="font-display font-extrabold text-sm text-text-primary-light dark:text-text-primary-dark">
              Interested in scheduling an interview?
            </h3>
            <Button
              variant="primary"
              onClick={() => navigate('/contact')}
              className="gap-2 group"
            >
              <span>Get in Touch</span>
              <FiMail className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>

        </div>
      </main>

      <ChatBot />
      <CommandPalette />

      <Footer />
    </>
  );
}
