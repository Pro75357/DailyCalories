Template.header.helpers({
    user(){
        return Meteor.user()
    },
    uservomit(){
        return JSON.stringify(Meteor.user(),null,2)
    }

});

Template.header.events({
   'click #logout'(){
       Meteor.logout()
   },
});