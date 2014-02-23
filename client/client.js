Template.start.bets = function (){
	return Bets.find({"users.userId":Meteor.user().profile.id});
}

Template.start.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  	console.log(Meteor.user().profile.id);
  },
  'click #addBet' : function () {
  	Bets.insert({text:text, options:options, users:[Meteor.user().profile.id]});
  }
});
