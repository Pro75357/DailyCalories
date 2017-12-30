
const navs = ["daily","database","importExport"];

Session.set('activeNav',navs[0])

Template.header.helpers({
    navs(){
        return navs;
    },
    user(){
        return Meteor.user()
    },
    uservomit(){
        return JSON.stringify(Meteor.user(),null,2)
    },
    maybeActive(nav){
        if (Session.equals('activeNav',nav)){
            return "active"
        }
    }

});

Template.header.events({
   'click #logout'(){
       Meteor.logout()
   },
    'click a'(event){
       Session.set('activeNav',event.target.id)
    }
});