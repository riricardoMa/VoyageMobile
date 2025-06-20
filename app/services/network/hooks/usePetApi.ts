import { useState, useCallback } from "react";
import { useNetwork } from "../useNetwork";
import {
  petEndpoints,
  type CreatePetRequest,
  type PetResponse,
  type GetPetsResponse,
} from "../endpoints/petEndpoints";

export const usePetApi = () => {
  const { networkService } = useNetwork();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const getPets = useCallback(async (): Promise<GetPetsResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await networkService.get(petEndpoints.getPets);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch pets";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [networkService]);

  const createPet = useCallback(
    async (data: CreatePetRequest): Promise<PetResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await networkService.post(petEndpoints.createPet, data);
        // Invalidate cache after creating
        networkService.removeCacheEntry("user-pets");
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create pet";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [networkService]
  );

  const getPet = useCallback(
    async (id: string): Promise<PetResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await networkService.get(petEndpoints.getPet(id));
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch pet";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [networkService]
  );

  return {
    // Operations
    getPets,
    createPet,
    getPet,

    // State
    loading,
    error,
    clearError,
  };
};
