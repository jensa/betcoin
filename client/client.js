Template.start.bets = function (){
	return Bets.find();
}

Template.start.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  },
  'click input[type=button]' : function () {
  	console.log ("adds bet");
  	var text = $("#text").val ();
  	var option1 = $("#option1").val ();
  	var option2 = $("#option2").val ();
  	var options = [{text:option1}, {text:option2}];
  	Bets.insert({text:text, options:options});
  }
});

Template.userList.users = function() {
  console.log(Users.find().fetch())
  return Users.find().fetch();
}
