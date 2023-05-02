import express from 'express' 
import { loginUser, refreshTokenVerify, accessTokenVerify, createUser} from './controllers/auth.js' 
import { getPublicData, getLoggedUserData, getAdminData } from './controllers/data.js';
import {getUserList, verifyUser} from './controllers/users.js'
import {getDatabaseHealth} from "./controllers/database.js";

const router = express.Router(); 

router.post('/auth/signin', loginUser); 
router.post('/auth/register', createUser);
router.post('/auth/refresh', refreshTokenVerify);

// secure router 
router.get('/users', accessTokenVerify, getUserList);
router.post('/verifyUser/', accessTokenVerify, verifyUser);

//data endpoints
router.get('/data/public', getPublicData);
router.get('/data/logged', accessTokenVerify, getLoggedUserData);
router.get('/data/admin', accessTokenVerify, getAdminData);

//database health
router.get('/database', getDatabaseHealth);

export default router;