import * as z from 'zod'
import User from '../../domain/entities/User'

const MIN_AGE = 16

export const GetUserSchema = z.object({
  id: z.string()
})

export const FilterUserSchema = z.object({
  country_id: z.number().nullable(),
  organisation_id: z.number().nullable(),
  email: z.email().nullable(),
  phone: z.string().nullable(),
  name: z.string().nullable(),
  city: z.string().nullable(),
  page: z.number().default(1)
})

export const CreateUserSchema = z.object({
  organisation_id: z.optional(z.string()),
  email: z.email(),
  name: z.string().min(3),
  password: z.string().min(6),
  phone: z.optional(z.string()),
  profession: z.optional(z.string()),
  address: z.optional(z.string()),
  city: z.optional(z.string()),
  country_id: z.number().nullable(),
  about: z.optional(z.string()),
  gender: z.optional(z.number().max(1).min(0)),
  birthDay: z.optional(z.number().min(1).max(31)),
  birthMonth: z.optional(z.number().min(1).max(12)),
  birthYear: z.optional(
    z
      .number()
      .min(1930)
      .max(new Date().getFullYear() - MIN_AGE)
  )
})

export const UpdateUserSchema = z.object({
  id: z.string(),
  email: z.string().nullable(),
  name: z.string().min(3),
  phone: z.optional(z.string()),
  profession: z.optional(z.string()),
  address: z.optional(z.string()),
  city: z.optional(z.string()),
  country_id: z.string().nullable(),
  about: z.optional(z.string()),
  gender: z.optional(z.number().max(1).min(0)),
  birthDay: z.optional(z.number().min(1).max(31)),
  birthMonth: z.optional(z.number().min(1).max(12)),
  birthYear: z.optional(
    z
      .number()
      .min(1930)
      .max(new Date().getFullYear() - 18)
  )
})

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
})

export type LoginDto = z.infer<typeof LoginSchema>
export type CreateUserDto = z.infer<typeof CreateUserSchema> & {
  user: User | null
}
export type UpdateUserDto = z.infer<typeof UpdateUserSchema> & { user: User }
export type GetUserDto = z.infer<typeof GetUserSchema> & { user: User }
export type FilterUserDto = z.infer<typeof FilterUserSchema> & { user: User }
