module.exports = {
    username: process.env.POSTGRES_USERNAME,      
    password: process.env.POSTGRES_PASSWORD, 
    database: process.env.POSTGRES_DB,    
    host: "localhost",            
    dialect: "postgres",
};
