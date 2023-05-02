import { UserModel } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const TOKEN_JWT = process.env.TOKEN_SECRET_JWT;

// Validate email address
export async function validateEmailAccessibility(email) {
    return await UserModel.findOne({
        email: email,
    }).then((result) => {
        return !result;
    });
}

// Generate token
export const generateTokens = (req, user) => {
    const ACCESS_TOKEN = jwt.sign(
        {
            sub: user._id,
            rol: user.roles,
            type: "ACCESS_TOKEN",
        },
        TOKEN_JWT,
        {
            expiresIn: "5000",
        }
    );

    const REFRESH_TOKEN = jwt.sign(
        {
            sub: user._id,
            rol: user.roles,
            type: "REFRESH_TOKEN",
        },
        TOKEN_JWT,
        {
            expiresIn: "1h",
        }
    );

    return {
        accessToken: ACCESS_TOKEN,
        refreshToken: REFRESH_TOKEN,
    };
};

// Controller create user
export const createUser = async (req, res, next) => {
    await validateEmailAccessibility(req.body.email).then(async (valid) => {
        if (valid) {
            try {
                const createdUser = UserModel.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                }).then((err, res) => {
                    if (err) 
                        next(err);                        
                });
                if(createdUser) {
                    res.status(200).json({
                        message: "The user was created",
                    });
                }
            } catch (e) {
                res.status(422).json({message: "Missing request parameters"});
                console.log(e.message);
            }
            
        } else {
            res.status(409).json({
                message: "The request could not be completed due to a conflict",
            });
        }
    });
};

// Controller login user
export const loginUser = async (req, res, next) => {
    const {email, password} = req.body;
    const userDoc = await UserModel.findOne({email});
    console.log(userDoc)
    if(!userDoc) {
        res.status(401).json('Wrong credentials!');
        return;
    }
    const ctr = userDoc.counter + 1;
    try {
        const passwOk = bcrypt.compareSync(password, userDoc.password);
        if(passwOk) {
            if(!userDoc.accepted) {
                res.status(403).json('User is not accepted by admin!');
                return;
            }
            await UserModel.findOneAndUpdate({email}, {lastVisit: new Date()});
            await UserModel.findOneAndUpdate({email}, {counter: ctr});
            res.json(Object.assign(generateTokens(req, userDoc), { 'roles': userDoc.roles, 'counter': userDoc.counter + 1, 'lastVisit': userDoc.lastVisit }));
        } 
        else {
            res.status(401).json('Wrong credentials!');
        }
    }
    catch(e) {
        res.status(422).json('Invalid params');
    } 
};

// Verify accessToken
export const accessTokenVerify = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({
            error: "Token is missing",
        });
    }
    const BEARER = "Bearer";
    const AUTHORIZATION_TOKEN = req.headers.authorization.split(" ");
    if (AUTHORIZATION_TOKEN[0] !== BEARER) {
        return res.status(401).send({
            error: "Token is not complete",
        });
    }
    jwt.verify(AUTHORIZATION_TOKEN[1], TOKEN_JWT, function (err) {
        if (err) {
            return res.status(401).send({
                error: "Token is invalid",
            });
        }
        next();
    });
};

// Verify refreshToken
export const refreshTokenVerify = (req, res, next) => {
    if (!req.headers.authorization) {
        res.status(403).send({
            message: "Token refresh is missing",
        });
    }

    const BEARER = "Bearer";
    const REFRESH_TOKEN = req.headers.authorization.split(" ");
    if (REFRESH_TOKEN[0] !== BEARER) {
        return res.status(403).send({
            error: "Token is not complete",
        });
    }
    jwt.verify(REFRESH_TOKEN[1], TOKEN_JWT, async function (err, payload) {
        if (err) {
            return res.status(403).send({
                error: "Token refresh is invalid",
            });
        }
        const userDoc = await UserModel.findById(payload.sub);
        if(!userDoc) {
            return res.status(403).send({
                error: "User no longer exists in the database.",
            });
        }
        return res.json(Object.assign(generateTokens(req, userDoc), { 'roles': userDoc.roles }));
    });
};