export const config = { 
  //MONGO CONFIG 
  URI_MONGO: process.env.URI_MONGO || 'mongodb://127.0.0.1:27017/PKI_lab5_jwt', 
  //PORT APP CONFIG 
  PORT_LISTEN: process.env.PORT_LISTEN || 8080, 
  //JWT CONFIG 
  TOKEN_SECRET_JWT: process.env.TOKEN_SECRET_JWT || 'jWt9982_s!tokenSecreTqQrtw' 
}