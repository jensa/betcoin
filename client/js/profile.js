Template.profile.betcoins = function() {
	return Meteor.user().profile.betcoins;
}

Template.betsForUser.bets = function() {
	return Bets.find({created_by:Meteor.user()._id});
}