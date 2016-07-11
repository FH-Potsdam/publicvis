var express = require('express'),
	app = express(),
	fs = require('fs'),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var ip = null, port = 3000, controller_html = null;

require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	ip = add;

	fs.readFile('./controller.html', 'utf8', function (err,data) {
		if (err) return console.log(err);
		
		controller_html = data;
	});

	app.get('/', function(req, res){
		res.send('server is running');
	});

	app.get('/controller', function(req, res){
		res.send(controller_html.replace(new RegExp("{{IP}}", 'g'), ip).replace(new RegExp("{{PORT}}", 'g'), port));
	});

	app.use('/static', express.static('assets'));

	io.on('connection', function(socket){
		console.log('a user connected');

		socket.broadcast.emit('hi');

		socket.on('disconnect', function(){
			console.log('user disconnected');
		});

		socket.on('chat message', function(msg){
			io.emit('chat message', msg);
		});
	});

	http.listen(port, function(){
		console.log('listening on '+ip+':'+port);
	});
});