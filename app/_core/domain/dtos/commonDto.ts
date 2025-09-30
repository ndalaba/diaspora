import * as z from 'zod'
import User from '../../domain/entities/User'

export const UpdateImageSchema = z.object({
  id: z.string(),
  image: z.any()
})

export type UpdateImage = z.infer<typeof UpdateImageSchema> & { user: User }
