import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';

import './main.html';
import './routes.js';

Template.body.onCreated = function(){
    Session.set('edit', false)
    Session.set('importExport',false)
    Session.set('currentTab',"daily")
    document.getElementById("edit").checked = false
    document.getElementById("importExport").checked = false
};


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


