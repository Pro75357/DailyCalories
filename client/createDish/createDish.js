import {Session} from "meteor/session";
import {calorieDatabase} from "../../collections/calorieDatabase";
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
            var amount = eval(e.target.value);
            //  console.log(amount)
            check(amount, Number)
        } catch (e) {
            alert('amount eval failed: '+e);
            return
        }

        DishItems.upsert({ _id: this._id }, { $set: { amount: amount } })
        // match the ID and update with the amount...

    },
    'submit #finishEdit': function (e) {
        e.preventDefault();
        //save new dish, get stuff from both collection and form event
        var dishName = e.target.dishName.value;
        var dishDate = e.target.dishDate.value;
        var foodWeight = e.target.foodWeight.value;

        //calories is the sum of values of all the combined ingredients
        var items = DishItems.find({}).fetch();
        // for each item, multiply it's amount by it's calories
        var totalCalories = 0;
        // If values are blank, need to alert and quit

        for (x in items) {
            if (!items[x].amount) {
                alert('No amount for: ' + items[x].name);
                return
            }
        }

        if (!foodWeight) {
            alert('Please Enter total weight');
            return
        }


        for (x in items) {
            cals = items[x].calories * items[x].amount;
            totalCalories = totalCalories + cals
        }

        var calsPerWeight = totalCalories / foodWeight;

        //build the new dish object based on convention:

        var newDish = {
            name: dishName + " ("+dishDate+")",
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
        var totalWeight = document.getElementById("totalWeight").value;
        var dishWeight = document.getElementById("dishWeight").value;
        var foodFinalWeight = totalWeight - dishWeight;
        //  console.log(foodFinalWeight)
        Session.set('foodFinalWeight', foodFinalWeight)
    }
});

Template.createDish.helpers({
    dishEdit() {
        return Session.get('dishEdit')
    },
    foodList: function () {
        return calorieDatabase.find({}).fetch()
    },
    dishItem() {
        return DishItems.find({}).fetch()
    },
    dishEstWeight() {
        // get all the amounts from the DishItem collection and add them up
        items = DishItems.find({}).fetch();
        total = 0;
        for (x in items) {
            amt = parseInt(items[x].amount);
            total = total + amt
        }
        return total
    },
    foodFinalWeight() {
        return Session.get('foodFinalWeight')
    },
    today() {
        m = moment(new Date());
        today = m.format('YYYY-DD-MM');
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
