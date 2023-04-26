import { UserModel } from '../models/user.js' ;

async function doUsersExist() { 
  const exec = await UserModel.find().exec() 
  return exec.length > 0 
} 

// Initialize first user 
export const initializeUser = async () => {
  if(!await doUsersExist()) {
    const user = await UserModel.create({ 
        roles: ["ADMIN"],
        name: "admin", 
        email: "admin@admin.com", 
        password: "admin",
        accepted: true
      })
    
    let done = 0; 
    for (let i = 0; i < user.length; i++) { 
      user[i].save((err, result) => { 
        done++; 
      }) 
    } 
  } 
}