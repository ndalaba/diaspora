import {z} from "zod";
import User from "../users/user.entity";

export const UpdateImageSchema = z.object({
   uid: z.string(),
   image: z.any()
})

export type UpdateImage = z.infer<typeof UpdateImageSchema> & { user: User }