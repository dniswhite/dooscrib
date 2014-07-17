var http = require('http'),
    express = require('express'),
    path = require('path');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);

app.set('port', process.env.PORT || 8080); 
app.set('views', path.join(__dirname, 'views')); 
app.set('view engine', 'jade'); 

app.use(express.bodyParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res) {
    res.render('404', {url:req.url});
});

io.on('connection', function (socket) {
	socket.on('start', function(data){
		console.log('starting - ', data);
		socket.broadcast.emit('starting', data);
	});	
	socket.on('mousemove', function(data){
		console.log('moving - ', data);
		socket.broadcast.emit('moving', data);
	});
	socket.on('painting', function(data){
		console.log('paint - ', data);
		socket.broadcast.emit('paint', data);
	});
	socket.on('release', function(data){
		console.log('released - ', data);
		socket.broadcast.emit('released', data);
	});
	socket.on('clear', function(data){
		console.log('clearing - ', data);
		socket.broadcast.emit('clear', data);
	});
});
 
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});