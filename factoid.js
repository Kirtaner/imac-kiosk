/* FACTOIDS */

if (Meteor.isClient) {
  // Initial factoid
  // Template.factoid.created = function(){
  //   Session.setDefault('currentFactoid', rollDice());
  //   Session.setDefault('currentAnimation', 'anim1');
  // };


  var rollDice = function() {
    fact = Math.floor((Math.random() * 14) + 1);
    // fact = Math.floor((Math.random() * 3) + 1);
    factName = 'fact'+fact;
    return factName;
  }

  // Select a random factoid
  var randomFact = function() {

    factName = rollDice();

    // make sure it doesn't repeat the previous fact
    while(Session.get('currentFactoid') === factName) {
      factName = rollDice();
    }

    animation = 'anim'+Math.floor((Math.random() * 5) + 1);

    while(Session.get('currentAnimation') === animation) {
      animation = 'anim'+Math.floor((Math.random() * 5) + 1);
    }

    Session.set('currentFactoid', factName);
    Session.set('currentAnimation', animation);
    // Meteor.setTimeout(function(){
    //   Session.set('currentAnimation', animation);
    // },4000);
  }

  var randomTitleAnim = function() {
    animations = Array('bounce','tada','rubberBand','swing','jello','wobble','flip');
    titleAnimation = animations[Math.floor(Math.random()*animations.length)];
    Session.set('dykAnimation', 'animated '+titleAnimation);
  }

  var randomFactInterval = Meteor.setInterval(randomFact, 4000);
  var randomTitleAnimInterval = Meteor.setInterval(randomTitleAnim, 4000);

  Template.registerHelper('currentFactoid', function(){
    return Session.get('currentFactoid');
  });

  Template.registerHelper('currentAnimation', function(){
    return Session.get('currentAnimation');
  });

  Template.registerHelper('dykAnimation', function(){
    return Session.get('dykAnimation');
  });



  /* Kiosk frame helpers */

  Template.kiosk.created = function(){
    Session.setDefault('currentBackground', '1');
    Session.setDefault('currentFrame', 'dyk');
  };

  Template.registerHelper('currentFrame', function(){
    return Session.get('currentFrame');
  });

  Template.registerHelper('currentBackground', function(){
    return Session.get('currentBackground');
  });

  // var randomTitleAnimInterval = Meteor.setInterval(randomTitleAnim, 4000);

  /* TTS Callout helpers */

  var randomTTSCallout = function() {
    frames = Array('consoles','samsungServiceCentre');
    frame = frames[Math.floor(Math.random()*frames.length)];
    return frame;
  }

  Template.registerHelper('ttsCalloutRandom', function(){
    return randomTTSCallout();
  });

}