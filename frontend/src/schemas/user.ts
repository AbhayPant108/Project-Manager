import { z } from "zod";


export type UserType = z.infer<typeof userSchema>