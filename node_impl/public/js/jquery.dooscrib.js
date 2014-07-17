/*
* File:			jquery.dooscrib.js
* Author:		Dennis White 
* Site:			http://dooscrib.com
*/
function Point(a, b) {
    if (true === isNaN(Number(a))) {
        this.x = 0;
    } else {
        this.x = a;
    }

    if (true === isNaN(Number(b))) {
        this.y = 0;
    } else {
        this.y = b;
    }

    return {
        "X": this.x,
        "Y": this.y
    };
}

(function($) {
	$.fn.extend({dooScribPlugin:function(options){
		var dooScrib = this;
		var prevPoint = undefined;
		
		var defaultOptions = {
			penSize:2,
			width:100,
			height:100,
			cssClass:'',
			onClick: function(e) {},
			onMove: function(e) {},
			onPaint: function(e) {},
			onRelease: function(e) {}
		};
		
        if (options)
            dooScrib.Settings = $.extend(defaultOptions, options);
		else
			dooScrib.Settings = defaultOptions; 	
			
		if(true === isNaN(dooScrib.Settings.height)){
			dooScrib.Settings.height = 100;
		}
		
		if(true === isNaN(dooScrib.Settings.width)){
			dooScrib.Settings.width = 100;
		}
		
		function normalizeTouch(e) {
		    if (true === dooScrib.hasTouch()) {
		        if (['touchstart', 'touchmove', 'touchend'].indexOf(e.type) > -1) {
		            e.clientX = event.targetTouches[0].pageX;
		            e.clientY = event.targetTouches[0].pageY;
		        }
		    }
		
		    return e;
		}

		var clickDown = function(e) {
		    if (true === dooScrib.isDrawing()) {
		        return;
		    }
		
		    if (!e) {
		        e = window.event;
		    }
		
		    if (true === dooScrib.hasTouch()) {
		        e.preventDefault();
		        e = normalizeTouch(e);
		    }
		    
		    var offset = $(dooScrib).offset();
	        var pt = new Point(e.clientX - offset.left, e.clientY - offset.top);
	        
	        prevPoint = pt;
		
		    dooScrib.drawing = true;

			dooScrib.Settings.onClick(pt);
			
			return false;
		};
		
		var moved = function(e) {
	        if (!e) {
	            e = window.event;
	        }
	
	        if (true === dooScrib.hasTouch()) {
	            e.preventDefault();
	            e = normalizeTouch(e);
	        }

		    var offset = $(dooScrib).offset();
	        var pt = new Point(e.clientX - offset.left, e.clientY - offset.top);
	        
			if (true === dooScrib.isDrawing()) {
				dooScrib.drawLine(prevPoint.X, prevPoint.Y, pt.X, pt.Y);
		        prevPoint = pt;
		        
				dooScrib.Settings.onPaint(pt);
			}
			else {
				dooScrib.Settings.onMove(pt);
			}
			
			return false;
		};
		
		var clickUp = function(e) {
		    if (false === dooScrib.isDrawing()) {
		        return;
		    }
		
	        if (!e) {
	            e = window.event;
	        }
	
		    dooScrib.drawing = false;

	        if (true === dooScrib.hasTouch()) {
	            e.preventDefault();
	            e = normalizeTouch(e);
	        }

		    var offset = $(dooScrib).offset();
	        var pt = new Point(e.clientX - offset.left, e.clientY - offset.top);

		    dooScrib.Settings.onRelease(pt);
		
		    return false;			
		};

		dooScrib.hasTouch = function() {
			return 'ontouchstart' in window;
		};
		
		var penWidth = 2;
		function validatePenSize(e){
			if(undefined !== e){
				if(false === isNaN(Number(e))) {
					return true;
				}
			}
			
			return false;
		}
		
		dooScrib.penSize = function(e) {
			if(true === validatePenSize(e)){
				penWidth = e;
			}
			
			return penWidth;
		};
		
		this.drawing = false;
		dooScrib.isDrawing = function() {
			return this.drawing;
		};
		
		var ID = this.attr('ID');
		if ((undefined === ID) || ('' === ID)){
			ID = 'dooScribCanvas'+Math.round($.now()*Math.random());
		}
		else {
			ID = 'dooScribCanvas'+Math.round($.now()*Math.random())+ID;
		}
		
		dooScrib.ID = function() {
			return ID;
		};
		
		var cap = 'round';
		function validateLineCap(e){
			if(undefined !== e) {
				switch(e){
					case 'butt':
					case 'round':
					case 'square':
						return true;
						break; 
				}
			}
			
			return false;
		}

		dooScrib.lineCap = function(e) {
			if(true === validateLineCap(e)) {
				cap = e;
			}
			
			return cap;
		};
		
		var color = "#000000";
		function validateLineColor(e) {
			if(undefined !== e) {
				var a = $("<div id='stub' style='backgroundColor:white'></div>");
				var b = a.css('backgroundColor', e).css('backgroundColor');
				if ((undefined !== b) && ('' !== b)) {
					return true;
				}
			}
			
			return false;
		}
		
		dooScrib.lineColor = function(e) {
			if(true === validateLineColor(e)) {
				color = e;
			}
			
			return color;
		};
		
		var drawingSurface;
		dooScrib.context = function() {
			return drawingSurface;
		};
		
		dooScrib.clearSurface = function() {
			drawingSurface.clearRect(0, 0, dooScrib.Settings.width, dooScrib.Settings.height);
		};
		
		dooScrib.drawLine = function(fromX, fromY, toX, toY, lineColor, lineWidth, lineEnd) {
			if ((undefined !== fromX) && (undefined !== fromY) && (undefined !== toX) && (undefined !== toY)) {
				if((false === isNaN(Number(fromX))) && (false === isNaN(Number(fromY))) && (false === isNaN(Number(toX))) && (false === isNaN(Number(toY)))) {
					if(false === validateLineCap(lineEnd)) {
						lineEnd = dooScrib.lineCap();
					}
					
				    drawingSurface.lineCap = lineEnd;
				    
				    if(false === validateLineColor(lineColor)){
				    	lineColor = dooScrib.lineColor();
				    }
				    
				    drawingSurface.strokeStyle = lineColor;
		
				    if(false === validatePenSize(lineWidth)) {
				    	lineWidth = dooScrib.penSize();
				    }
				    drawingSurface.lineWidth = lineWidth;
				    drawingSurface.beginPath();
				    
				    drawingSurface.moveTo(fromX, fromY);
					
			        drawingSurface.lineTo(toX, toY);
			        drawingSurface.stroke();
				}
			}
		}
		
		return this.each(function(){
			$("<canvas id='"+ID+"' class='"+defaultOptions.cssClass+"' height='"+defaultOptions.height+"' width='"+defaultOptions.width+"'></canvas>").appendTo(dooScrib);

		    dooScrib.penSize(defaultOptions.penSize);
		    
		    drawingSurface = document.getElementById(ID).getContext('2d');
		    drawingSurface.lineWidth = dooScrib.penSize();
		    drawingSurface.lineCap = cap;

		    if (false === dooScrib.hasTouch()) {
		        document.getElementById(ID).addEventListener('mousedown', clickDown, true);
		        document.getElementById(ID).addEventListener('mousemove', moved, true);
		        document.getElementById(ID).addEventListener('mouseup', clickUp, true);
		    }
		    else {
		        document.getElementById(ID).addEventListener('touchstart', clickDown, true);
		        document.getElementById(ID).addEventListener('touchmove', moved, true);
		        document.getElementById(ID).addEventListener('touchend', clickUp, true);
		    }
		});
	}});
})(jQuery);