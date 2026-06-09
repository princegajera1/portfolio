import { useState, useEffect } from 'react';

export default function useGitHub() {
  const username = import.meta.env.VITE_GITHUB_USERNAME || 'princegajera1';
  const CACHE_KEY_PROFILE = `github_profile_cache_${username}`;
  const CACHE_KEY_REPOS = `github_repos_cache_${username}`;
  const CACHE_KEY_TIME = `github_cache_time_${username}`;
  const CACHE_TIME = 10 * 60 * 1000; // 10 minutes cache

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    reposCount: 0,
    totalStars: 0,
    followers: 0,
    following: 0,
    commitsCount: 268 // Baseline estimated commit count
  });
  const [repos, setRepos] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        
        // Check local cache
        const cachedProfile = localStorage.getItem(CACHE_KEY_PROFILE);
        const cachedRepos = localStorage.getItem(CACHE_KEY_REPOS);
        const cachedTime = localStorage.getItem(CACHE_KEY_TIME);
        
        if (cachedProfile && cachedRepos && cachedTime && (Date.now() - Number(cachedTime) < CACHE_TIME)) {
          const parsedProfile = JSON.parse(cachedProfile);
          const parsedRepos = JSON.parse(cachedRepos);
          
          setStats(parsedProfile);
          setRepos(parsedRepos.slice(0, 6));
          calculateLanguages(parsedRepos);
          setLoading(false);
          return;
        }

        // Fetch user profile
        const profileRes = await fetch(`https://api.github.com/users/${username}`);
        if (!profileRes.ok) throw new Error('Failed to fetch GitHub profile');
        const profileData = await profileRes.json();

        // Fetch repos (up to 100)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!reposRes.ok) throw new Error('Failed to fetch GitHub repositories');
        const reposData = await reposRes.json();

        // Filter out forks
        const nonForks = reposData.filter(repo => !repo.fork);
        
        // Calculate stars
        const totalStars = nonForks.reduce((acc, curr) => acc + curr.stargazers_count, 0);

        const newStats = {
          reposCount: profileData.public_repos,
          totalStars: totalStars,
          followers: profileData.followers,
          following: profileData.following,
          commitsCount: profileData.public_repos * 15 + totalStars * 3 + 124 // Estimate commits from public data if offline
        };

        // Cache the result
        localStorage.setItem(CACHE_KEY_PROFILE, JSON.stringify(newStats));
        localStorage.setItem(CACHE_KEY_REPOS, JSON.stringify(nonForks));
        localStorage.setItem(CACHE_KEY_TIME, String(Date.now()));

        setStats(newStats);
        setRepos(nonForks.slice(0, 6));
        calculateLanguages(nonForks);
        setError(null);
      } catch (err) {
        console.error('Error fetching GitHub API details:', err);
        setError(err.message);
        
        // Attempt load from expired cache as fallback
        const cachedProfile = localStorage.getItem(CACHE_KEY_PROFILE);
        const cachedRepos = localStorage.getItem(CACHE_KEY_REPOS);
        if (cachedProfile && cachedRepos) {
          const parsedProfile = JSON.parse(cachedProfile);
          const parsedRepos = JSON.parse(cachedRepos);
          setStats(parsedProfile);
          setRepos(parsedRepos.slice(0, 6));
          calculateLanguages(parsedRepos);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  const calculateLanguages = (reposList) => {
    const langMap = {};
    let totalSize = 0;

    reposList.forEach(repo => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        totalSize += 1;
      }
    });

    const sortedLangs = Object.entries(langMap)
      .map(([name, count]) => ({
        name,
        value: Math.round((count / totalSize) * 100)
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);

    setLanguages(sortedLangs);
  };

  return { loading, error, stats, repos, languages };
}
