import { z } from 'zod';
import { type Report } from './types';

const schema: z.ZodType<Report> = z.object({
  id: z.string(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1)
});

export default schema;
