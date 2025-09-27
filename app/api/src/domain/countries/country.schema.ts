import {z} from "zod"
import User from "../users/user.entity";

export const UpdateCountrySchema = z.object({
   code: z.string().max(3),
   name: z.string(),
   uid: z.string()
})

export const CreateCountrySchema = z.object({
   code: z.string().max(3),
   name: z.string()
})

export const GetCountrySchema = z.object({
   uid: z.string(),
})

export type CreateCountryDto = z.infer<typeof CreateCountrySchema> & { user: User }
export type UpdateCountryDto = z.infer<typeof UpdateCountrySchema> & { user: User }
export type GetCountryDto = z.infer<typeof GetCountrySchema> & { user: User }