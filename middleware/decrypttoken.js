const SECRET_KEY = 'Hemanth@200402'
const jwt    = require('jsonwebtoken')
 
const decrypttoken = async (req,res,next) =>{
    const token = req.header('token')
    if(!token){
        return res.status(401).json({error:"Please authenticate with a valid token"})
    }

    try{
        var decodedtoken = jwt.verify(token, SECRET_KEY)
        req.user = decodedtoken.UserDetails
        next()
    }catch{
        res.status(401).json({error:"Please authenticate with a valid token"})
    }
    
} 

module.exports = decrypttoken