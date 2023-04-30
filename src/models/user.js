import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

export const saltRounds = 10 
const {Schema, model} = mongoose 

const UserSchema = new Schema({ 
  name: { 
    type: String, 
    trim: true, 
    required: true, 
  }, 
  email: { 
    type: String, 
    trim: true, 
    required: true, 
    unique: true, 
  }, 
  password: { 
    type: String, 
    trim: true, 
    required: true,
    select: true
  }, 
  roles: {
    type: [String],
    trim: true, 
    default: ['USER']
  },
  joined: {
    type: Date,
    trim: true,
    default: new Date()
  },
  accepted: {
    type: Boolean,
    trim: true,
    default: false
  },
  acceptDeadline: {
    type: Date,
    trim: true,
    default: () => new Date(Date.now() + 1*60*1000)
  },
  lastVisit: {
    type: Date,
    trim: true,
    default: new Date()
  },
  counter: {
    type: Number,
    trim: true,
    default: 1
  },
},
{ 
  versionKey: false 
})
UserSchema.index({"acceptDeadline": 1}, { expireAfterSeconds: 0, partialFilterExpression: {"accepted": false} });

UserSchema.pre('save', async function (next) {
  this.password = await bcrypt.hashSync(this.password, saltRounds);
  next();
})

export const UserModel = model('User', UserSchema);
