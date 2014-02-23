Handlebars.registerHelper('show',function(input){
  if (input == 'listBets' && Session.get('view') == undefined) {
    return true;
  }
  return Session.get('view') == input;
});

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
	return Bets.find();
}

Template.start.events({
  'click input#addBet' : function () {
  	console.log ("adding bet");
  	var text = $("#text").val ();
  	var option1 = $("#option1").val ();
  	var option2 = $("#option2").val ();
  	var options = [{text:option1}, {text:option2}];
  	Bets.insert({text:text, options:options});
  }
});

Template.listBets.events ({
	'click input.placeBet' : function (event) {
  	console.log ("placing bet");
  	var optionName = $(event.currentTarget).val ();
  	var parent = $(event.currentTarget).parent ();
  	var betId = $(parent).find ("#betId").val ();
  	var bet = Bets.findOne({_id:betId});
  	var userBet = UserBets.find({uid:Meteor.user()._id, betId:bet._id});
  	//if return value is good, don't insert anything....
  	console.log(userBet);
  	UserBets.insert ({optionName:optionName, amount:10, uid:Meteor.user()._id, betId:bet._id, bet_text: bet.text ,created_at: Date.now()});
  }
});

Template.userList.users = function() {
  console.log(Users.find().fetch())
  return Users.find().fetch();
}
