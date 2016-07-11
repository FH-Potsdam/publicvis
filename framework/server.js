var express = require('express'),
	app = express(),
	fs = require('fs'),
	http = require('http').Server(app),
	io = require('socket.io')(http);

var ip = null, port = 3000, width, height, user_id = 0, display = {width:false, height:false, offset:{x:false,y:false}};

//Lookup the current ip
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
	ip = add;

	//General calls just let us know if the server is running
	app.get('/', function(req, res){
		res.send('server is running');
	});

	//Simply delivering html templates, {{IP}} and {{PORT}} are replaced with current ip and port
	app.get('/page/:name', function(req, res){
		
		var file_name = req.params.name;

		try {
			var file_content = fs.readFileSync('./'+file_name+'.html', 'utf8');
			res.send(file_content.replace(new RegExp("{{IP}}", 'g'), ip).replace(new RegExp("{{PORT}}", 'g'), port));
		} catch (e) {
			res.send('Page does not exist.');
		}
	});

	//Serving static files from the "./assets/" folder
	app.use('/static', express.static('assets'));

	//Socket IO Server
	io.on('connection', function(socket){
		socket.type = false;
		socket.id = user_id++;

		socket.on('register', function(msg){
			socket.type = msg;
			if(msg === "controller"){
				updateScreen();
				io.emit('updateDisplay', display);
			}else{
				io.emit('updateDisplay', display);
			}
		});

		socket.on('size', function(msg){
			width = msg[0];
			height = msg[1];
			updateScreen();
		});

		socket.on('setDisplay', function(msg){
			if("width" in msg){display.width = msg.width;}
			if("height" in msg){display.height = msg.height;}
			if("x" in msg.offset){display.offset.x = msg.offset.x;}
			if("y" in msg.offset){display.offset.y = msg.offset.y;}

			io.emit('updateDisplay', display);
		});		

	});

	http.listen(port, function(){
		console.log('listening on '+ip+':'+port);
	});
});

function updateScreen(){
	io.emit('updateScreen', [width, height]);
}