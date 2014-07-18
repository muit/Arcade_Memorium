var CardSystem = {
	cardTypes: [],

	cards: [],

	reset: function(){
		this.cards = [];

		for(var i = 0, len = 16/2; i < len; i++){
			this.cards.push(new this.Card(i, false));
			this.cards.push(new this.Card(i, false));
		}
		this.cards = Util.shuffle(this.cards);

		for(var i = 0, len = this.cards.length; i < len; i++){
			var url = "img/"+this.cards[i].type+".jpg";
			Util.getClass("face back")[i].style.background = 'url('+url+')';
			Util.getClass("face back")[i].style.backgroundSize = '64px 96px';
		}

		console.log("Cartas generadas.");
	},

	flipCardId: function(i){
		this.cards[i].flip();
	},
	flipCardObj: function(card){
		for(var i = 0, len = this.cards.length; i < len; i++)
			if(this.cards[i] == card)
				this.cards[i].flip();
	},
	updateFlippedClass: function(i){
		if($("#c_"+i).hasClass("flipped"))
			$("#c_"+i).removeClass('flipped');
		else
			$("#c_"+i).addClass('flipped');
	},
	setFlippedClass: function(i, state){
		if(!state)
			$("#c_"+i).removeClass('flipped');
		else
			$("#c_"+i).addClass('flipped');
	},
	flipAllCards: function(){
		for(var i = 0, len = this.cards.length; i < len; i++){
			this.cards[i].show = false;
			$("#c_"+i).removeClass('flipped');
		}
	},
	flipAllCardsExcept: function(cards){
		for(var i = 0, len = this.cards.length; i < len; i++){
			if(!$.inArray(this.cards[i], cards)){
				this.cards[i].show = false;
				$("#c_"+i).removeClass('flipped');
			}
		}
	},

	getCard: function(i){
		return this.cards[i];
	},
	getSimilarCard: function(card){
		for(var i = 0, len = this.cards.length; i < len; i++)
			if(this.cards[i].type == card.type && this.cards[i] != card)
				return this.cards[i];
		return null;
	},

	allCardsAreFliped: function(){
		for(var i = 0, len = this.cards.length; i < len; i++)
			if(!this.cards[i].show) 
				return false;
		return true;
	},
	cardsFliped: function(){
		var e = 0;
		for(var i = 0, len = this.cards.length; i < len; i++)
			if(this.cards[i].show) 
				e++;
		return e;
	},
	//Type: 0(NOTHING) 1 2 3 4 5 6 7 8
	Card: function(type_value, state_value){
		this.type = type_value;
		this.show = state_value;
		this.flip = function(){
			this.show = !this.show;
		}
	},
}

var Mechanics = {
	turn: false,
	showingCard1: undefined,
	showingCard2: undefined,

	reset: function(){
		CardSystem.reset();
		this.turn = false;
	},
	showCard: function(i){
		var card = CardSystem.getCard(i);

		if(card.show || (this.showedCard1 != undefined && this.showingCard2 != undefined))
			return;

		if(!this.turn){
			CardSystem.flipCardId(i);
			CardSystem.updateFlippedClass(i);

			this.showingCard1 = card;

			this.turn = true;
		}
		else if(this.turn){
			CardSystem.setFlippedClass(i, true);
			this.showingCard2 = card;
			CardSystem.flipCardId(i);

			if(this.showingCard1.type != this.showingCard2.type){

				var _self = this;
				setTimeout(function(){
					CardSystem.flipAllCards();
				}, 1000 );

				this.turn = false;
				this.showingCard1 = undefined;
				this.showingCard2 = undefined;
			}
			else{
				this.turn = false;
				this.showingCard1 = undefined;
				this.showingCard2 = undefined;
			}

			if(CardSystem.allCardsAreFliped()){
				this.win();
				return;
			}
		}
	},

	win: function(){
		alert("Arcade Memorium: Complete!");
		setTimeout(function(){
			CardSystem.flipAllCards();
			this.reset();
		}, 5000 );
	}
}

var Util = {
	getRandom: function(min, max){
		return Math.floor(Math.random() * max) + min;
	},

	shuffle: function(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	},

	getId: function(id){
		return document.getElementById(id);
	},
	getClass: function(clas){
		return document.getElementsByClassName(clas);
	}
}