var TourHouse = function(elements, texts){
	var scope = (!(this instanceof TourHouse)) ? new TourHouse : this;
	console.log(scope);
	var overlay = document.createElement("div");
		overlay.id ="tour_house_overlay";
	var deckBox = document.createElement("div");
		deckBox.id = "tour_house_wrapper";
		overlay.appendChild(deckBox);

	var currentStep = 0;

	var DATA = {
		AUTHOUR: "Nadia S.C.",
		VERSION: "0.3.1",
		LATEST: "19 June, 2015"
	};

	var deck = [];

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

	function applyScreen(){
		var curCard = deck[currentStep];
		//cloning elements above overlay
		if(singleElement(curCard)){
			var copy = curCard.elements.cloneNode(true);
			deckBox.appendChild(copy);
		}
		else{
			for (var i = curCard.elements.length - 1; i >= 0; i--) {
				var copy = curCard.elements[i].cloneNode(true);
				deckBox.appendChild(copy);
			}
		}
	}

	function clear(){
		$("tour_house_wrapper").remove();
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

	this.start = function(){
		if(currentSize !== 0){
			applyScreen();
		}
		else
			console.warn("Must push content before starting!");
	};

	this.goToNext = function(){
		if(currentStep+1 < currentSize)
			currentStep++;

		//clear
		applyScreen();
	};
	
	this.push = function(element, text, properties){
		var a = new card(element, text);
		console.log(typeof properties)
		if(typeof properties === 'object'){
			var m = deepCardExchange(properties);
			a.textProp = m;
		}
		a.position = currentSize++;
		deck.push(a);
	};

};