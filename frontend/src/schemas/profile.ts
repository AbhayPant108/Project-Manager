
import {z} from 'zod'

export const userProfileSchema = z.object({
    first_name:z.string(),
    last_name:z.string(),
    phone_number:z.string().trim().max(15,'').optional(),
    bio:z.string().max(300,"Max 300 characteres").optional()
})

export type UserProfileFormValues = z.infer<typeof userProfileSchema>
