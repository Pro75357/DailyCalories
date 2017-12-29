import {Template} from "meteor/templating";

Template.welcome.events({

    'submit #login': function (event) {
        event.preventDefault();
        let emailVar = event.target.email.value;
        let passwordVar = event.target.pwd.value;
        Meteor.loginWithPassword(emailVar, passwordVar, function(err, res){
            if (err){
                alert(err.message)
            }
        });
    }
});

Template.signup.events({
    'change #Cpwd': function(event){
        let pwd = document.getElementById('pwd');
        let cpwd = document.getElementById('Cpwd');
        if(pwd.value !== cpwd.value){
          cpwd.setCustomValidity("Passwords Don't Match")
        } else {
          cpwd.setCustomValidity('')
        }
    },
    'submit #signup': function (event) {
        event.preventDefault();
        let emailVar = event.target.email.value;
        let passwordVar = event.target.pwd.value;
        let nameVar = event.target.name.value;
        Accounts.createUser({
            email: emailVar,
            password: passwordVar,
            profile: {
                name: nameVar
            }

        }, function(err, res) {
            if (err) {
                alert(err.message)
            } else
        Router.go('/')
        });
    }
});