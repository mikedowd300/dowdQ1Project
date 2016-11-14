'use strict'
var deckRay = [];
var avatarRay = [];
var playerRay = [];
var playerIndex = 0;
var dealer;
var cutCount = 60;
var deckID;
$.get('avatarURLs.json', function(avDB) {
  avatarRay = avDB;
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
        var newDiv = $($('<div class="player"></div>')[0]);
        var player = new playerObj(avatar, newDiv);
        $('.player-container').append(newDiv);
        var appendStr = '<div class="modal-insurance"><button class="get-insurance" type="button" name="button">Insurance?</button><button class="skip-insurance" type="button" name="button">No Thanks</button><h1 class="insurance-bet">0</h1></div>'
        appendStr += '<div class="modal-play-options"><button class="hit-button" type="button" name="button">HIT</button><button class="double-button" type="button" name="button">DOUBLE</button><button class="stay-button" type="button" name="button">STAY</button><button class="split-button" type="button" name="button">SPLIT</button></div>'
        appendStr += '<div class="avatar"><img class="av-img" src="' + player.avatar + '"></div><div class="money-container"><div class="chips">$' + player.chips + '</div><div class="bet">$' + player.betSize + '</div><button class="decrease-bet">' + '-' + '</button><button class="increase-bet">' + '+' + '</button></div>';
        newDiv.append(appendStr);
        var avImgWidth = $('.av-img').css('width');
        $('.av-img').css('height', avImgWidth);
        $('.money-container').css('margin-top', '-' + avImgWidth);
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
          checkIndexPlayHand();
        });
        $(player.stayButton).click(function() {
          checkIndexPlayHand();
        });
        $(player.doubleButton).click(function() {
          checkIndexPlayHand();
        });
        $(player.splitButton).click(function() {
          checkIndexPlayHand();
        });
        playerRay.push(player);
      }
    });
  });// end of deal get
});

$('.start-button').click(function() {
  $('.modal-start-page-bottom').hide(500);
  $('.modal-start-page-top').hide(500);
  //$('.add-player').hide(300);
  $('.modal-deal-button').fadeIn(700);
});

$('.modal-deal-button').click(function() {
  $('.card-container').html('').fadeIn(1000);
  $('.dealer-container').html('');
  $('.modal-deal-button').hide(700);
  $('.increase-bet, .decrease-bet').fadeIn(400);
  dealer = new dealerObj();
  dealer.oponents = playerRay.length;
  for(var i = 0; i < playerRay.length; i++) {
    var newHandObj = handObj();
    newHandObj.betSize = playerRay[i].betSize;
    playerRay[i].hands.push(newHandObj);
    playerRay[i].div.append('<div class="card-container"></div>');
    for(var j = 0; j < 2; j++){
      var tempCard = deckRay.pop();
      playerRay[i].hands[0].cards.push(tempCard);
      var newElem = $('<img class="plyr-crd-img" src="' + tempCard.image + '">');
      playerRay[i].div.children('.card-container')[0].append(newElem[0]);
    }
  }
  dealer.cards.push(deckRay.pop());
  dealer.holeCard = dealer.cards[0];
  dealer.cards.push(deckRay.pop());
  dealer.checkForAce(dealer.cards[1]);
  $('.dealer-container').append('<div class="holecard card"><img src="' + dealer.cards[0].image + '"></div>');
  $('.dealer-container').append('<div class="card"><img src="' + dealer.cards[1].image + '"></div>');
  dealer.getValuHi();
  dealer.getValuLo();
  doInsurance();
});

function checkIndexPlayHand() {
  $(playerRay[playerIndex].hitButton).fadeOut(400);
  $(playerRay[playerIndex].stayButton).fadeOut(400);
  $(playerRay[playerIndex].doubleButton).fadeOut(400);
  $(playerRay[playerIndex].splitButton).fadeOut(400);
  if(playerIndex + 1 < playerRay.length) {
    playerIndex++;
    doPlayOutHands(playerIndex);
  } else {
    playerIndex = 0;
    dealerFinishesHand();
  }
}

function doShuffle() {
  if(deckRay.length < cutCount) {
    console.log('SHUFFLE TIME!!!');
  }
}
