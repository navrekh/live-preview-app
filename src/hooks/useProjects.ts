import { useState, useEffect } from "react";
import { getProjects, Project } from "@/services/projects";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch projects");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const completedProjects = projects.filter((p) => p.status === "completed");
  const buildingProjects = projects.filter((p) => p.status === "building");
  const draftProjects = projects.filter((p) => p.status === "draft");

  return {
    projects,
    completedProjects,
    buildingProjects,
    draftProjects,
    totalCount: projects.length,
    isLoading,
    error,
    refetch: fetchProjects,
  };
}
