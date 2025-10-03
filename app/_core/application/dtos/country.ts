import * as z from 'zod'
import User from '../../domain/entities/User'

export const UpdateCountrySchema = z.object({
  code: z.string().max(3),
  name: z.string(),
  id: z.string()
})

export const CreateCountrySchema = z.object({
  code: z.string().max(3),
  name: z.string()
})

export const GetCountrySchema = z.object({
  uid: z.string()
})

export type CreateCountryDto = z.infer<typeof CreateCountrySchema> & {
  user: User
}
export type UpdateCountryDto = z.infer<typeof UpdateCountrySchema> & {
  user: User
}
export type GetCountryDto = z.infer<typeof GetCountrySchema> & { user: User }
