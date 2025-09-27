import {z} from "zod";
import User from "../../users/user.entity";

export const CreateCurrencySchema = z.object({
   name: z.string(),
   code: z.string(),
   association_uid: z.string()
})

export const UpdateCurrencySchema = z.object({
   uid: z.string(),
   name: z.string(),
   code: z.string(),
   association_uid: z.string()
})

export const GetCurrencySchema = z.object({
   uid: z.string(),
})

export const GetCurrenciesSchema = z.object({
   association_uid: z.string(),
})

export type CreateCurrencyDto = z.infer<typeof CreateCurrencySchema> & { user: User }
export type UpdateCurrencyDto = z.infer<typeof UpdateCurrencySchema> & { user: User }
export type GetCurrencyDto = z.infer<typeof GetCurrencySchema> & { user: User }
export type GetCurrenciesDto = z.infer<typeof GetCurrenciesSchema> & { user: User }
