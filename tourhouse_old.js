//JQUERY DEPENDENT 
var TourHouse = function(elements, text){
	var scope = (!(this instanceof TourHouse)) ? new TourHouse : this;

	var canvas; //screen
	var parent; //last element of importance

	var deckBox = document.createElement('div'); //wrapper for all the text elements
		deckBox.id = "tour_house_wrapper";

	var currentStep = 0;
	var DATA = {
		AUTHOUR: "Nadia S.canvas.",
		VERSION: "0.3.1",
		LATEST: "19 June, 2015"
	};

	//create instances of each step with the following properties
	var currentSize = 0;
	var card = function(element, text){
		var self = this;
			this.elements = element;
			this.texts = text;
			this.textProp = {
				relativeToOrderedElement: true,
				appearsBelow: false,
				position: null, //if above is false, where to position the text div
				margin: 10,
				show: true,
				className: "tour_texts"
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
			var trueShape = el.getBoundingClientRect();
			var w = trueShape.width,
				h = trueShape.height,
				x = trueShape.left,
				y = trueShape.top,
				radius = getComputedStyle(el).borderRadius; //this assumes all corners have the same radius
				radius = radius.replace('px', '');
				radius++;

			if(radius !== '' || radius !== null){
				ctx.lineJoin = "round";
				ctx.lineWidth = radius;

				//make rectangle with rounded corners
				ctx.strokeRect(x+(radius/2), y+(radius/2), 
								w - radius, h - radius);

				ctx.fillRect(x+(radius/2), y+(radius/2), 
								w - radius, h - radius);
			}
			else
				ctx.fillRect(trueShape.left, trueShape.top, w, h);
		}

		function addText(txt, element){
			var txtProp = scope.deck[currentStep].textProp;

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
			var textBox = container.getBoundingClientRect(), //get styles
			    elBox = element.getBoundingClientRect();

			console.log(txtProp.appearsBelow);
		//if the position is relative to the element
			if(txtProp.relativeToOrderedElement){
				//if above element
				if(!txtProp.appearsBelow && txtProp.position === null){
					console.log("ABOVE");
					var totalY =  elBox.top - txtProp.margin - textBox.height;
					//check to make sure textbox does not go beyond top of page
					if(totalY < 0)
						console.warn('text element containing: ' ,txt, 'goes beyond the visible page. Please change appearsBelow to true');
					else{
						container.style.left = elBox.left + "px";
						container.style.top = totalY + "px";
					}
				}
				//if below element
				else if(txtProp.appearsBelow && txtProp.position === null){
					var totalY =  (elBox.top+elBox.height) + txtProp.margin + textBox.height;

					//check to make sure textbox does not go beyond top of page
					if(totalY > $(window).height())
						console.warn('text element containing: ' ,txt, 'goes beyond the visible page. Please change appearsBelow to false');
					else{
						container.style.left = elBox.left + "px";
						container.style.top = ((elBox.top+elBox.height) + txtProp.margin) + "px";
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
			console.log(deckBox);
		}

		//prepend the screen and set the style for all necessary elements
		function applyStyles(){
			var old_p = document.body.firstChild;

			//get full rectangle for element
			var j = currentStep;
			var sdeck = scope.deck[j];
			var isSingleElement = singleElement(sdeck.elements);

			// if(isSingleElement){
			// 	parent = sdeck.elements;
			// }
			// else{	
			// 	//check how far down each element goes
			// }

			//canvas element style
			//new canvas element
			canvas = document.createElement('canvas');
			canvas.height = $(window).height();
			canvas.width = $(window).width();
			canvas.style.opacity = scope.properties.screenOpacity;
			canvas.style.position = "absolute";

			//inserting canvas on screen
			document.body.insertBefore(canvas,document.body.firstChild);
			parent = document.body.firstChild;

			var context = canvas.getContext("2d");
			//screen
			context.fillStyle = scope.properties.screenColor;
			context.fillRect(0, 0, canvas.width, canvas.height);

			//holes
			context.fillStyle = scope.properties.screenColor;
			context.fillRect(0,0,canvas.width,canvas.height);

			//preparing to cut
			context.globalCompositeOperation = 'destination-out';
			context.fillStyle = 'rgba(0, 0, 0, 1)';

			//the cutting of elements
			if(isSingleElement){ //only one element
				draw(context, sdeck.elements);
			}
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

			document.body.insertBefore(deckBox, parent);
			//if buttons are disabled don't even bother...
			if(!scope.properties.showButtons) return 1;

			// here's the lay

		}

		function deepCardExchange(p){
			var c = {relativeToOrderedElement: true,appearsBelow: false,
				position: null,margin: 10,show: true,className: "tour_texts"};

			console.log("TRIGGERED");

			if(typeof p.relativeToOrderedElement === 'boolean')
				c.relativeToOrderedElement = p.relativeToOrderedElement;
			if(typeof p.appearsBelow === 'boolean')
				c.appearsBelow = p.appearsBelow;
			if(p.position === 'object' || (p.position !== undefined &&p.position.toLower() === "center"))
				c.position = p.position;
			if(typeof p.margin === 'number')
				c.margin = p.margin;
			if(typeof p.show === 'boolean')
				c.show = p.show;
			if(typeof p.className === 'string')
				c.className = p.className;

			return c;
		}

		function clear(){

		}

		//API

		this.progress = 0;
		this.deck = [];

		this.properties = {
			screenColor: "#000000",
			screenOpacity: 0.5,
			nextLabel: "Next",
			prevLable: "Prev",
			showButtons: true,
			showPrev: true,
			exitButton: "Xit.png",
			showX: true,
			exitOnOut: true, //exit when clicking outside of special elements
			showStepNumber: false,
			onPageStart: true,
			goTo: function(step){
				//step validation
				//goToStep
			},
			goToNext: function(){
				
			},
			goToPrev: function(){

			},
			clearAll: function(){
				//will call stop()
			}
		};

		this.push = function(element, text, properties){
			var l = element.length;
			var a = new card(element, text);
			var m;
			console.log(typeof properties)
			if(typeof properties === 'object'){
				m = deepCardExchange(properties);
				a.textProp = m;
			}

			a.position = currentSize++;
			scope.deck.push(a);
		};

		this.goToNext = function(){
			//clear current
			if(currentStep+1 >= currentSize){
				scope.stop();
				return 1;
			}
			//clear()
			currentStep++;
			applyStyles();
		};

		this.start = function(){
			applyStyles();
		}

		$(window).resize(applyStyles);

		return scope;
	}
})(window)

