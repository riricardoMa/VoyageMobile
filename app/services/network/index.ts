// Core network service
export { NetworkService } from "./NetworkService";
export { NetworkProvider, useNetwork } from "./useNetwork";

// Types
export type {
  NetworkError,
  ApiResponse,
  RequestConfig,
  CacheEntry,
  ApiEndpoint,
  INetworkService,
} from "./types/NetworkTypes";

// Pet API
export { usePetApi } from "./hooks/usePetApi";
export { petEndpoints } from "./endpoints/petEndpoints";
export type {
  CreatePetRequest,
  PetResponse,
  GetPetsResponse,
  PetCategory,
  PetSex,
} from "./endpoints/petEndpoints";
