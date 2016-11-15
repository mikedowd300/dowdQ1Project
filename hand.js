function handObj() {
  var obj = {
    cards: [],
    stayButton: '',
    stay: false, //maybe get rid of this
    alive: true,
    betSize: 0,
    doubledBet: 0;//sometimes player doubles for less
    //hasAce: false,
    //busts: false,
    //displayButtons: false,
    //doubleAble: false,
    //splitAble: false,
    //valuLo: 0,
    //hasBlackJack: false,
    //valuHi: 0,
    // run: function() {
    //   this.getValuHi();
    //   this.getValuLo();
    //   this.doHasBlackJack();
    // },
    getValuHi: function() {
      var sum = 0;
      for(var i = 0; i < this.cards.length; i++){
        if(this.cards[i].value === 'ACE'){
          sum += 11;
        }else if(this.cards[i].value === 'JACK' || this.cards[i].value === 'QUEEN'|| this.cards[i].value === 'KING'){
          sum += 10;
        }else {
          sum += parseInt(this.cards[i].value);
        }
      }
      return sum;
    },
    getValuLo: function() {
      var sum = 0;
      for(var i = 0; i < this.cards.length; i++){
        if(this.cards[i].value === 'ACE'){
          sum += 1;
        }else if(this.cards[i].value === 'JACK' || this.cards[i].value === 'QUEEN'|| this.cards[i].value === 'KING'){
          sum += 10;
        }else {
          sum += parseInt(this.cards[i].value);
        }
      }
      return sum;
    },
    getValue: function() {
      if(this.getValuHi() > 21){
        return this.getValuLo();
      }
      return this.getValuHi();
    },
    hasBlackJack: function() {
      if(this.getValuHi() === 21 && this.cards.length === 2) {
        return true;
      }
      return false;
    },
    isDoubleAble: function() {
      if(this.cards.length === 2 && !this.hasBlackJack()){
        return true;
      }
      return false;
    },
    isSplitAble: function() {
      if(this.cards.length > 2) {
        return false;
      }
      var cv1 = this.cards[0].value;
      var cv2 = this.cards[1].value;
      if(cv1 === "JACK" ||cv1 === "QUEEN" ||cv1 === "KING") {
        cv1 = '10';
      }
      if(cv2 === "JACK" ||cv2 === "QUEEN" ||cv2 === "KING") {
        cv2 = '10';
      }
      if(cv1 === cv2) {
        return true;
      }
      return false;
    },
    isBusted: function() {
      if(this.getValuLo() > 21){
        return true;
      }
      return false;
    }
  };
  return obj;
}
