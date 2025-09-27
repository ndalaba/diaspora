import {z} from "zod";
import User from "../../users/user.entity";

export const CreateAmountSchema = z.object({
   name: z.string(),
   value: z.number(),
   description: z.string().nullable(),
   contribution_uid: z.string(),
   currency_uid: z.string()
})

export const UpdateAmountSchema = z.object({
   uid: z.string(),
   name: z.string(),
   value: z.number(),
   description: z.string().nullable(),
   contribution_uid: z.string(),
   currency_uid: z.string()
})

export const GetAmountSchema = z.object({
   uid: z.string(),
})

export const GetAmountsSchema = z.object({
   contribution_uid: z.string(),
   currency_uid: z.string().nullable(),
   session_uid: z.string().nullable(),
})

export type CreateAmountDto = z.infer<typeof CreateAmountSchema> & { user: User }
export type UpdateAmountDto = z.infer<typeof UpdateAmountSchema> & { user: User }
export type GetAmountDto = z.infer<typeof GetAmountSchema> & { user: User }
export type GetAmountsDto = z.infer<typeof GetAmountsSchema> & { user: User }
