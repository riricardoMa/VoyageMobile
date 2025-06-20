import { z } from "zod";
import type { ApiEndpoint } from "../types/NetworkTypes";

// Schemas
const PetCategorySchema = z.enum(["dog", "cat"]);
const PetSexSchema = z.enum(["male", "female"]);

const CreatePetRequestSchema = z.object({
  name: z.string().min(1, "Pet name is required"),
  category: PetCategorySchema,
  sex: PetSexSchema,
  birthday: z.string().datetime(),
  photoUrl: z.string().url().optional(),
  ownerTitle: z.string().optional(),
});

const UpdatePetRequestSchema = z.object({
  name: z.string().min(1, "Pet name is required").optional(),
  category: PetCategorySchema.optional(),
  sex: PetSexSchema.optional(),
  birthday: z.string().datetime().optional(),
  photoUrl: z.string().url().optional(),
  ownerTitle: z.string().optional(),
});

const PetResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: PetCategorySchema,
  sex: PetSexSchema,
  birthday: z.string().datetime(),
  photoUrl: z.string().url().optional(),
  ownerTitle: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const GetPetsResponseSchema = z.object({
  pets: z.array(PetResponseSchema),
  total: z.number(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

const DeletePetResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

// Type exports
export type CreatePetRequest = z.infer<typeof CreatePetRequestSchema>;
export type UpdatePetRequest = z.infer<typeof UpdatePetRequestSchema>;
export type PetResponse = z.infer<typeof PetResponseSchema>;
export type GetPetsResponse = z.infer<typeof GetPetsResponseSchema>;
export type DeletePetResponse = z.infer<typeof DeletePetResponseSchema>;
export type PetCategory = z.infer<typeof PetCategorySchema>;
export type PetSex = z.infer<typeof PetSexSchema>;

// Endpoint definitions
export const petEndpoints = {
  getPets: {
    url: "/pets",
    method: "GET" as const,
    responseSchema: GetPetsResponseSchema,
    config: {
      useCache: true,
      cacheTTL: 300, // 5 minutes
      cacheKey: "user-pets",
    },
  } satisfies ApiEndpoint<never, GetPetsResponse>,

  createPet: {
    url: "/pets",
    method: "POST" as const,
    requestSchema: CreatePetRequestSchema,
    responseSchema: PetResponseSchema,
    config: {
      retries: 2,
    },
  } satisfies ApiEndpoint<CreatePetRequest, PetResponse>,

  getPet: (id: string) =>
    ({
      url: `/pets/${id}`,
      method: "GET" as const,
      responseSchema: PetResponseSchema,
      config: {
        useCache: true,
        cacheTTL: 600, // 10 minutes
        cacheKey: `pet-${id}`,
      },
    }) satisfies ApiEndpoint<never, PetResponse>,

  updatePet: (id: string) =>
    ({
      url: `/pets/${id}`,
      method: "PUT" as const,
      requestSchema: UpdatePetRequestSchema,
      responseSchema: PetResponseSchema,
      config: {
        retries: 1,
      },
    }) satisfies ApiEndpoint<UpdatePetRequest, PetResponse>,

  deletePet: (id: string) =>
    ({
      url: `/pets/${id}`,
      method: "DELETE" as const,
      responseSchema: DeletePetResponseSchema,
      config: {
        retries: 1,
      },
    }) satisfies ApiEndpoint<never, DeletePetResponse>,
};
