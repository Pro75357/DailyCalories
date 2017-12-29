import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './main.html';

Template.body.onCreated = function(){
    Session.set('edit', false)
    Session.set('importExport',false)
    document.getElementById("edit").checked = false
    document.getElementById("importExport").checked = false
};


Router.route('/', function () {
    if (!Meteor.userId()) {
        this.render('welcome');
    } else {
        this.render('daily')
    }
});

Router.route('/signup', function(){
    this.render('signup')
});


Template.body.helpers({
    edit() {
        return Session.get('edit')
    },
    importExport(){
        return Session.get('importExport')
    },
    islogin(){
        return Meteor.userId()
    },
});

Template.body.events({
    'change #edit': function (event) {
        Session.set('edit', event.target.checked)
    },
    'change #importExport': function (event){
        Session.set('importExport', event.target.checked)
    }
});


