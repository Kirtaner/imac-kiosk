/* Customer data schema */

Schemas = {};

Meteor.isClient && Template.registerHelper("Schemas", Schemas);

Schemas.Customer = new SimpleSchema({
  firstName: {
    type: String,
    index: false
  },
  lastName: {
    type: String,
  },
  emailAddress: {
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  companyName: {
    type: String,
    optional: true
  },
  postalCode: {
    type: String,
  },
  mobileNumber: {
    type: Number
  },
  phoneNumber: {
    type: Number,
    optional: true
  },
  howDidYouFindUs: {
    type: String,
    // optional: true
  },
  confirmed: {
    type: Boolean,
    optional: true
  }

});

var Collections = {};

Meteor.isClient && Template.registerHelper("Collections", Collections);

Customers = Collections.Customers = new Mongo.Collection('Customers');

Customers.attachSchema(Schemas.Customer);


Customers.allow({
  insert: function () {
    return true;
  },
  remove: function () {
    return true;
  }
});


/* Customer data kiosk form */

if (Meteor.isClient) {

  Modal.allowMultiple = true;

  var hooksObject = {
    onSuccess: function(formType, result) {
      // Initial submission
      if (formType == 'insert') {
        id = this.docId;
        fields = this.insertDoc;

        console.log(id);
        console.log(fields);

        Session.set('lastId', id);
        Session.set('confirmInformation', fields);

        Modal.show('confirmationModal');
        // Modal.show('successModal');
        // successModal = setTimeout(function(){ Modal.hide('successModal'); }, 5000);
      }
    }
  };

  AutoForm.hooks({
    customerData: hooksObject
  });


  function notifyNewCustomer()
  {
    if (Notification.permission==="granted") {
      var notification = new Notification("New Customer Queued", {
        body: 'A customer has finished entering their personal details'
      });

      notification.onclick = function(e) {
        window.focus();
      }
    }
  }

  Template.registerHelper('confirmInformation', function(){
    return Session.get('confirmInformation');
  });

  Template.registerHelper('acquisitionOptions', function(){
    return {
      CSRH: "Web Search",
      CREF: "Someone Told You About Us",
      _CREF: "Walk-in"
    };
  });

  Template.registerHelper('policyPane', function(){
    return Session.get('policyPane');
  });

  Template.registerHelper('policyPaneUrl', function(){
    return Session.get('policyPaneUrl');
  });

  Template.registerHelper('policyPageContent', function(){
    return Session.get('policyPageContent');
  });

  showSuccessModal = function(){
    id = Session.get('lastId');

    Customers.update(id, {$set: {confirmed: true}}, {validate: false});

    Modal.hide('confirmationModal');

    setTimeout(function(){
      Modal.show('successModal');
      setTimeout(function(){
        Modal.hide('successModal');
        setTimeout(function(){
          $('.modal, .modal-backdrop').fadeOut().remove();
        }, 500);
      }, 2000);
    }, 500);
  }

  Template.customerList.helpers({
    customers: function () {
      // return Customers.find();
      return Customers.find({confirmed:true});
    }
  });

  Customers.find().observeChanges({
    added: function(id, fields) {
      notifyNewCustomer();
      // Modal.hide('customerFormModal');
    }
  });


  /* KIOSK DEMO MODE */

  var idleModal;

  Template.kiosk.events({
    'mousemove': function(){
      Modal.show('modeSelectionModal');
    },
    'keypress': function(){
      Modal.show('modeSelectionModal');
    }
  });

  Template.customerFormModal.events({
    'mousemove': function(){
      modalTimeout();
    },
    'keypress': function(){
      modalTimeout();
    }
  });

  Template.modeSelectionModal.events({
    'mousemove': function(){
      modalTimeout();
    },
    'keypress': function(){
      modalTimeout();
    }
  });

  Template.policyModal.events({
    'mousemove': function(){
      modalTimeout();
    },
    'keypress': function(){
      modalTimeout();
    }
  });

  Template.customerFormModal.rendered = function(){
    modalTimeout();
  }

  Template.modeSelectionModal.rendered = function(){
    modalTimeout();
  }

  Template.policyModal.rendered = function(){
    modalTimeout();
  }

  function modalTimeout(){
    clearTimeout(idleModal);
    idleModal = setTimeout(function(){ Modal.hide(); }, 30000);
  }

  Meteor.Spinner.options = {
      lines: 13, // The number of lines to draw
      length: 10, // The length of each line
      width: 5, // The line thickness
      radius: 15, // The radius of the inner circle
      corners: 0.7, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: '#fff', // #rgb or #rrggbb
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      shadow: true, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '400px', // Top position relative to parent in px
      left: '600px', // Left position relative to parent in px
  };

};

