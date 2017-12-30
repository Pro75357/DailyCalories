import { Mongo } from 'meteor/mongo'

//Create the database
export const calorieDatabase = new Mongo.Collection('calorieDatabase')

export const Daily = new Mongo.Collection('daily')

Meteor.methods({
    'deleteAll': function(){
        calorieDatabase.remove({})
    }
});

if(Meteor.isServer){
    Meteor.publish('calorieDatabase', function(){
        return calorieDatabase.find({
            userId: Meteor.userId()
        })
    });
    Meteor.publish('daily', function(){
        return Daily.find({
            userId: Meteor.userId()
        })
    });
}

if (Meteor.isClient){
    Meteor.subscribe('calorieDatabase');
    Meteor.subscribe('daily');
}