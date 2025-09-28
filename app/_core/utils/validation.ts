import { AnyZodObject, ZodError } from 'zod'

export async function validate(schema: AnyZodObject) {
  try {
    await schema.parseAsync(schema)
    return true
  } catch (error) {
    if (error instanceof ZodError) {
    }
  }
}
