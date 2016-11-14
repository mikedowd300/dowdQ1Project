function playerObj(avatar, div) {
  this.avatar = avatar;
  this.chips = 98;
  this.betSize = 2;
  this.hands = [];
  this.deal = false;
  this.doubleAble = true;
  this.splitAble = false;
  this.insuranceBet = 0;
  this.needsToDecideOnInsurance = 0; //Not set to false because they are added up
  this.div = div;
  this.chipsDiv = '';
  this.betDiv = '';
  this.showInsuranceBetH1 = '';
  this.modalInsuranceDiv = '';
  this.getInsuranceButton = '';
  this.skipInsuranceButton = '';
  this.optionsDiv = '';
  this.hitButton  = '';
  this.stayButton = '';
  this.doubleButton = '';
  this.splitButton = '';
  this.incrementButton = '';
  this.decrementButton = '';
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
      var myHand = this.hands[i];
      var loopCount = 0;
      //while(!myHand.stay && loopCount < 20 ) {
        if(myHand.doHasBlackJack()) {
          myHand.stay = true;
          myHand.alive = false;
          if(!dealer.hasBlackJack){
            this.chips += (myHand.betSize * 1.5);
            $(this.chipsDiv).text('$' + this.chips);
          }
          checkIndexPlayHand();
        }
        if(myHand.isDoubleAble() && !myHand.stay) {
           $(this.doubleButton).fadeIn(600);
        }
        if(!myHand.stay) {
          $(this.stayButton).fadeIn(600);
        }
        if(myHand.isSplitAble()){
          $(this.splitButton).fadeIn(200);
        }
        if(!myHand.stay && myHand.getValuHi() < 21 && myHand.getValuLo() < 21){
          $(this.hitButton).fadeIn(200);
        }
      //}
      // $(this.doubleButton).hide(300);
      // $(this.hitButton).hide(300);
      // $(this.splitButton).hide(300);
      // $(this.stayButton).hide(300);
      // $(this.optionsDiv).hide(300);
      //loopCount++;
    }
  };
  // this.split = function() {
  //
  // };
  // this.doubleDown = function() {
  //
  // };
  // this.hit = function() {
  //
  // };
  // this.resetValues = function() {
  //   if(dealer.handOver) {//insurance
  //     this.hands = [];
  //     this.deal = false;
  //     this.insuranceBet = 0;
  //     this.needsToDecideOnInsurance = 0; //Not set to false because they are added up
  //     this.showInsuranceBetH1 = '';
  //     this.doubleAble = true;
  //     this.splitAble = false;
  //     if(this.chips < 0) {
  //       this.betSize += this.chips;
  //       this.chips = 0;
  //     }
  //   }
  // }
}
