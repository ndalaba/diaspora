import * as z from 'zod'
import User from '../../domain/entities/User'

export const GetOrganisationSchema = z.object({
  id: z.string()
})

export const FilterOrganisationSchema = z.object({
  country_id: z.string().nullable(),
  city: z.string().nullable(),
  user_id: z.number().nullable(),
  name: z.string(),
  page: z.number().default(1)
})

export const CreateOrganisationSchema = z.object({
  name: z.string(),
  country_id: z.number(),
  phone: z.string().nullable(),
  email: z.email().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  about: z.string().nullable()
})

export const UpdateOrganisationSchema = z.object({
  name: z.string(),
  id: z.string(),
  phone: z.string().nullable(),
  email: z.email().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  about: z.string().nullable(),
  country_id: z.number()
})

export const AddMemberSchema = z.object({
  organisation_id: z.string(),
  member_id: z.string()
})

export type GetOrganisationDto = z.infer<typeof GetOrganisationSchema> & {
  user: User
}
export type FilterOrganisationDto = z.infer<typeof FilterOrganisationSchema>
export type CreateOrganisationDto = z.infer<typeof CreateOrganisationSchema> & {
  user: User
}
export type UpdateOrganisationDto = z.infer<typeof UpdateOrganisationSchema> & {
  user: User
}
export type AddMemberDto = z.infer<typeof AddMemberSchema> & { user: User }
