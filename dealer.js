function dealerObj() {
  this.holeCard = '';
  this.cards = [];
  //this.hasAce = false;
  //this.valuHi = 0;
  //this.valuLo = 0;
  //this.value = 0;
  //this.hasBlackJack = false;
  //this.busts = false;
  //this.mustFinish = false;
  //this.hasAceShowing = false;
  this.handOver = false;
  this.oponents = 0;
  this.checkForAce = function() {
    if (cards[1].value === 'ACE'){
      return = true;
    }
    return false;
  };
  this.getValuHi = function() {
    var sum = 0;
    for(var i = 0; i < this.cards.length; i++){
      var aceFound = false;
      if(this.cards[i].value === 'ACE' && aceFound){
        sum += 11;
      }else if(this.cards[i].value === 'ACE'){
        sum += 1;
      }else if(this.cards[i].value === 'JACK' || this.cards[i].value === 'QUEEN'|| this.cards[i].value === 'KING'){
        sum += 10;
      }else {
        sum += parseInt(this.cards[i].value);
      }
    }
    return sum;
  };
  this.hasBlackJack = function() {
    if(this.cards.length === 2 && this.getValuHi() === 21){
      return true;
    }
    return false;
  };
  this.getValuLo = function() {
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
  };
  this.getValue = function() {
    if(this.getValuHi() > 21){
      return this.getValuLo();
    }
    return this.getValuHi();
  };
  this.hit = function() {
    var newCard = deckRay.pop();
    $('.dealer-container').append('<div class="card"><img src="' + newCard.image + '"></div>');
    this.cards.push(newCard);
    this.getValuLo();
    this.getValuHi();
  };
  this.payInsurance = function() {
    for(var i = 0; i < playerRay.length; i++) {
      playerRay[i].chips += playerRay[i].insuranceBet * 3;
      $(playerRay[i].chipsDiv).text('$' + playerRay[i].chips);
    }
    $('.insurance-bet').fadeOut(600);
  };
  this.isBust = function() {
    if(this.getValuHi() > 21 && this.getValuLo() > 21) {
      return true;
    }
    return false;
  };
  this.doInsurance(){
    if(this.hasAceShowing()) {
      $('.modal-insurance').fadeIn(800);
      $('.get-insurance, .skip-insurance').fadeIn(500);
      for(var i = 0; i < playerRay.length; i++) {
        playerRay[i].needsToDecideOnInsurance = 1;
      }
      $('.get-insurance, .skip-insurance').click(function() {
        if(this.getSumOfDecisions() === 0){
          if(this.hasBlackJack()) {
            console.log('DEALER HAS IT');
            this.handOver = true;
            this.payInsurance();
          }
          $('.modal-insurance').hide(1500);
          this.doPlayOutHands(0);
        }
      });
    }
    this.doPlayOutHands(0);
  };
  this.getSumOfDecisions = function() {
    var sum = 0;
    for(var i = 0; i < playerRay.length ; i++){
      sum += playerRay[i].needsToDecideOnInsurance;
    }
    return sum;
  };
  this.doPlayOutHands = function(){
    if(getSumOfDecisions() === 0){
      $(playerRay[playerIndex].optionsDiv).fadeIn(10).css('display', 'flex');
      playerRay[playerIndex].playHand();
    }
  };
  this.doPayOut = function() {
    for(var i = 0; i < playerRay.length; i++) {
      console.log(playerRay[i].hands.length);
      for(var j = 0; j < playerRay[i].hands.length; j++){
        console.log('here');
        if(dealer.isBust() && playerRay[i].hands[j].alive) {
          console.log('player busted: ', !playerRay[i].hands[j].isBusted());
          if(!playerRay[i].hands[j].isBusted()) {
            playerRay[i].chips += playerRay[i].hands[j].betSize;
            $(playerRay[i].chipsDiv).text('$' + playerRay[i].chips);
            playerRay[i].hands[j].alive = false;
          }
        }
        if(playerRay[i].hands[j].alive){
          if(this.getValue() > playerRay[i].hands[j].getValue()){
            playerRay[i].chips -= playerRay[i].hands[j].betSize;
            $(playerRay[i].chipsDiv).text('$' + playerRay[i].chips);
            playerRay[i].hands[j].alive = false;
          }else if(this.getValue() < playerRay[i].hands[j].getValue()) {
            playerRay[i].chips += playerRay[i].hands[j].betSize;
            $(playerRay[i].chipsDiv).text('$' + playerRay[i].chips);
            playerRay[i].hands[j].alive = false;
          }
        }
        $(playerRay[i].chipsDiv).hide(10);
        $(playerRay[i].chipsDiv).delay((i+1)*450).fadeIn((i+1)*750);
      }
    }
    this.handOver = true;
    for(var i = 0; i < playerRay.length; i++) {
      playerRay[i].resetValues();
    }
    $('.modal-deal-button').fadeIn(1700);
    $('.card-container').fadeOut(4000);
    $('.increase-bet, .decrease-bet').fadeIn(1700);
    $('.increase-bet, .decrease-bet').click(console.log('hi'));
  }
}
