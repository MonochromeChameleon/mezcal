import supertest from 'supertest';

import { Mezcal } from '../mezcal/test-server/mezcal.js';

export const request = supertest(Mezcal.server);
