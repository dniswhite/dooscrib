dooScrib
=======
A simple jquery plugin for use with the HTML5 [canvas](http://en.wikipedia.org/wiki/Canvas_element) element. More development done to demonstrate an implementation of a shared canvas using node.js and socket.io as well as a separate implementation using [swift](https://swift.org/), [Vapor](https://vapor.codes/) and WebSockets. 

### History
The idea came while watching my [wife](http://kllywhite.com/) play this drawing game on her iPad called [DrawSomething](https://itunes.apple.com/us/app/draw-something-free/id488628250?mt=8) and I was thinking to myself that I could probably do something similar but in HTML and javascript. 

### Action
I will admit that the site is basic but you can get a feel for what the control does at the following location:

[dooScrib](http://dooscrib.com/)

The site is currently running on (Heroku)[https://www.heroku.com/].

### Usage
Here is a quick example of how to use the code.

```html
<!--an element that will contain the canvas-->
<div id="surface" class="span12">
</div>
```
```javascript
// create a variable for the plugin
var surface;

surface = new $('#surface').dooScribPlugin({
	width:w,
	height:400,
	cssClass:'pad',
	penSize:4
});
```

For a more detailed example you can read this [article](http://www.codeproject.com/Articles/560229/DooScrib-A-jQuery-plugin-for-creating-a-simple-dra) which I wrote as a starting point for a series of planned articles demonstrating how to create a shared canvas. 

### Shared Canvas
Check out the node_impl folder for a project that demonstrates how you can use the plugin to create a shared canvas using javascript, Node.js and socket.io.

Check out the vapor_dooscrib folder for a project that demonstrates how you can use the plugin to create a shared canvas using Swift, Vapor and WebSockets.
