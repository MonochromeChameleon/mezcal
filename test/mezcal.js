import supertest from 'supertest';

import { Mezcal } from '../mezcal/test-server';

export const request = supertest(Mezcal.server);
