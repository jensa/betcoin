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
      UserBets.insert ({optionName:optionName, amount:10, uid:Meteor.user()._id, betId:betId, bet_text: bet.text ,created_at: Date.now()});
    }
  }
});
