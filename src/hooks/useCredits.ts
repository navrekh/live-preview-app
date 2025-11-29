import { useState, useEffect } from "react";
import { getCreditBalance, UserCredits } from "@/services/credits";

export function useCredits() {
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const balance = await getCreditBalance();
      setCredits(balance);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch credits");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return {
    credits,
    balance: credits?.balance ?? 0,
    isLoading,
    error,
    refetch: fetchCredits,
  };
}
