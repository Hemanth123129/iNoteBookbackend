const mongoose = require("mongoose")
const { Schema } = mongoose;

const UserSchema = new Schema({
  
  FirstName: {type: String, required: true,}, 
  LastName : {type: String,},
  Email    : {type: String, required: true, unique:true},
  Password : {type: String, required: true},
  date     : {type: Date, default: Date.now }
  
});

module.exports = mongoose.model("Users", UserSchema)