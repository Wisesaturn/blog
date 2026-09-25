import { type z } from 'zod';

import { type snippetDocument } from '../model/snippetDocument';

export type ISnippet = z.infer<typeof snippetDocument>;
