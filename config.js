export const config = { 
  //MONGO CONFIG 
  URI_MONGO: process.env.URI_MONGO || 'mongodb+srv://mikolajrajczyk01:uL9XOGpr4PmKGhR5@pkilab7.rnrjpmd.mongodb.net/test',
  //PORT APP CONFIG 
  PORT_LISTEN: process.env.PORT_LISTEN || 8080, 
  //JWT CONFIG 
  TOKEN_SECRET_JWT: process.env.TOKEN_SECRET_JWT || 'jWt9982_s!tokenSecreTqQrtw'
}