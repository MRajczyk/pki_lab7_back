import { DataModel } from '../models/data.js' ;

async function doesDataExist() { 
  const exec = await DataModel.find().exec() 
  return exec.length > 0 
} 

// Initialize first user 
export const initializeData = async () => { 
    if(!await doesDataExist()) { 
        let data = await DataModel.create({ 
            name: "dataResourceOnlyForAdmins",
            requiredRole: "ADMIN", 
        }) 
        
        let done = 0; 
        for (let i = 0; i < data.length; i++) { 
            data[i].save((err, result) => { 
                done++; 
            }) 
        }

        data = await DataModel.create({ 
            name: "dataResourceForLoggedUsers",
            requiredRole: "USER", 
        }) 
        
        for (let i = 0; i < data.length; i++) { 
            data[i].save((err, result) => { 
                done++; 
            }) 
        }

        data = await DataModel.create({ 
            name: "dataResourceForEveryone",
            requiredRole: "", 
        }) 
        
        for (let i = 0; i < data.length; i++) { 
            data[i].save((err, result) => { 
                done++; 
            }) 
        }
    } 
}