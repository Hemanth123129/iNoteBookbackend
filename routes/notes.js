const express = require("express");
const router = express.Router()
const { body, validationResult } = require('express-validator');


const decrypttoken = require("../middleware/decrypttoken")
const Notes = require("../models/Notes");


// FETCH ALL NOTES OF A USER: GET "/api/notes/fetchallnotes"

router.get("/fetchallnotes", decrypttoken, async (req,res) => {
    try{
        const allnotes = await Notes.find({UserId: req.user._id})
        return res.json(allnotes)
    }catch{
        return res.status(500).send("Some Internal Error")
    }
    
})

// CREATE A NOTE FOR A USER: POST "/api/notes/fetchallnotes"

router.post("/addnote", decrypttoken, 
    [   body('Title', "Title should contain min 2 characters").isLength({ min: 2 }),
        body('Description',"Description must be atleast 5 characters").isLength({ min: 5 })
    ],
    async (req,res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) 
            {
                return res.status(400).json({errors : result.array()})
        }
        try{
            const NewNote = await Notes.create({
                "UserId"      : req.user._id, 
                "Title"       : req.body.Title,
                "Description" : req.body.Description,
                "Tag"         : req.body.Tag,
            })

            res.send(NewNote)


        }catch{
            return res.status(500).send("Some Internal Error")

        }
    
})

// UPDATE A NOTE FOR A USER: PUT "/api/notes/updatenote/:id" 

router.put("/updatenote/:id", decrypttoken, async (req,res) => {
        try{
            const {Title,Description,Tag} = req.body

            const notetobeupdated = await Notes.findById(req.params.id)
            if(!notetobeupdated){
                return res.status(400).send("Invalid Note")
            }

            if(req.user._id !== notetobeupdated.UserId.toString() ){
                return res.status(400).send("Note Cannot be deleted")
            }

            const NewNote = {}
            if(Title){NewNote.Title = Title}
            if(Description){NewNote.Description = Description}
            if(Tag){NewNote.Tag= Tag}


            const updatednote = await Notes.findByIdAndUpdate(req.params.id, {$set: NewNote}, {new: true})
            res.json({"msg": "Note updated successfully"})

        }catch{
            return res.status(500).send("Some Internal Error")

        }
    
})


// DELETE A NOTE FOR A USER: DELETE "/api/notes/deletenote/:id" 

router.delete("/deletenote/:id", decrypttoken, async (req,res) => {
    try{
        const notetobedeleted= await Notes.findById(req.params.id)
        if(!notetobedeleted){
            return res.status(400).send("Invalid Note")
        }

        if(req.user._id !== notetobedeleted.UserId.toString() ){
            return res.status(400).send("Note Cannot be deleted")
        }

        const updatednote = await Notes.findByIdAndDelete(req.params.id)
        res.json({"msg": "Note deleted successfully"})

    }catch{
        return res.status(500).send("Some Internal Error")
    }

})





module.exports = router