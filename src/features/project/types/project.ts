import { type z } from 'zod';

import { type projectDocument } from '../model/projectDocument';

export type IProject = z.infer<typeof projectDocument>;
