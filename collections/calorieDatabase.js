import { Mongo } from 'meteor/mongo'

//Create the database
export const calorieDatabase = new Mongo.Collection('calorieDatabase')

export const Daily = new Mongo.Collection('daily')

Meteor.methods({
    'deleteAll': function(){
        calorieDatabase.remove({})
    }
})