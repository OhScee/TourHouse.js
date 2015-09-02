var TourHouse = function(){
	var scope = (!(this instanceof TourHouse)) ? new TourHouse : this;
	console.log(scope);
	if(typeof pr === 'object'){
		var m = propertyEval(pr);
		// a.textProp = m;
	}

	var DATA = {
		AUTHOUR: "Nadia S.C.",
		VERSION: "0.2",
		LATEST: "19 June, 2015"
	};

	var canvas, //screen
		parent;	//last element of importance

	var deckbox = document.createElement('div'); //wrapper for all texts and buttons
		deckbox.id = "tour_house_wrapper";

	var deck = [];

	var currentStep = 0;
	var currentSize = 0;

	var card = function(els, txt){
		var self = this;
		this.items = els;
		this.texts = txt;
		this.textProp = {
			relativeToOrderedElement: true,
			appearsBelow: false,
			position: null,
			margin: 10,
			show: true,
			className: "tour_texts"
		};
		this.step = currentSize++;
	};

	function addText(txt, element){
		var txtProp = deck[currentStep].textProp;

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

	function draw(context, el){
		var shape = el.getBoundingClientRect();
		var w = shape.width,
			h = shape.height,
			x = shape.left,
			y = shape.top;
		var radius = getComputedStyle(el).borderRadius; //this assumes all corners have the same radius
		radius = radius.replace('px', '');
		radius++;

		if(radius !== ' ' || radius !== null){
			context.lineJoin = "round";
			context.lineWidth = radius;

			//make rectangle with rounded corners
			context.strokeRect(x+(radius/2), y+(radius/2), 
							w - radius, h - radius);

			context.fillRect(x+(radius/2), y+(radius/2), 
							w - radius, h - radius);
		} else
			context.fillRect(shape.left,shape.top, w, h);
	}

	function singleElement(sdeck){
		if(sdeck.length === undefined)
			return true;
		else
			return false;
		}

	function textPropEval(p){
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

	function propEval(p){
		var c = {screenColor: "#000000",screenOpacity: 0.5,nextLabel: "Next",
				prevLable: "Prev",showButtons: true,showPrev: true,
				exitButton: "Xit.png",showX: true,exitOnOut: true, //exit when clicking outside of special elements
				showStepNumber: false,onPageStart: true};


	}

	//public API
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
		onPageStart: true
	};

	TourHouse.prototype.changeDefaultProperties = function(new_prop) {
		scope.properties = propertyEval(new_prop);
	};
}





