/* FACTOIDS */

if (Meteor.isClient) {

  /* Kiosk frame helpers */

  Template.kiosk.created = function(){
    Session.setDefault('currentBackground', '1');
    Session.setDefault('currentFrame', 'dyk');
  };

  Template.demo.created = function(){
    Session.setDefault('currentBackground', '1');
    Session.setDefault('currentFrame', 'dyk');
  };

  Template.registerHelper('currentFrame', function(){
    return Session.get('currentFrame');
  });

  Template.registerHelper('currentBackground', function(){
    return Session.get('currentBackground');
  });

  /* TTS Callout frame helpers */

  var randomTTSCallout = function() {
    frames = Array('consoles',
                   'samsungServiceCentre',
                   'apple',
                   'dataRecovery',
                   'liquidDamage',
                   'walkInService',
                   'warranty'
                  );

    frame = frames[Math.floor(Math.random()*frames.length)];
    // return 'dataRecovery';
    return frame;
  }

  var randomTTSCalloutBusiness = function() {
    frame = 'businessQuip'+Math.floor((Math.random() * 9) + 1);
    // frame = 'businessQuip9';

    return frame;
  }

  Template.registerHelper('ttsCalloutRandom', function(){
    return randomTTSCallout();
  });

  Template.registerHelper('ttsCalloutBusinessRandom', function(){
    return randomTTSCalloutBusiness();
  });

  /* Quote frame helpers */

  var randomQuote = function() {
    quote = 'quote'+Math.floor((Math.random() * 13) + 1);
    return quote;
  }

  Template.registerHelper('currentQuote', function(){
    return randomQuote();
  });

  /* Factoid helpers */

  var randomFact = function() {
    fact = Math.floor((Math.random() * 14) + 1);
    factName = 'fact'+fact;
    return factName;
  }

  Template.registerHelper('currentFactoid', function(){
    return randomFact();
  });

}