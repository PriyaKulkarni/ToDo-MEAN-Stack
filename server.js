var express = require ('express');
	app = express();
	bodyParser = require('body-parser');				// pull info from HTML POST
	morgan = require('morgan');							// request logger
	methodOverride = require('method-override');		// simulate DELETE and PUT
	mongoose = require('mongoose');						// mongoose for mongoDB
 
 //configuration

 	mongoose.connect('mongodb://127.0.0.1:27017/test', function(err) {			//connect to mongoDB locally
		if (err) {
			console.error('Could not connect to MongoDB!');
			console.log(err);
		} else {
			console.log('Successfully connected to MongoDB');
		}
	});

app.use(bodyParser.json());								// parse application/json
app.use(bodyParser.urlencoded({extended : true}));		// parse application/x-www-form-urlencoded
app.use(morgan('dev'));									// log concise output for development
app.use(methodOverride());								// override with the X-HTTP-Method-Override(default) header in the request

app.use(express.static(__dirname + '/public'));			// "public" off of current is root

// define model
var Todo = mongoose.model('Todo', {
	text : String
});

//routes

	//API
	//get all to-dos 
	app.get('/api/todos', function(req, res) {

		Todo.find(function(err, todos) {
			if (err)
                res.send(err);

			res.json(todos);
		});
	});

	//create a to-do
	app.post('/api/todos', function(req, res) {
        
		Todo.create({ text : req.body.text }, function(err, todo) {
			if (err)
                res.send(err);

			Todo.find(function(err, todos) {
				if (err)
            	    res.send(err);

				res.json(todos);
			});
		});
	});

	//update a to-do
	app.put('/api/todos/:todo_id',function(req, res) {

		Todo.findByIdAndUpdate({ _id: req.params.todo_id }, { text: req.body.text }, function(err, todo) {
			if (err)
                res.send(err);

			Todo.find(function(err, todos) {
				if (err)
            	    res.send(err);

				res.json(todos);
			});
		});
	});


	//delete a to-do
	app.delete('/api/todos/:todo_id', function(req, res) {

		Todo.remove({ _id : req.params.todo_id }, function(err, todo) {
			if (err)
                res.send(err);

			Todo.find(function(err, todos) {
				if (err)
                	res.send(err);

				res.json(todos);
			});
		});
	});

// application
app.get('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html'); //load the single view file
});

// listen
app.listen(3000);
console.log('App listening on port 3000');