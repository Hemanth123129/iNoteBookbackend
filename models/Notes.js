const mongoose = require('mongoose');
const { Schema } = mongoose;

const NotesSchema = new Schema({
  UserId      : {type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  Title       : {type: String, required: true}, 
  Description : {type: String, required: true},
  Tag         : {type: String}
  
});

module.exports = mongoose.model("Notes", NotesSchema)