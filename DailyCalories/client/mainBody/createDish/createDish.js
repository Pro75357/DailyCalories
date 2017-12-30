import {Session} from "meteor/session";
import {calorieDatabase} from "../../../collections/calorieDatabase";
import {check} from "meteor/check";
import {Template} from "meteor/templating";

export const DishItems = new Mongo.Collection(null);

Template.createDish.events({
    'click #newDish': function () {
        Session.set('dishEdit', true);
        Session.set('reviewItems', false);
        DishItems.remove({})
    },
    'change .dishItemAmount': function (e) {
        // when the item amount is typed in, we need to save it with the corresponding item in the session variable
        try {
            let amount = eval(e.target.value);
            //  console.log(amount)
            check(amount, Number);
            DishItems.upsert({ _id: this._id }, { $set: { amount: amount } })
            // match the ID and update with the amount...
        } catch (e) {
            alert('amount eval failed: '+e);
        }
    },
    'submit #finishEdit': function (e) {
        e.preventDefault();
        //save new dish, get stuff from both collection and form event
        let dishName = e.target.dishName.value;
        let dishDate = e.target.dishDate.value;
        let foodWeight = e.target.foodWeight.value;

        //calories is the sum of values of all the combined ingredients
        let items = DishItems.find({}).fetch();
        // for each item, multiply it's amount by it's calories
        let totalCalories = 0;
        // If values are blank, need to alert and quit

        for (let x in items) {
            if (!items[x].amount) {
                alert('No amount for: ' + items[x].name);
                return
            }
        }

        if (!foodWeight) {
            alert('Please Enter total weight');
            return
        }


        for (let x in items) {
            let cals = items[x].calories * items[x].amount;
            totalCalories = totalCalories + cals
        }

        let calsPerWeight = totalCalories / foodWeight;

        //build the new dish object based on convention:
        let name = dishName + " ("+dishDate+")";
        let newDish = {
            userId: Meteor.userId(),
            name: name,
            lowercaseName: name.toLowerCase(),
            date: dishDate,
            calories: calsPerWeight,
            unit: 'g',
            type: 'recipe',
            items: items
        };

        //finally, add to the calorieDatabase database
        calorieDatabase.insert(newDish);


        //reset dishEdit
        Session.set('dishEdit', false);
        DishItems.remove({})
    },
    'click #cancelDish': function () {
        Session.set('dishEdit', false);
        Session.set('reviewItems', false);
        DishItems.remove({});
        Session.set('foodFinalWeight', null)
    },
    'click #copyDish': function () {
        Session.set('dishEdit', true);
        Session.set('foodFinalWeight', null)
    },
    'change #addList': function (e) {
        // add to DishItems the matching _id from the value
        id = e.target.value;
        let item = calorieDatabase.findOne({_id: id});
        console.log(item);
        DishItems.insert(item)
    },
    'dblclick .dishRow': function (e) {
        DishItems.remove({_id: this._id})
    },
    'change .weightEntry': function (e) {
        let totalWeight = document.getElementById("totalWeight").value;
        let dishWeight = document.getElementById("dishWeight").value;
        let foodFinalWeight = totalWeight - dishWeight;
        //  console.log(foodFinalWeight)
        Session.set('foodFinalWeight', foodFinalWeight)
    }
});

Template.createDish.helpers({
    dishEdit() {
        return Session.get('dishEdit')
    },
    foodList: function () {
        return calorieDatabase.find({}, {sort: {lowercaseName: 1}}).fetch()
    },
    dishItem() {
        return DishItems.find({}).fetch()
    },
    dishEstWeight() {
        // get all the amounts from the DishItem collection and add them up
        let items = DishItems.find({}).fetch();
        let total = 0;
        for (let x in items) {
            let amt = parseInt(items[x].amount);
            total = total + amt
        }
        return total
    },
    foodFinalWeight() {
        return Session.get('foodFinalWeight')
    },
    today() {
        let m = moment(new Date());
        let today = m.format('YYYY-DD-MM');
        return today
    },
    vomit() {
        return JSON.stringify(DishItems.find({}).fetch(), null, 2)
    },
    review() {
        return Session.get('reviewItems')
    },
    dishName() {
        return Session.get('dishName')
    }


});
