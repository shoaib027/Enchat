const jwt = require('jsonwebtoken')
require('dotenv').config();
const fetchuser = (req,res,next)=>{
    const SECRET = process.env.JWT_SECRET_TOKEN;
    //Get the user from the jwt token and add id to the req obj
    const token = req.header('authToken')
    if(!token){
        res.status(401).send(error.message)
    }
    try {
        const data = jwt.verify(token,SECRET)
        req.user = data.user
        next();
    }
    catch (error) {
        res.status(401).send(error.message)
    }
     
}
module.exports = fetchuser