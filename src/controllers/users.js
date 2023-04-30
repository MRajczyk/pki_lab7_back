import { UserModel } from '../models/user.js';
import {decodeJwt} from "../util/utij.js";
import {collect} from 'collect.js';

// Controller get users list 
export const getUserList = async (req, res, next) => {
    const reqUserRole = decodeJwt(req.headers.authorization.split(" ")[1]).rol;
    if(!collect(reqUserRole).contains('ADMIN')) {
        res.status(401).send({message: "Unauthorized"});
        next();
        return;
    }
    const users = await UserModel.find({})
    //console.log(users)
    if (!users) { 
        res.status(401).send({message: "Unauthorized"}) 
        next()
    } else { 
        res.json({status: "success", users: users}); 
    } 
}

export const verifyUser = async (req, res, next) => {
    const reqUserId = req.query.userId;
    console.log(reqUserId)
    const data = await UserModel.findOneAndUpdate({_id: reqUserId}, {accepted: true});
    if (!data) {
        res.status(401).send({message: "Test"});
        next();
    } else {
        res.json({status: "success", data: data});
    }
}