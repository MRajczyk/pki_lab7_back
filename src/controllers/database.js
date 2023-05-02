import mongoose from 'mongoose';

export const getDatabaseHealth = async (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        res.status(200).send({connected: false});
        next();
    } else {
        res.status(200).send({connected: true})
    }
}

