'use strict'
var deckRay = [];
var avatarRay = [];
var playerRay = [];
var playerIndex = 0;
var dealer;
var cutCount = 60;
var deckID;
var insultRay = [];
var holeCardFrontImg;
var cardBackURL = 'https://s-media-cache-ak0.pinimg.com/originals/09/a5/8d/09a58d561b2a7b92bd506c83414ef1ab.png';
$.get('avatarURLs.json', function(avDB) {
  avatarRay = avDB;
});
var url = 'https://galvanize-cors-proxy.herokuapp.com/quandyfactory.com/insult/json';
$.get(url, function(dat) {
  insultRay.push(dat.insult);
});
var url = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6';
$.get(url, function(data) {
  deckID = data.deck_id;
  var dealCardURL = 'https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=' + 312;
  $.get(dealCardURL, function(datum) {
    deckRay = datum.cards;
    $('.add-player').click(function() {
      $('.start-button').hide().fadeIn(2000);
      if(playerRay.length < 7) {
        var avIndex = Math.floor(Math.random() * avatarRay.length);
        var avatar =  avatarRay[avIndex].url;
        var avGreet = avatarRay[avIndex].greeting;
        var newDiv = $($('<div class="player"></div>')[0]);
        var player = new playerObj(avatar, newDiv, avGreet);
        $('.player-container').append(newDiv);
        var appendStr =
        '<div class="modal-insurance">'
          + '<button class="get-insurance" type="button" name="button">Insurance?</button>'
          + ' <button class="skip-insurance" type="button" name="button">No Thanks</button>'
          + '<h1 class="insurance-bet">0</h1>' +
        '</div>' +
        '<div class="holder">' +
        '</div>' +
        '<div class="modal-play-options">'
          + '<button class="hit-button" type="button" name="button">HIT</button>'
          + '<button class="double-button" type="button" name="button">DOUBLE</button>'
          + '<button class="stay-button" type="button" name="button">STAY</button>'
          + '<button class="split-button" type="button" name="button">SPLIT</button>' +
        '</div>' +
        '<div class="money-container">'
          + '<div class="chips">$' + player.chips + '</div>'
          + '<div class="bet">$' + player.betSize + '</div>'
          + '<button class="decrease-bet">' + '-' + '</button>'
          + '<button class="increase-bet">' + '+' + '</button>' +
        '</div>' +
        '<div class="avatar">'
          + '<img class="av-img" src="' + player.avatar + '">'
          + '<div class="greeting"><h3>' + player.greeting + '</h3></div>'+
        '</div>';
        newDiv.append(appendStr);
        var avImgWidth = $('.av-img').css('width');
        $('.av-img').css('height', avImgWidth);
        $('.money-container').css('margin-top', '-' + avImgWidth);
        player.holderDiv = $($(player.div.children('.holder')[0])[0]);
        player.incrementButton = $(player.div.children('.money-container')[0]).children('.increase-bet')[0];
        player.decrementButton = $(player.div.children('.money-container')[0]).children('.decrease-bet')[0];
        player.chipsDiv = $($(player.div.children('.money-container')[0]).children('.chips')[0])[0];
        player.betDiv = $($(player.div.children('.money-container')[0]).children('.bet')[0])[0];
        player.getInsuranceButton = $(player.div.children('.modal-insurance')[0]).children('.get-insurance')[0];
        player.skipInsuranceButton = $(player.div.children('.modal-insurance')[0]).children('.skip-insurance')[0];
        player.showInsuranceBetH1 = $(player.div.children('.modal-insurance')[0]).children('.insurance-bet')[0];
        player.modalInsuranceDiv = player.div.children('.modal-insurance')[0];
        player.optionsDiv = $($(player.div.children('.modal-play-options'))[0]);
        player.hitButton  = $(player.optionsDiv.children('.hit-button'))[0];
        player.stayButton = $(player.optionsDiv.children('.stay-button'))[0];
        player.doubleButton = $(player.optionsDiv.children('.double-button'))[0];
        player.splitButton = $(player.optionsDiv.children('.split-button'))[0];
        $(player.skipInsuranceButton).click(function() {
          player.skipInsurance();
        });
        $(player.getInsuranceButton).click(function() {
          player.getInsurance();
        });
        $(player.incrementButton).click(function () {
          player.increaseBet();
          $(player.chipsDiv).text('$' + player.chips);
          $(player.betDiv).text('$' + player.betSize);
        });
        $(player.decrementButton).click(function () {
          player.decreaseBet();
          $(player.chipsDiv).text('$' + player.chips);
          $(player.betDiv).text('$' + player.betSize);
        });
        $(player.hitButton).click(function() {
          var nextCard = deckRay.pop();
          player.hands[0].cards.push(nextCard);
          var newImg = $('<img class="plyr-crd-img" src="' + nextCard.image + '">');
          player.holderDiv.children('.card-container')[0].append(newImg[0]);
          if(player.hands[player.activeHand].isBusted()) {
            player.insult();
            dealer.oponents -= 1;
            player.hands[player.activeHand].alive = false;
            player.chips -= player.hands[player.activeHand].betSize;
            if(player.chips < player.betSize) {
              player.betSize = player.chips;
              player.chips = 0;
            }
            $(player.chipsDiv).text('$' + player.chips);
            $(player.betDiv).text('$' + player.betSize);
            checkIndexPlayHand(1);
          } else {
            checkIndexPlayHand(0);
          }
        });
        $(player.stayButton).click(function() {
          checkIndexPlayHand(1);
        });
        $(player.doubleButton).click(function() {
          var nextCard = deckRay.pop();
          var i = player.activeHand;
          player.hands[i].cards.push(nextCard);
          var doubledBet = player.betSize;
          if(player.betSize > player.chips){
            doubledBet = player.chips;
            player.chips = 0;
          } else {
            player.chips -= doubledBet;
          }
          player.hands[i].doubledBet = doubledBet;
          doubledBet = doubledBet + player.betSize;
          $(player.chipsDiv).text('$' + player.chips);
          $(player.betDiv).text('$' + doubledBet);
          var newImg = $('<img class="plyr-crd-img" src="' + nextCard.image + '">');
          player.holderDiv.children('.card-container')[0].append(newImg[0]);
          if(player.hands[i].isBusted()) {
            player.insult();
            dealer.oponents -= 1;
            player.hands[i].alive = false;
            player.chips -= player.hands[i].betSize;
            if(player.chips < player.betSize) {
              player.betSize = player.chips;
              player.chips = 0;
            }
            $(player.chipsDiv).text('$' + player.chips);
            $(player.betDiv).text('$' + player.betSize);
          }
          checkIndexPlayHand(1);
        });
        $(player.splitButton).click(function() {
          var i = player.activeHand;
          var hand = new handObj();
          dealer.oponents += 1;
          var card = player.hands[i].cards.pop()
          hand.cards.push(card);
          player.hands.push(hand);
          hand.betSize = player.betSize;
          if(player.chips < player.betSize) {
            hand.betSize = player.chips;
            player.chips = 0;
          }
          var card2 = deckRay.pop();
          var newImg = $('<img class="plyr-crd-img" src="' + card2.image + '">');
          player.holderDiv.children('.card-container')[i].append(newImg[0]);
          var removeImage = $(newImg[0]).prev();
          $(removeImage[0]).remove();
          player.hands[i].cards.push(card2);
          $(player.holderDiv).append('<div class="card-container"><img class="plyr-crd-img" src="' + card.image +'"></div>');
          checkIndexPlayHand(0);
        });
        playerRay.push(player);
      }
    });
  });// end of deal get
});

$('.start-button').click(function() {
  $('.greeting').fadeOut(300);
  $('.modal-start-page-bottom').hide(500);
  $('.modal-start-page-top').hide(500);
  $('.modal-deal-button').fadeIn(700);
  $('.greeting').fadeOut(1000);
  $('.transform-wrapper').css('margin', '0 auto');
  $('.transform-wrapper').css('transform', 'rotateX(45deg)');
  $('.transform-wrapper').css('width', '70%');
  $('.dealer-container').css('height', '50vh');
  $('.player-container').css('height', '50vh');
  $('.player').css('justify-content', 'flex-end');;
  $('.money-container').fadeIn(2000);
  $('.avatar, .av-img').css('border-radius', '50%').css('width', '90%');
  $('.player').css('background-color', '#74f442').css('margin-top', '0');
  $('.modal-play-options').fadeOut(1500);
  $('.bet').css('animation', 'blink .6s infinite');
});

$('.modal-deal-button').click(function() {
  $('.bet').css('animation', 'blink .6s none');
  $('.card-container').remove();
  $('.dealer-container').html('');
  $('.modal-deal-button').hide(700);
  $('.increase-bet, .decrease-bet').hide(400);
  dealer = new dealerObj();
  dealer.oponents = playerRay.length;
  for(var i = 0; i < playerRay.length; i++) {
    var newHandObj = handObj();
    newHandObj.betSize = playerRay[i].betSize;
    playerRay[i].hands.push(newHandObj);
    playerRay[i].holderDiv.append('<div class="card-container"></div>');
    for(var j = 0; j < 2; j++){
      var nextCard = deckRay.pop();
      playerRay[i].hands[0].cards.push(nextCard);
      var newImg = $('<img class="plyr-crd-img" src="' + nextCard.image + '">');
      playerRay[i].holderDiv.children('.card-container')[0].append(newImg[0]);
    }
  }
  dealer.cards.push(deckRay.pop());
  dealer.holeCard = dealer.cards[0];
  dealer.cards.push(deckRay.pop());
  dealer.checkForAce();
  $('.dealer-container').append('<div class="holecard dealer-card"><img id="h-card" src="' + cardBackURL + '"></div>');
  $('.dealer-container').append('<div class="dealer-card"><img id="d-card" src="' + dealer.cards[1].image + '"></div>');
  holeCardFrontImg = dealer.cards[0].image;
  dealer.getValuHi();
  dealer.getValuLo();
  dealer.doInsurance();
});

function checkIndexPlayHand(increment) {
  $(playerRay[playerIndex].hitButton).fadeOut(400);
  $(playerRay[playerIndex].stayButton).fadeOut(400);
  $(playerRay[playerIndex].doubleButton).fadeOut(400);
  $(playerRay[playerIndex].splitButton).fadeOut(400);

  if(playerIndex + increment < playerRay.length) {
    playerIndex += increment;
    dealer.doPlayOutHands(playerIndex);
  } else {
    playerIndex = 0;
    dealer.finishesHand();
  }
}

function doShuffle() {
  if(deckRay.length < cutCount) {
    console.log('SHUFFLE TIME!!!');
    $.get('https://deckofcardsapi.com/api/deck/' + deckID + '/shuffle/', function(data) {
      console.log(data);
      deckID = data.deck_id;
      var dealCardURL = 'https://deckofcardsapi.com/api/deck/' + deckID + '/draw/?count=' + 312;
      $.get(dealCardURL, function(datum) {
        deckRay = datum.cards;
      });
    });
  }
}

function getSumOfDecisions() {
  var sum = 0;
  for(var i = 0; i < playerRay.length ; i++){
    sum += playerRay[i].needsToDecideOnInsurance;
  }
  return sum;
}

function dealerHasBlackJack() {
  if(dealer.cards.length === 2 && dealer.getValuHi() === 21){
    return true;
  }
  return false;
};

function doReWriteBetSize() {
  for(var i = 0; i < playerRay.length; i++) {
    $(playerRay[i].betDiv).text('$' + playerRay[i].betSize);
  }
}
