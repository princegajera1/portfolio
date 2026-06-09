import { useState, useEffect, useCallback } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../firebase/projects';

export default function useProjects(category = null) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const list = await getProjects(category);
      setProjects(list);
      setError(null);
    } catch (err) {
      console.error('Error in useProjects hook:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProjects();

    const handleUpdate = () => {
      fetchProjects();
    };

    window.addEventListener('projectsUpdated', handleUpdate);
    return () => {
      window.removeEventListener('projectsUpdated', handleUpdate);
    };
  }, [fetchProjects]);

  const createProject = async (data) => {
    try {
      const result = await addProject(data);
      return result;
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const editProject = async (id, updates) => {
    try {
      await updateProject(id, updates);
      return true;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const removeProject = async (id) => {
    try {
      await deleteProject(id);
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    editProject,
    removeProject
  };
}
