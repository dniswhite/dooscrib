dooScrib Vapor implementation 
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
    var height = $('#raw() { #surface }').height();
    var width = $('#raw() { #surface }').width();

    dooscrib = new dooScribConnection(window.location.host + "/dooscrib");
    surface = new $('#raw() { #surface }').dooScribPlugin({
        width:width,
        height:400,
        cssClass:'pad',
        penSize:4,

        onMove:function(e) {
            var msg = JSON.stringify({'command': 'mousemove', 'username': id, 'X': e.X, 'Y': e.Y });
            dooscrib.send(msg);
        },

        onClick:function(e) {
            var msg = JSON.stringify({'command': 'click', 'username': id, 'X': e.X, 'Y': e.Y});
            dooscrib.send(msg);
        },

        onPaint:function(e) {
            var msg = JSON.stringify({'command': 'paint', 'username': id, 'X': e.X, 'Y': e.Y,'pen': surface.penSize(),'color':surface.lineColor()});
            dooscrib.send(msg);
        },

        onRelease:function(e) {
            var msg = JSON.stringify({'command': 'release', 'username': id, 'X': e.X, 'Y': e.Y});
            dooscrib.send(msg);
        }
    });
});
```

Have to of course listen to message that the server will send from all the other clients that are out there.
```javascript
function dooScribConnection(host) {
    var scrib = this;

    scrib.ws = new WebSocket('wss://' + host);

    scrib.ws.onopen = function() {
        var connRequest = JSON.stringify({'command': 'connect', 'username': id})
        scrib.ws.send(connRequest)
    };

    scrib.ws.onmessage = function(event) {
        var msg = JSON.parse(event.data);

        if (msg.command == "click") {
            prevPoint[msg.username] = msg;
        } else if (msg.command == "paint") {
            surface.drawLine(prevPoint[msg.username].X, prevPoint[msg.username].Y, msg.X, msg.Y, msg.color, msg.pen);
            prevPoint[msg.username] = msg;
        } else if (msg.command == "clear") {
            surface.clearSurface();
        }
    };

    scrib.send = function(event) {
        scrib.ws.send(event);
    };
};
```

Then of course there are a few variables that are created so everything will run smoothly across multiple browsers and on different machines across the network (internet).
```javascript
var id = Math.round($.now()*Math.random());
var prevPoint = new Array();
var surface;
var dooscrib;
```
### More Information 
Check back as I will be writing an article demonstrating the server implementation via swift, vapor and websockets. 

### Future
Keep checking back as I plan to create individual rooms and add the ability to save images and restore images.
