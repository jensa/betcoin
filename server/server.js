Meteor.startup(function () {
  // code to run on server at startup
  Accounts.loginServiceConfiguration.remove({
    service: "facebook"
  });

  Accounts.loginServiceConfiguration.insert({
    service: "facebook",
    appId: "1419086941672200",
    secret: "b2f91ab88bbd5ba56c1e554ce3a0b636"
  });

  Accounts.onCreateUser(function (options, user) {
    if (user.services.facebook == undefined) {
      var profile = {};
      profile.betcoins = 100;

      profile.email = user.emails[0].address;
      user.profile = profile;
    } else {

      var accessToken = user.services.facebook.accessToken,
          result,
          profile;

      result = Meteor.http.get("https://graph.facebook.com/me", {
        params: {
          access_token: accessToken
        }
      });

      if (result.error)
        throw result.error;

      profile = _.pick(result.data,
        "name", "id", "email"
        );

      profile.betcoins = 1000;

      user.profile = profile;
    }

    return user;
  });
});

Meteor.methods({
  'placeBet' : function(uid, betId, optionName) {
    var userBet = UserBets.findOne({uid:Meteor.user()._id, betId:betId});
    var bet = Bets.findOne({_id:betId});

    if (userBet) {
      userBet.optionName = optionName;
      console.log(userBet);
      UserBets.update({_id:userBet._id}, {$set:{optionName: optionName}});
    } else {
      var bet = Bets.findOne({_id:betId});
      UserBets.insert ({optionName:optionName, amount:bet.amount, uid:Meteor.user()._id, betId:betId, bet_text: bet.text ,created_at: Date.now()});
    }
  },

  'closeBet' : function(uid, betId, optionName){
    var failedBets = UserBets.find({betId:betId, optionName:{ $ne:optionName}}).fetch();
    var successBets = UserBets.find({betId:betId, optionName:optionName}).fetch();
    var total = 0;
    for (var i = failedBets.length - 1; i >= 0; i--) {
      modifyby (failedBets[i].uid, -failedBets[i].amount);
      total +=failedBets[i].amount;
    };
    var toEachWinner = 0;
    if(successBets.length > 0 && failedBets.length > 0)
      toEachWinner = total / successBets.length;
    for (var i = successBets.length - 1; i >= 0; i--) {
      modifyby(bet.uid, parseFloat(successBets[i].amount) + toEachWinner)
    };
    Bets.update ({_id:betId}, {$set:{open:false, closed:optionName}});
  },

  'addBet' : function(attrs){
    Bets.insert(attrs);
  }
});

var modifyby = function(uid, amount){
  var user = Users.findOne({_id:uid});
  var current = parseFloat(user.profile.betcoins);
  var newAmount = current + parseFloat(amount);
  Users.update({_id:uid}, {$set:{'profile.betcoins': newAmount}});
}
