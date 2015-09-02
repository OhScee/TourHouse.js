//JQUERY DEPENDENT 
var TourHouse = function(prop){
	var scope = (!(this instanceof TourHouse)) ? new TourHouse : this;
	this.properties = {
			screenColor: "#000000",
			screenOpacity: 0.5,
			borderShow: true,
			borderCol: "#C4C4C4",
			nextLabel: "Next",
			nextEndLabel: "Done",
			prevLabel: "Prev",
			showButtons: true,
			showPrev: true,
			exitButtonText: undefined,
			exitImage: "images/cross.png",
			showX: true,
			exitOnOut: false, //exit when clicking outside of special elements
			showStepNumber: true,
			onPageStart: false,
			goTo: function(step){
				//step validation
				//goToStep
			},
			clearAll: function(){
				//will call stop()
			}
		};
	if(prop !== undefined)
		scope.properties = propEval(prop);

	//screen
	var canvas,
	//buttons
		next,
		prev,
		exit;

	var deckBox;

	var deck = [];

	var currentStep = 0;
	var DATA = {
		AUTHOUR: "Nadia S.canvas.",
		VERSION: "1.3.1",
		LATEST: "19 June, 2015"
	};

	//create instances of each step with the following properties
	var currentSize = 0;
	var card = function(element, text){
		var self = this;
			this.elements = element;
			this.pos = null;
			this.texts = text;
			this.textProp = {
				relativeToOrderedElement: true,
				appearsBelow: false,
				position: null, //if above is false, where to position the text div
				margin: 10,
				show: true,
				className: "tour_texts",
				goToNext: function(){
					scope.goToNext();
				},
				goToPrev: function(){
					scope.goToPrev();
				}
			};
			this.step = currentSize;

		};

		function singleElement(sdeck){
			if(sdeck.length === undefined)
				return true;
			else
				return false;
		}

		//draws shapes to cut out of canvas
		function draw(ctx, el){
			//preparing to cut
			ctx.globalCompositeOperation = 'destination-out';
			ctx.fillStyle = 'rgba(0, 0, 0, 1)';

			var trueShape = el.getBoundingClientRect();
			var w = trueShape.width,
				h = trueShape.height,
				x = trueShape.left+$(window).scrollLeft(),
				y = trueShape.top+$(window).scrollTop(),
				radius = getComputedStyle(el).borderRadius; //this assumes all corners have the same radius
				radius = radius.replace('px', '');

				console.log(radius);

			if(radius > 0){
				ctx.lineJoin = "round";
				ctx.lineWidth = radius;

				var n_x = x+(radius/2),
					n_y = y+(radius/2),
					n_w = w - radius,
					n_h = h - radius;
				//make rectangle with rounded corners
				ctx.strokeRect(n_x, n_y, 
								n_w, n_h);

				ctx.fillRect(n_x, n_y, 
								n_w, n_h);

				deck[currentStep].pos = {x: n_x, y: n_y, width: n_w, height: n_h};

				ctx.globalCompositeOperation = "source-atop";
				ctx.shadowColor = '#999';
				ctx.shadowBlur = 10;
				ctx.shadowOffsetX = 10;
				ctx.shadowOffsetY = 10;
				ctx.fillRect(n_x,n_y,n_w,n_h);
			}
			else{
				ctx.fillRect(x, y, w, h);
				deck[currentStep].pos = {x: x, y: y, width: w, height: h};
				ctx.globalCompositeOperation = "source-atop";
				ctx.shadowColor = '#999';
				ctx.shadowBlur = 10;
				ctx.shadowOffsetX = 10;
				ctx.shadowOffsetY = 10;
				ctx.fillRect(x,y,w,h);
			}
		}

		function addText(txt, element){
			var txtProp = deck[currentStep].textProp;
			var pos = deck[currentStep].pos;
			var text = document.createElement("h3");
				text.className = txtProp.className;
				text.innerHTML = txt;

			var container = document.createElement("div");
				container.className = "tour_house_text_wrapper";
				container.style.position = "absolute";
				container.appendChild(text);
			//add as child to get sizes
			document.body.appendChild(container);

			//don't show
			if(!txtProp.show)
				return 1;
			//positioning container on screen
			var textBox = container.getBoundingClientRect(); //get styles

			//if the position is relative to the element
			if(txtProp.relativeToOrderedElement){
				//if above element
				if(!txtProp.appearsBelow && txtProp.position === null){
					var totalY =  pos.y - txtProp.margin - textBox.height;
					//check to make sure textbox does not go beyond top of page
					if(totalY < 0)
						console.warn('text element containing: ' ,txt, 'goes beyond the visible page. Please change appearsBelow to true');
					else{
						container.style.left = pos.x + "px";
						container.style.top = totalY + "px";
					}
				}
				//if below element
				else if(txtProp.appearsBelow && txtProp.position === null){
					var totalY =  (pos.y+pos.height) + txtProp.margin + textBox.height;

					//check to make sure textbox does not go beyond top of page
					if(totalY > $(window).height())
						console.warn('text element containing: ' ,txt, 'goes beyond the visible page. Please change appearsBelow to false');
					else{
						container.style.left = pos.x + "px";
						container.style.top = ((pos.y+pos.height) + txtProp.margin) + "px";
					}
				}
				//cannot have unique and relative position at same time
				else
					console.warn("cannot have textProp 'relativeToOrderedElement: true' and 'position: [not null]'!");
			}
			//if the element is uniquely set
			else if(txtProp.position !== null){
				//TO DO COMPLETE LATER WIP
				//
			}
			//must set position or make relative
			else
				console.warn("no settings for text styles. Set properties or change relativeToOrderedElement to true");

			container.parentNode.removeChild(container);

			//add container to deckBox
			deckBox.appendChild(container);
		}

		function addButtons(){
			if(!scope.properties.showButtons)
				return 1;

			var showPrev = (!scope.properties.showPrev || currentStep === 0) ? false : true;

			next = document.createElement("button");
			if(currentStep+1 === currentSize)
				next.innerHTML = scope.properties.nextEndLabel;
			else
				next.innerHTML = scope.properties.nextLabel;
			next.className = "tour_house_step_button";
			next.id = "tour_house_next_button";
			next.style.position = "absolute";
			document.body.appendChild(next);
			var n = next.getBoundingClientRect();
			var p = undefined;
			if(showPrev){
				prev = document.createElement("button");
				prev.innerHTML = scope.properties.prevLabel;
				prev.className = "tour_house_step_button";
				prev.id = "tour_house_prev_button";
				prev.style.position = "absolute";
				document.body.appendChild(prev);
				p = prev.getBoundingClientRect()
			}

			var pos = ( singleElement(deck[currentStep].elements) ) ? deck[currentStep].elements.getBoundingClientRect() : deck[currentStep].elements[0].getBoundingClientRect();

			var wt = $(window).scrollTop();
			var wl = $(window).scrollLeft();

			if(deck[currentStep].textProp.appearsBelow){
					next.style.top = pos.top+wt - n.height - deck[currentStep].textProp.margin + "px";
					next.style.left = pos.right+wl - n.width + "px";
					if(showPrev){
						prev.style.top = pos.top+wt - p.height - deck[currentStep].textProp.margin + "px";
						prev.style.left = pos.right - n.width - p.width - deck[currentStep].textProp.margin + "px";
					}

			} else{
				next.style.top = pos.bottom+wt + deck[currentStep].textProp.margin + "px";
				next.style.left = pos.right+wl - n.width + "px";
				if(showPrev){
					prev.style.top = pos.bottom+wt + deck[currentStep].textProp.margin + "px";
					prev.style.left = pos.right+wl - p.width - n.width - deck[currentStep].textProp.margin + "px";
				}
			}

			//show step numbers
			if(scope.properties.showStepNumber){
				n = next.getBoundingClientRect();
				steps = document.createElement('div');
				steps.id = "tour_house_steps_left";
				document.body.appendChild(steps);
				var ss = steps.getBoundingClientRect();
				steps.innerHTML="<p>"+(currentStep+1)+"/"+currentSize+"</p>";
				steps.style.top = n.top+wt + 20 + deck[currentStep].textProp.margin + "px";
				steps.style.left = n.right + deck[currentStep].textProp.margin + "px";
				deckBox.appendChild(steps);
			}

			//exit button append
			if(scope.properties.showX){
				exit = document.createElement('div');
				exit.id = "tour_house_exit_button";
				document.body.appendChild(exit);
				var e = exit.getBoundingClientRect();
				if(pos.top+wt - n.height - n.height*2 - deck[currentStep].textProp.margin > 0)
					exit.style.top = pos.top+wt - n.height - n.height*2 - deck[currentStep].textProp.margin + "px";
				else
					exit.style.top = pos.bottom+wt + n.height + n.height*2 + deck[currentStep].textProp.margin + "px";
				exit.style.left = pos.right+wl - e.width + 25 + "px";
				if(scope.properties.exitButtonText === undefined)
					exit.style.backgroundImage = 'url(' + scope.properties.exitButton + ')';
				else{
					exit.innerHTML = "<h2>"+scope.properties.exitButtonText+"</h2>";
				}
				exit.style.backgroundSize = "contain";
				document.body.removeChild(exit);
				exit.addEventListener('click', clear, false);
				deckBox.appendChild(exit);
			}
			if(showPrev){
				document.body.removeChild(prev);
				deckBox.appendChild(prev);
				prev.addEventListener("click", deck[currentStep].textProp.goToPrev, false);
			}

			document.body.removeChild(next);
			deckBox.appendChild(next);
			next.addEventListener("click", deck[currentStep].textProp.goToNext, false);
		}

		//prepend the screen and set the style for all necessary elements
		function applyStyles(){
			var old_p = document.body.firstChild;

			canvas = document.createElement("canvas"); //screen
			canvas.id = "tour_house_overlay";
			deckBox = document.createElement('div'); //wrapper for all the text elements
			deckBox.id = "tour_house_wrapper";
			canvas.appendChild(deckBox);

			//get full rectangle for element
			var j = currentStep;
			var sdeck = deck[j];
			var isSingleElement = singleElement(sdeck.elements);

			canvas = document.createElement('canvas');
			canvas.height = $(window).height() + 2000;
			canvas.width = $(window).width();
			canvas.style.opacity = scope.properties.screenOpacity;
			canvas.style.position = "absolute";

			var context = canvas.getContext("2d");
			//screen
			context.fillStyle = scope.properties.screenColor;
			context.fillRect(0, 0, canvas.width, canvas.height);

			//the cutting of elements
			if(isSingleElement) //only one element
				draw(context, sdeck.elements);
			else{ //multiple elements
				for(var i = sdeck.elements.length-1; i >= 0; i--){
					draw(context, sdeck.elements[i])
				}
			}

			//placing text on field
			//single text element
			if(typeof sdeck.texts === "string"){
				switch(isSingleElement){
					case true:
					addText(sdeck.texts, sdeck.elements);
					break;
					case false:
					addText(sdeck.texts, sdeck.elements[j]);
					break;
				}
			}
			//multiple text elements
			else{
				if(isSingleElement){
					for (var i = sdeck.texts.length - 1; i >= 0; i--) {
						addText(sdeck.texts[i], sdeck.elements);
					}
				}
				else{
					for (var i = sdeck.texts.length - 1; i >= 0; i--) {
						addText(sdeck.texts[i], sdeck.elements[j]);
					}
				}
			}

			if(!scope.properties.showButtons)
				return 1;
				
			else addButtons();
			document.body.insertBefore(canvas, document.body.firstChild);
			document.body.insertBefore(deckBox, document.body.firstChild);
			$("#tour_house_wrapper").fadeIn(800);
		}

		this.stats = function(){
			console.log("CANVAS ", canvas);
			console.log(" deckBox ", deckBox);
		};
		//long sigh...
		function propEval(p){
			var s = scope.properties;
			var c = {screenColor: s.screenColor ,screenOpacity: s.screenOpacity,
				borderShow: s.borderShow, borderCol: s.borderCol,
			nextLabel: s.nextLabel,nextEndLabel: s.nextEndLabel,prevLabel: s.prevLabel,showButtons: s.showButtons,
			showPrev: s.showPrev,exitButtonText: s.exitButtonText,exitImage: s.exitImage,showX: s.showX,
			exitOnOut: s.exitOnOut,showStepNumber: s.showStepNumber,onPageStart: s.onPageStart,
			goTo: function(step){},
			clearAll: function(){}};

			if(typeof p.screenColor === 'string')
				c.screenColor = p.screenColor;
			if(!isNaN(p.screenOpacity) && p.screenOpacity <= 1 && p.screenOpacity >= 0)
				c.screenOpacity = p.screenOpacity;
			if(typeof p.nextLabel === 'string')
				c.nextLabel = p.nextLabel;
			if(typeof p.nextEndLabel === 'string')
				c.nextEndLabel = p.nextEndLabel;
			if(typeof p.prevLabel  === 'string')
				c.prevLabel = p.prevLabel;
			if(typeof p.showButtons === 'boolean')
				c.showButtons = p.showButtons;
			if(typeof p.showPrev === 'boolean')
				c.showPrev = p.showPrev;
			if(typeof p.exitImage === 'string')
				c.exitImage = p.exitImage;
			if(typeof p.exitButtonText === 'string')
				c.exitButtonText = p.exitButtonText;
			if(typeof p.showX === 'boolean')
				c.showX = p.showX;
			if(typeof p.borderShow === 'boolean')
				c.borderShow = p.borderShow;
			if(typeof p.borderCol === 'string')
				c.borderCol = p.borderCol;
			if(typeof p.exitOnOut === 'boolean')
				c.exitOnOut = p.exitOnOut;
			if(typeof p.showStepNumber === 'boolean')
				c.showStepNumber = p.showStepNumber;
			if(typeof p.onPageStart === 'boolean')
				c.onPageStart = p.onPageStart;
			if(typeof p.clearAll === 'function')
				c.clearAll = p.clearAll;

			return c;
		}
		function cardPropEval(p){
			console.log("CARDPROP EVAL");
			var c = {relativeToOrderedElement: true,appearsBelow: false,
				position: null,margin: 10,show: true,className: "tour_texts",
				goToNext: function(){scope.goToNext();},
				goToPrev: function(){scope.goToPrev();}
			};

			if(typeof p.relativeToOrderedElement === 'boolean')
				c.relativeToOrderedElement = p.relativeToOrderedElement;
			if(typeof p.appearsBelow === 'boolean')
				c.appearsBelow = p.appearsBelow;
			if(p.position === 'object' || (p.position !== undefined && p.position.toLower() === "center"))
				c.position = p.position;
			if(typeof p.margin === 'number')
				c.margin = p.margin;
			if(typeof p.show === 'boolean')
				c.show = p.show;
			if(typeof p.className === 'string')
				c.className = p.className;
			if(typeof p.goToNext === 'function')
				c.goToNext = p.goToNext;
			if(typeof p.goToPrev === 'function')
				c.goToPrev = p.goToPrev;

			return c;
		}

		function clear(){
			$("#tour_house_overlay").fadeOut();
			document.body.removeChild(document.body.firstChild);
			document.body.removeChild(document.body.firstChild);
		}

		//check if x val is less than minx and greater than maxx
		function xIsFine(x, minx, maxx){
			var isFine = false;
			if(x < minx || x > maxx)
				isFine = true;
			return isFine;
		}
		function yIsFine(y, miny, maxy){
			var isFine = false;
			if(y < miny || y > maxy)
				isFine = true;
			return isFine;
		}

		var wasDown = false;
		function canvasDown(){
			wasDown = true;
		}

		function canvasUp(e){
			if(!wasDown || !scope.properties.exitOnOut) return 1;

			var xMin, xMax, yMin, yMax;
			var nButt = (next !== undefined) ? next.getBoundingClientRect() : undefined;
			var pButt = (prev !== undefined) ? prev.getBoundingClientRect() : undefined;

			var sd = deck[currentStep].elements;
			if(singleElement(sd)){
				var pBox = sd.getBoundingClientRect();
				xMin = pBox.left;
				xMax = pBox.right;
				yMin = pBox.top + $(window).scrollTop();
				yMax = pBox.bottom + $(window).scrollTop();

				if(xIsFine(e.clientX+document.body.scrollLeft, xMin, xMax) || yIsFine(e.clientY+document.body.scrollTop, yMin, yMax))
					if( (nButt !== undefined && (xIsFine(e.clientX+document.body.scrollLeft, nButt.left, nButt.right)
						|| yIsFine(e.clientY+document.body.scrollTop, nButt.top+ $(window).scrollTop(), nButt.bottom+ $(window).scrollTop())) ) && 
						(pButt !== undefined &&  (xIsFine(e.clientX+document.body.scrollLeft, pButt.left, pButt.right) 
						|| yIsFine(e.clientY+document.body.scrollTop, pButt.top+ $(window).scrollTop(), pButt.bottom+ $(window).scrollTop())) ) )
						scope.stop();
			} else{
				var count = 0;
				for (var i = sd.length - 1; i >= 0; i--) {
					var pBox = sd[i].getBoundingClientRect();
						xMin = pBox.left;
						xMax = pBox.right;
						yMin = pBox.top + $(window).scrollTop();
						yMax = pBox.bottom + $(window).scrollTop();

					if(xIsFine(e.clientX+document.body.scrollLeft, xMin, xMax) || yIsFine(e.clientY+document.body.scrollTop, yMin, yMax))
						count++;
				}
				if(count === sd.length)
					scope.stop();
			}
			wasDown = false;
		}

		function keyPresses(e){
			switch(e.keyCode){
				case 37: deck[currentStep].textProp.goToPrev();
					break;
				case 39: deck[currentStep].textProp.goToNext();
					break;
				case 27: clear(); 
					scope.stop();
					break;
				default: console.log(e);
			};
		}

		this.push = function(element, text, properties){
			var a = new card(element, text);
			if(typeof properties === 'object'){
				var m = cardPropEval(properties);
				a.textProp = m;
			}

			a.position = currentSize++;
			deck.push(a);
		};

		this.goToNext = function(){
			if(currentStep+1 >= currentSize){
				console.log("must stop");
				clear();
				scope.stop();
				return 1;
			}
			clear();
			currentStep++;
			applyStyles();
		};

		this.goToPrev = function(){
			if(currentStep-1 >= 0){
				clear();
				currentStep--;
				applyStyles();
			}
		};

		this.start = function(){
			applyStyles();
			if(scope.properties.exitOnOut){
				document.addEventListener('mousedown', canvasDown);
				document.addEventListener('mouseup', canvasUp);
			}
			document.addEventListener('keydown', keyPresses);
		}

		this.stop = function(){
			document.removeEventListener('keydown', keyPresses);
			if(scope.properties.exitOnOut){
				document.removeEventListener('onmousedown', canvasDown);
				document.removeEventListener('onmouseup', canvasUp);
			}
			if(scope.properties.showButtons){
				document.getElementById("tour_house_next_button").removeEventListener("click", deck[currentStep].textProp.goToNext());
				if(scope.properties.showPrev && currentStep > 0)
					document.getElementById("tour_house_prev_button").removeEventListener("click", deck[currentStep].textProp.goToPrev());
				if(scope.properties.showX)
					document.getElementById("tour_house_exit_button").removeEventListener("click", scope.stop);
			}
		}

		return scope;
	}

