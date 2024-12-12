require('dotenv').config();

import healthCheck from './healthCheck';
import admin from './admin';
import auth from './auth';
import videos from './videos';


export { healthCheck, admin, auth, videos };
