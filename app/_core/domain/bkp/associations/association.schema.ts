import { z } from 'zod'
import User from '../../entities/User'

export const GetAssociationSchema = z.object({
  uid: z.string()
})

export const FilterAssociationSchema = z.object({
  country_id: z.string().nullable(),
  city: z.string().nullable(),
  user_id: z.number().nullable(),
  name: z.string(),
  page: z.number().default(1)
})

export const CreateAssociationSchema = z.object({
  name: z.string(),
  country_id: z.number(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
  about: z.string().nullable()
})

export const UpdateAssociationSchema = z.object({
  name: z.string(),
  uid: z.string(),
  phone: z.string().nullable(),
  email: z.string().email().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  about: z.string().nullable(),
  country_id: z.number()
})

export const AddMemberSchema = z.object({
  association_uid: z.string(),
  member_uid: z.string()
})

export type GetAssociationDto = z.infer<typeof GetAssociationSchema> & {
  user: User
}
export type FilterAssociationDto = z.infer<typeof FilterAssociationSchema>
export type CreateAssociationDto = z.infer<typeof CreateAssociationSchema> & {
  user: User
}
export type UpdateAssociationDto = z.infer<typeof UpdateAssociationSchema> & {
  user: User
}
export type AddMemberDto = z.infer<typeof AddMemberSchema> & { user: User }
