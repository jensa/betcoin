// Handlebar helpers

Handlebars.registerHelper('show',function(input){
  if (input == 'listBets' && Session.get('view') == undefined) {
    return true;
  }
  return Session.get('view') == input;
});

Handlebars.registerHelper('activeTab',function(input){
  console.log("handle bars helper");
  if (input == 'listBets' && Session.get('view') == undefined) {
    console.log("input");
    return "active";
  } else if (Session.get('view') == input) {
    console.log("view");
    console.log(Session.get('view'));
    return "active";
  }
  return "not_active";
});

// Templates.

Template.header.events( {
  'click #showCreateBet' : function() {
    Session.set('view', 'createBet');
  },
  'click #showListOfBets' : function() {
    Session.set('view', 'listBets');
  },
  'click #showProfile' : function() {
    Session.set('view', 'profile');
  }
});

Template.listBets.bets = function (){
  return Bets.find().fetch().reverse();
}

Template.listBets.ifMadeBet = function (id, options){
  var madeBet = UserBets.findOne({betId:id});
  if(madeBet){
    console.log("found bet: "+madeBet.optionName);
    return options.fn({text:madeBet.optionName});
  }
  else{
    console.log ("Didnt find any betsz");
    return options.inverse(this);
  }
}

Template.start.events({
  'click #addBet' : function (e, t) {
    e.preventDefault();
    var attrs = {
      text: t.find('[name="text"]').value,
      options: [
        {
          text: t.find('[name="option1"]').value
        },
        {
          text: t.find('[name="option2"]').value
        }
      ]
    };
    Bets.insert(attrs);
    Session.set('view', 'listBets');
  }
});

Template.listBets.events ({
  'click .placeBet' : function (event) {
    var parent = $($($(event.currentTarget).parent()).parent()).parent();
    var betId = $(parent).find("#betId").val ();
    var optionName = $(event.currentTarget).data('option');
    console.log(optionName);
    var bet = Bets.findOne({_id:betId});

    Meteor.call("placeBet", Meteor.user()._id, betId, optionName);
  }
});

Template.userList.users = function() {
  console.log(Users.find().fetch())
  return Users.find().fetch();
};
