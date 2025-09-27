import {z} from "zod";
import User from "../../users/user.entity";

export const CreateSessionSchema = z.object({
   name: z.string(),
   association_uid: z.string()
})

export const UpdateSessionSchema = z.object({
   uid: z.string(),
   name: z.string(),
   association_uid: z.string()
})

export const GetSessionSchema = z.object({
   uid: z.string(),
})

export const GetSessionsSchema = z.object({
   association_uid: z.string(),
})

export type CreateSessionDto = z.infer<typeof CreateSessionSchema> & {user:User}
export type UpdateSessionDto = z.infer<typeof UpdateSessionSchema> & {user:User}
export type GetSessionDto = z.infer<typeof GetSessionSchema> & {user:User}
export type GetSessionsDto = z.infer<typeof GetSessionsSchema> & {user:User}
