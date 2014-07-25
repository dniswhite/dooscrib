dooScrib node.js implementation 
=======
Well I had promised an implementation using node.js and socket.io for some realtime collaboration so here it is.

### Usage on the Client Side
From the client side (using the plugin) here is a quick example of the code in use.

```html
<!--an element that will contain the canvas-->
<div id="surface" class="span12">
</div>
```

Initializing the plugin for use and giving it event handlers that will send messages back to the node.js server.
```javascript
$(document).ready(function(){
	var h = $('#surface').height();
	var w = $('#surface').width();

    surface = new $('#surface').dooScribPlugin({
      width:w,
      height:400,
      cssClass:'pad',
      penSize:4,
      // event handlers 
      onMove:function(e) {
      	// cursor is moving over the canvas
        socket.emit('mousemove', {clientID:id, X:e.X, Y:e.Y});
      },
      onClick:function(e) {
      	// selection was made and drawing has started
        socket.emit('start', {clientID:id, X:e.X, Y:e.Y});
      }, 
      onPaint:function(e) {
      	// cursor is being moved while the plugin is painting a line
        socket.emit('painting', {clientID:id, X:e.X, Y:e.Y, color:surface.lineColor(), pen:surface.penSize(), cap:surface.lineCap()});
      },
      onRelease:function(e) {
      	// cursor was released and painting has stopped
        socket.emit('release', {clientID:id, X:e.X, Y:e.Y});
      }
    });
});
```

Have to of course listen to message that the server will send from all the other clients that are out there.
```javascript
socket.on('starting', function(data){
	console.log('starting - ', data);
	prevPoint[data.clientID] = data;
});
socket.on('moving', function(data){
	console.log('moving - ', data);
});
socket.on('paint', function(data){
	console.log('paint - ', data);
	surface.drawLine(prevPoint[data.clientID].X, prevPoint[data.clientID].Y, data.X, data.Y, data.color, data.pen, data.cap);
	prevPoint[data.clientID] = data;
});
socket.on('released', function(data){
	console.log('released - ', data);
});
socket.on('clear', function(data){
	console.log('clear surface request - ', data);
	surface.clearSurface();
});
```
### Server Implementation
The server implementation was fairly simple (IMO) because basically all the server does is receives messages and then sends 
them back out. The only difference is that the messages to the server are different from those being sent to the client(s).

```javascript
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
```

### More Information 
For a more detailed example you can read this [article](http://www.codeproject.com/Articles/798498/DooScrib-Collaboration-with-an-HTML-Canvas) 
which I wrote to demonstrate everything being done on both the clientand server side. Just a note but 
the article of course assumes that you are familiar with node, express and socket.io. 

### Future
Keep checking back as I plan to create individual rooms and add the ability to save images and restore images.

