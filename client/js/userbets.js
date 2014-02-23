Template.userBets.userBets = function() {
	return UserBets.find({}, { sort: { created_at: -1}, limit: 5});
}