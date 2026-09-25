import { type z } from 'zod';

import { type postDocument } from '../model/postDocument';

export type IPost = z.infer<typeof postDocument>;
