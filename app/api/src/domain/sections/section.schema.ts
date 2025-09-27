import { z } from "zod";
import User from "../users/user.entity";

export const UpdateSectionSchema = z.object({
  name: z.string(),
  description: z.optional(z.string()),
  active: z.boolean(),
  uid: z.string()
});

export const CreateSectionSchema = z.object({
  name: z.string(),
  description: z.optional(z.string()),
  active: z.boolean()
});

export const GetSectionSchema = z.object({
  uid: z.string()
});

export type CreateSectionDto = z.infer<typeof CreateSectionSchema> & { user: User }
export type UpdateSectionDto = z.infer<typeof UpdateSectionSchema> & { user: User }
export type GetSectionDto = z.infer<typeof GetSectionSchema> & { user: User }