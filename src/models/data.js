import mongoose from 'mongoose'

const {Schema, model} = mongoose 

const DataSchema = new Schema({ 
  name: { 
    type: String, 
    trim: true, 
    required: true, 
  },
  requiredRole: { 
    type: String, 
    trim: true, 
    default: 'USER' 
  } 
}, 
{ 
  versionKey: false 
}) 

export const DataModel = model('Data', DataSchema);