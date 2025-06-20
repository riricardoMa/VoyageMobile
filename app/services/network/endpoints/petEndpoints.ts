import { z } from "zod";
import type { ApiEndpoint } from "../types/NetworkTypes";

// Schemas
const PetCategorySchema = z.enum(["DOG", "CAT"]);
const PetSexSchema = z.enum(["BOY", "GIRL"]);

const CreatePetRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Pet name is required")
    .max(100, "Pet name must be less than 100 characters"),
  type: PetCategorySchema,
  avatarFilePath: z.string().min(1, "Avatar file path is required"),
  ownerTitle: z
    .string()
    .min(1, "Owner title is required")
    .max(50, "Owner title must be less than 50 characters"),
  birthday: z
    .string()
    .datetime("Invalid birthday format. Expected ISO 8601 datetime string"),
  sex: PetSexSchema,
});

const PetResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: PetCategorySchema,
  avatarFilePath: z.string(),
  ownerTitle: z.string(),
  birthday: z.coerce.date(),
  sex: PetSexSchema,
  ownerId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

const GetPetsResponseSchema = z.object({
  pets: z.array(PetResponseSchema),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

// Type exports
export type CreatePetRequest = z.infer<typeof CreatePetRequestSchema>;
export type PetResponse = z.infer<typeof PetResponseSchema>;
export type GetPetsResponse = z.infer<typeof GetPetsResponseSchema>;
export type PetCategory = z.infer<typeof PetCategorySchema>;
export type PetSex = z.infer<typeof PetSexSchema>;

// Endpoint definitions
export const petEndpoints = {
  getPets: {
    url: "/pet-profile",
    method: "GET" as const,
    responseSchema: GetPetsResponseSchema,
    config: {
      useCache: true,
      cacheTTL: 300, // 5 minutes
      cacheKey: "user-pets",
    },
  } satisfies ApiEndpoint<never, GetPetsResponse>,

  createPet: {
    url: "/pet-profile",
    method: "POST" as const,
    requestSchema: CreatePetRequestSchema,
    responseSchema: PetResponseSchema,
    config: {
      retries: 2,
    },
  } satisfies ApiEndpoint<CreatePetRequest, PetResponse>,

  getPet: (id: string) =>
    ({
      url: `/pet-profile/${id}`,
      method: "GET" as const,
      responseSchema: PetResponseSchema,
      config: {
        useCache: true,
        cacheTTL: 600, // 10 minutes
        cacheKey: `pet-${id}`,
      },
    }) satisfies ApiEndpoint<never, PetResponse>,
};
