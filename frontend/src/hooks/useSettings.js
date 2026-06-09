import { useState, useEffect, useCallback } from 'react';
import { getSettings, saveSettings } from '../firebase/settings';

export default function useSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching settings in hook:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();

    const handleUpdate = () => {
      fetchSettings();
    };

    window.addEventListener('settingsUpdated', handleUpdate);
    return () => {
      window.removeEventListener('settingsUpdated', handleUpdate);
    };
  }, [fetchSettings]);

  const updateSettings = async (newData) => {
    try {
      await saveSettings(newData);
      setSettings(newData);
      return true;
    } catch (err) {
      console.error('Error in updateSettings hook:', err);
      throw err;
    }
  };

  return {
    settings,
    loading,
    error,
    refetch: fetchSettings,
    updateSettings
  };
}
