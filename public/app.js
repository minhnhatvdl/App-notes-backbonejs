//model
Backbone.Model.prototype.idAttribute = '_id';
//
var Note = Backbone.Model.extend({
	defaults: {
		todo: '',
		description: '',
		additional: ''
	}
})
//collection
var Notes = Backbone.Collection.extend({
	url: 'http://localhost:3000/api/notes'
})

//init
var listNotes = new Notes();
//view
//create a row tr from a note
var NoteRow = Backbone.View.extend({
	model: new Note(),
	tagName: 'tr',
	template: _.template($('#template-note').html()),
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
	events: {
		'click .edit-note': 'editNote',
		'click .delete-note': 'deleteNote',
	},
	editNote: function() {
		var editNoteView = new EditNoteRow({model: this.model});
		this.$('.todo').parents('tr').replaceWith(editNoteView.$el);
	},
	deleteNote: function() {
		this.model.destroy();
	}
})
//view edit a note
var EditNoteRow = Backbone.View.extend({
	model: new Note(),
	tagName: 'tr',
	template: _.template($('#template-edit-note').html()),
	initialize: function() {
		this.render();
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
	},
	events: {
		'click .update-note': 'updateNote',
		'click .cancel-note': 'cancelNote',
	},
	updateNote: function() {
		this.updateModel();
	},
	cancelNote: function() {
		view.render('cancel');
	},
	updateModel: function() {
		var todo = this.$('.todo-edit-input').val();
		var description = this.$('.description-edit-input').val();
		var additional = this.$('.additional-edit-input').val();
		if(todo && description && additional) {
			this.model.save({todo, description, additional});
		} else {
			alert('Fill in all fields');
		}
	}
})
//add list tr onto table
var ListNotesView = Backbone.View.extend({
	model: listNotes,
	el: $('#list-note'),
	initialize: function() {
		//get events when add and/remove/change a note to/from/from a collection
		this.model.on('add', note => this.render('add'));
		this.model.on('remove', note => this.render('remove'));
		this.model.on('change', note => this.render('change'));
		this.model.fetch().then(response => console.log('load done')).catch(err => console.log(err+''));
	},
	render: function(action) {
		console.log(`${action}: ${this.model.length}`);
		//set template empty
		this.$el.html('');
		//loop in collection to display a new template
		_.each(this.model.toArray(), item => {
			var note = new NoteRow({model: item});
			this.$el.append(note.$el);
		})
	}
})

var view = new ListNotesView();

//add a note in template
function addNote() {
	var todo = $('.todo-input').val();
	var description = $('.description-input').val();
	var additional = $('.additional-input').val();
	if(todo && description && additional) {
		//clear all inputs
		clearAllFields();
		var newNote = new Note({todo, description, additional});
		listNotes.add(newNote);
		//send to method post to save in database
		newNote.save();
	} else {
		alert('Fill in all fields');
	}
}
//clear all inputs
function clearAllFields() {
	$('.todo-input').val('');
	$('.description-input').val('');
	$('.additional-input').val('');
}


