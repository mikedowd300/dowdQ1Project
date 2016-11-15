function playerObj(avatar, div) {
  this.avatar = avatar;
  this.chips = 98;
  this.betSize = 2;
  this.hands = [];
  this.insuranceBet = 0;
  this.needsToDecideOnInsurance = 0; //Not set to false because they are added up
  this.div = div;
  this.activeHand = 0;
  // this.chipsDiv = '';
  // this.betDiv = '';
  // this.showInsuranceBetH1 = '';
  // this.modalInsuranceDiv = '';
  // this.getInsuranceButton = '';
  // this.skipInsuranceButton = '';
  // this.optionsDiv = '';
  // this.hitButton  = '';
  // this.stayButton = '';
  // this.doubleButton = '';
  // this.splitButton = '';
  // this.incrementButton = '';
  // this.decrementButton = '';
  // this.doubleAble = true;
  // this.splitAble = false;
  this.increaseBet = function() {
    if(this.betSize < 50 && this.chips >= 2) {
      this.betSize += 2;
      this.chips -= 2;
    } else if(this.betSize < 50) {
      this.betSize += this.chips;
      this.chips = 0;
    } else if(this.betSize >= 50 && this.chips >= 10){
      this.betSize += 10;
      this.chips -= 10;
    } else if(this.betSize >= 50) {
      this.betSize += this.chips;
      this.chips = 0;
    }
  };
  this.decreaseBet = function() {
    if(this.betSize >= 50){
      this.betSize -= 10;
      this.chips += 10;
    }else if(this.betSize >= 2){
      this.betSize -= 2;
      this.chips += 2
    } else if(this.betSize > 0) {
      this.chips = this.betSize;
      this.betSize = 0;
    }
  };
  this.getInsurance = function() {
    $(this.showInsuranceBetH1).fadeIn(500);
    $(this.getInsuranceButton).fadeOut(250);
    $(this.skipInsuranceButton).fadeOut(250);
    this.needsToDecideOnInsurance = 0;
    if((this.betSize / 2) <= this.chips){
      this.insuranceBet = this.betSize / 2;
    } else {
      this.insuranceBet = this.chips;
    }
    this.chips -= this.insuranceBet;
    $(this.showInsuranceBetH1).text('$' + this.insuranceBet);
    $(this.chipsDiv).text('$' + this.chips);
  };
  this.skipInsurance = function() {
    $(this.modalInsuranceDiv).fadeOut(400);
    this.needsToDecideOnInsurance = 0;
  };
  this.playHand = function() {
    for(var i = 0; i < this.hands.length; i++) {
      this.activeHand = i;
      if(this.hands[i].hasBlackJack()) {
        this.hands[i].stay = true;
        this.hands[i].alive = false;
        if(!dealer.hasBlackJack()){
          this.chips += (this.hands[i].betSize * 1.5);
          $(this.chipsDiv).text('$' + this.chips);
        }
        checkIndexPlayHand(1);
      }
      if(this.hands[i].cards.length === 1) {
        var card = deckRay.pop();
        this.hands[i].cards.push(card);
        var newImg = $('<img class="plyr-crd-img" src="' + card.image + '">');
        playerRay[i].div.children('.card-container')[0].append(newImg[0]);
        console.log('this was the split hand');
      }
      if(this.hands[i].isDoubleAble() && !this.hands[i].stay) {
         $(this.doubleButton).fadeIn(600);
      }
      if(!this.hands[i].stay) {
        $(this.stayButton).fadeIn(600);
      }
      if(this.hands[i].isSplitAble()){
        $(this.splitButton).fadeIn(200);
      }
      if(!this.hands[i].stay && this.hands[i].getValuHi() < 21 && this.hands[i].getValuLo() < 21){
        $(this.hitButton).fadeIn(200);
      }
    }
  };
  this.resetValues = function() {
    if(dealer.handOver) {
      this.hands = [];
      this.deal = false;
      this.insuranceBet = 0;
      this.needsToDecideOnInsurance = 0; //Not set to false because they are added up
      this.showInsuranceBetH1 = '';
      //this.doubleAble = true;
      //this.splitAble = false;
      if(this.chips < 0) {
        this.betSize += this.chips;
        this.chips = 0;
        $(this.chipsDiv).text('$' + this.chips);
      }
    }
  };
  this.insult = function() {
    var insult;
    $($(this.div.children('.insult'))[0]).remove()
    var url = 'https://galvanize-cors-proxy.herokuapp.com/quandyfactory.com/insult/json';
    $.get(url, function(dat) {
      insultRay.push(dat.insult);
    });
    $(this.div).append('<div class="insult"><h2> Bitch, ' + insultRay.pop() + '</h2></div>');
    console.log($(this.div.children('.insult'))[0]);
    $($(this.div.children('.insult'))[0]).fadeIn(120).delay(3000).fadeOut(1500);
  };
}
