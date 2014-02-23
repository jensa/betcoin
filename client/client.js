Template.start.bets = function (){
	console.log("hejh");
	return Bets.find();
}
Template.start.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  }
});