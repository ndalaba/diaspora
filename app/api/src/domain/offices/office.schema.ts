import {z} from "zod";
import User from "../users/user.entity";

export const CreateOfficeSchema = z.object({
   name: z.string(),
   position: z.number().positive(),
   associationUid: z.string()
})

export const UpdateOfficeSchema = z.object({
   uid: z.string(),
   name: z.string(),
   position: z.number().positive(),
   associationUid: z.string()
})

export const GetOfficeSchema = z.object({
   uid: z.string(),
})

export const GetOfficesSchema = z.object({
   associationUid: z.string(),
})

export const MemberToOfficeSchema = z.object({
   uid: z.string(),
   memberUid: z.string(),
})


export type CreateOfficeDto = z.infer<typeof CreateOfficeSchema> & { user: User }
export type UpdateOfficeDto = z.infer<typeof UpdateOfficeSchema> & { user: User }
export type GetOfficeDto = z.infer<typeof GetOfficeSchema> & { user: User }
export type GetOfficesDto = z.infer<typeof GetOfficesSchema> & { user: User }
export type MemberToOfficeDto = z.infer<typeof MemberToOfficeSchema> & { user: User }