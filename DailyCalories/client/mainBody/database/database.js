import {Session} from "meteor/session";
import {calorieDatabase} from "../../../collections/calorieDatabase";
import {Template} from "meteor/templating";
import {DishItems} from "../createDish/createDish";


Template.database.events({

    // Get the new entry
    'submit #databaseForm'(event) {
        event.preventDefault();

        //Build the food item's object
        let foodName = event.target.foodName.value;
        let calories = event.target.calories.value;
        let units = event.target.units.value;

        let newItem = {
            userId: Meteor.userId(),
            name: foodName,
            lowercaseName: foodName.toLowerCase(),
            calories: calories,
            unit: units,
            type: 'ingredient'
        };

        // Insert the new item into the database
        calorieDatabase.insert(newItem)
    },


    'click .fooditem': function(event, t) {
        //console.log(this.name)
        //populate the text items with the info

        //get the fields
        let n = document.getElementById("foodName");
        let c = document.getElementById("calories");
        let u = document.getElementById("units");

        // set the values
        n.value = this.name;
        c.value = this.calories;
        u.value = this.unit;

        // If editing a dish, add the clicked one to the list
        if (Session.get('dishEdit')) {
            DishItems.insert(this);
            return
        }
        //console.log(this.type)

        // if we are not in dish editor and click on a recipe, we want to view the ingredients.
        if (this.type === 'recipe') {
            Session.set('dishName', this.name);

            DishItems.remove({});
            for (x in this.items) {
                DishItems.insert(this.items[x])
            }
            Session.set('reviewItems', true)
        } else {
            Session.set('reviewItems', false)
        }


    },
    'dblclick .fooditem': function (e, t) {
        //console.log(this._id)


        // delete this from database
        calorieDatabase.remove({_id: this._id})
    }
});


Template.database.helpers({
    foodCalories(){
        return calorieDatabase.find({}, {sort: {lowercaseName: 1}}).fetch()
    },
    units() {
        return ['g', 'ml', 'Tbps', 'tsp', 'cup','oz','cal', 'Each']
    },
    tableColor(foodType){
        switch(foodType) {
            case 'ingredient':
                return "bg-ingredient";
            case 'recipe':
                return "bg-recipe";
        }
    }

});

Template.registerHelper('formatDate', function (date) {
    return moment(date).format('l');
});

Template.registerHelper('formatNumber', function (number) {
    return parseFloat(Math.round(number * 100) / 100).toFixed(0)
});


Template.registerHelper('formatNumberTwoDecimal', function (number) {
    return parseFloat(Math.round(number * 100) / 100).toFixed(2)
});