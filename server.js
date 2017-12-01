const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
//default path
app.use(express.static('./public'));
// parse application/json
app.use(bodyParser.json())
//
mongoose.connect('mongodb://localhost/noteBackbone', {useMongoClient: true});
//
const Schema = mongoose.Schema;
const NoteSchema = new Schema({
	todo: String,
	description: String,
	additional: String
});
mongoose.model('Note', NoteSchema);
const Note = mongoose.model('Note');

//routes
//get list notes
app.get('/api/notes', (req, res) => {
	Note.find((err, notes) => {
		res.send(notes);
	})
})
//post a note into list
app.post('/api/notes', (req, res) => {
	let note = new Note(req.body);
	note.save((err, item) => {
		if (err) return console.error(err+'');
		res.send(item);
		console.log(item);
	});
})
//delete a note
app.delete('/api/notes/:id', (req, res) => {
	// delele a note with a given id 
	Note.find({_id: req.params.id}).remove().exec();
})
//
app.put('/api/notes/:id', (req, res) => {
	Note.find({_id: req.params.id}).update(req.body).exec();
})
app.listen(3000);
