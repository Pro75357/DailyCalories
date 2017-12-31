import { Mongo } from 'meteor/mongo'

//Create the database
export const calorieDatabase = new Mongo.Collection('calorieDatabase');

export const Daily = new Mongo.Collection('daily');

export const AllFoods = new Mongo.Collection('allFoods');

Meteor.methods({
    'deleteAll': function(){
        calorieDatabase.remove({});
        AllFoods.remove({});
    },

    //autocomplete stuff
    'allFoodsSearch'(search) {
        let searchRegEx = new RegExp(RegExp.escape(search),'i');
        let res = [];
        AllFoods.find({name: searchRegEx}).forEach(function(item){
            res.push({label: item.name, value: item._id});
        });
        return res;
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
    Meteor.publish('allFoods', function(){
        return AllFoods.find()
    })




}

if (Meteor.isClient){
    Meteor.subscribe('calorieDatabase');
    Meteor.subscribe('daily');
    Meteor.subscribe('allFoods');
}