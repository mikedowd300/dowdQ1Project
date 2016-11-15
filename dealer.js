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
    if (this.cards[1].value === 'ACE'){
      return true;
    }
    return false;
  };
  this.getValuHi = function() {
    var sum = 0;
    var aceFound = false;
    for(var i = 0; i < this.cards.length; i++){
      if(this.cards[i].value === 'ACE' && aceFound){
        sum += 1;
      }else if(this.cards[i].value === 'ACE'){
        sum += 11;
      }else if(this.cards[i].value === 'JACK' || this.cards[i].value === 'QUEEN'|| this.cards[i].value === 'KING'){
        sum += 10;
      }else {
        sum += parseInt(this.cards[i].value);
      }
    }
    return sum;
  };
  this.getSumOfDecisions = function() {
    var sum = 0;
    for(var i = 0; i < playerRay.length ; i++){
      sum += playerRay[i].needsToDecideOnInsurance;
    }
    return sum;
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
    this.getValuLo();// dont hink i need these anymore
    this.getValuHi();// dont hink i need these anymore
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
  this.doInsurance = function(){
    if(this.checkForAce()) {
      $('.modal-insurance').fadeIn(800);
      $('.get-insurance, .skip-insurance').fadeIn(500);
      for(var i = 0; i < playerRay.length; i++) {
        playerRay[i].needsToDecideOnInsurance = 1;
      }
      $('.get-insurance, .skip-insurance').click(function() {
        console.log(dealer.getSumOfDecisions());
        if(dealer.getSumOfDecisions() === 0){

          if(dealerHasBlackJack()) {
            console.log('DEALER HAS IT');
            dealer.handOver = true;
            dealer.payInsurance();
          }
          $('.modal-insurance').hide(1500);
            dealer.doPlayOutHands(0);
        }
      });
    }
    console.log('about to do payout');
    this.doPlayOutHands(0);
  };
  this.doPlayOutHands = function(){
    console.log('doin payout', this.getSumOfDecisions());
    if(dealerHasBlackJack()) {
      this.doPayOut();
    }else if(this.getSumOfDecisions() === 0){
      $(playerRay[playerIndex].optionsDiv).fadeIn(10).css('display', 'flex');
      playerRay[playerIndex].playHand();
    }
  };
  this.finishesHand = function() {
  if(this.oponents > 0 && !dealerHasBlackJack()){
    while(this.getValuHi() < 17) {
      this.hit();
    };
    while(this.getValuHi() > 21 && this.getValuLo() < 17){
      this.hit();
    }
  }
  this.doPayOut();
};
  this.doPayOut = function() {
    for(var i = 0; i < playerRay.length; i++) {
      for(var j = 0; j < playerRay[i].hands.length; j++){
        if(dealer.isBust() && playerRay[i].hands[j].alive) {
          if(!playerRay[i].hands[j].isBusted()) {
            playerRay[i].chips += playerRay[i].hands[j].betSize;
            $(playerRay[i].chipsDiv).text('$' + playerRay[i].chips);
            playerRay[i].hands[j].alive = false;
          }
        }
        if(playerRay[i].hands[j].alive){
          if(playerRay[i].hands[j].betSize < ) {
            
          }
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
    $('.modal-play-options').hide(100);
    $('.increase-bet, .decrease-bet').fadeIn(1700);
    doShuffle();
    doReWriteBetSize();
  }
}
