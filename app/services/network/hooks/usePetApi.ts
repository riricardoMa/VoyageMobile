import { useState, useCallback } from "react";
import { useNetwork } from "../useNetwork";
import {
  petEndpoints,
  type CreatePetRequest,
  type UpdatePetRequest,
  type PetResponse,
  type GetPetsResponse,
  type DeletePetResponse,
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

  const updatePet = useCallback(
    async (id: string, data: UpdatePetRequest): Promise<PetResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await networkService.put(
          petEndpoints.updatePet(id),
          data
        );
        // Invalidate related cache entries
        networkService.removeCacheEntry("user-pets");
        networkService.removeCacheEntry(`pet-${id}`);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update pet";
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [networkService]
  );

  const deletePet = useCallback(
    async (id: string): Promise<DeletePetResponse | null> => {
      setLoading(true);
      setError(null);
      try {
        const result = await networkService.delete(petEndpoints.deletePet(id));
        // Invalidate related cache entries
        networkService.removeCacheEntry("user-pets");
        networkService.removeCacheEntry(`pet-${id}`);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete pet";
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
    updatePet,
    deletePet,

    // State
    loading,
    error,
    clearError,
  };
};
