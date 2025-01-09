const express = require("express");


const User = require("../models/User")
const decrypttoken = require("../middleware/decrypttoken")

const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');

const SECRET_KEY = 'Hemanth@200402'




const router = express.Router()

// CREATE A USER: POST "/api/auth/createuser"
router.post('/',
    [   body('FirstName', "FirstName should contain min 2 characters").isLength({ min: 2 }),
        body('Email',"Enter a Valid Email").isEmail(),
        body('Password',"Password should contain min 5 characters").isLength({ min: 5 })
    ],
    async (req,res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) 
            {
                return res.status(400).json({errors : result.array()})
        }
        try{
            let user = await User.findOne({Email: req.body.Email})
            if(user){
                return res.status(400).json({error : "User with this email exists"})
            }

            var salt = bcrypt.genSaltSync(10);
            var passgen = await bcrypt.hash(req.body.Password,salt)

            user = await User.create({
                FirstName: req.body.FirstName,  
                LastName : req.body.LastName,
                Email    : req.body.Email,
                Password : passgen
                
            })
            res.json(user)
        } catch(error){
            console.log(error.message)
            res.status(500).send("Some error occured")
        }      
})


// LOGIN WITH USER AND SEND A TOKEN: POST "/api/auth/login"
router.post("/login",
    [
        body('Email'   ,"Enter a Valid Email").isEmail(),
        body('Password',"Password should contain min 5 characters").exists()
    ],
    async (req,res)=>{
        const errorsarr = validationResult(req);
        if (!errorsarr.isEmpty()) 
            {
                return res.status(400).json({errors : errorsarr.array()})
        }

        try{
            let validuser = await User.findOne({Email: req.body.Email})
            if(!validuser){
                return res.status(400).json({error : "Incorrect Credintials"})
            }

            const Passcheck = await bcrypt.compare(req.body.Password,validuser.Password)
            if(!Passcheck){
                return res.status(400).json({error : "Incorrect Credintials"})
            }

            // res.status(400).json({"msg" : "User logged in successfully"})

            Data = {"UserDetails": validuser}
            const token = jwt.sign(Data, SECRET_KEY)
            return res.json({token})

        }catch(error){
            return res.status(500).json({error : "Some Internal Error"})
        }
})

// GET THE USER DETAILS WITH TOKEN AFTER LOGIN : POST "/api/auth/getuser"

router.post("/getuserdetails",decrypttoken,async(req,res) =>{
    try{
        let userid = req.user._id;
        const userdetailsexpectpass = await User.findById(userid).select("-Password")
        res.status(200).json({"UserDetails": userdetailsexpectpass})
    }catch{
        return res.status(500).json({error : "Some Internal Error"})

    }
})


module.exports = router