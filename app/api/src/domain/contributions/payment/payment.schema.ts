import {z} from "zod";
import User from "../../users/user.entity";

export const CreatePaymentSchema = z.object({
   payed: z.number(),
   amountUid: z.string(),
   memberUid: z.string()
})

export const UpdatePaymentSchema = z.object({
   uid: z.string(),
   payed: z.number(),
   amountUid: z.string(),
   memberUid: z.string()
})

export const GetPaymentSchema = z.object({
   uid: z.string(),
})

export const GetPaymentsSchema = z.object({
   contributionUid: z.string(),
   amountUid: z.string().nullable()
})


export type CreatePaymentDto = z.infer<typeof CreatePaymentSchema> & { user: User }
export type UpdatePaymentDto = z.infer<typeof UpdatePaymentSchema> & { user: User }
export type GetPaymentDto = z.infer<typeof GetPaymentSchema> & { user: User }
export type GetPaymentsDto = z.infer<typeof GetPaymentsSchema> & { user: User }
