import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  members_id: z.array(z.string()).optional(),
  status:z.enum(['INCOMPLETE','IN_PROGRESS','COMPLETED']).default('INCOMPLETE'),
  access:z.enum(['PRIVATE','PUBLIC','FRIENDS_ONLY']).default('PRIVATE')

});

export type ProjectFormValues = z.infer<typeof projectSchema>;
