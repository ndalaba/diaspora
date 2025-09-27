import { z } from "zod";
import User from "../../users/user.entity";

export const CreateContributionSchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  association_uid: z.string(),
  session_uid: z.string()
});

export const UpdateContributionSchema = z.object({
  uid: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  association_uid: z.string(),
  session_uid: z.string()
});

export const GetContributionSchema = z.object({
  uid: z.string()
});

export const GetContributionsSchema = z.object({
  association_uid: z.string(),
  session_uid: z.string()
});

export type CreateContributionDto = z.infer<typeof CreateContributionSchema> & { user: User }
export type UpdateContributionDto = z.infer<typeof UpdateContributionSchema> & { user: User }
export type GetContributionDto = z.infer<typeof GetContributionSchema> & { user: User }
export type GetContributionsDto = z.infer<typeof GetContributionsSchema> & { user: User }


