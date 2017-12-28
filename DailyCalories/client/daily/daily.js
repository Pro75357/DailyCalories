import {calorieDatabase, Daily} from "../../collections/calorieDatabase";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Template.daily.helpers({

    selectedFood: function () {
        Session.get('food');
        return calorieDatabase.find({}).fetch()
    },
    dailyList: function () {
        return Daily.find({}).fetch()
    },
    totalDaily: function () {
        //first, get the database entries that match today's date
        // We will do this by getting all entries after midnight of today's date
        m = moment(new Date());
        midnight = m.startOf('day');

        entries = Daily.find({ date: { $gte: midnight._d } }).fetch();
        //console.log(entries)
        total = 0;
        for (x in entries) {
            //console.log(entries[x].totalCal)
            total = total + entries[x].totalCal
        }
        return total
    },
    foodList: function () {
        return calorieDatabase.find({}).fetch()
    },
});

Template.daily.events({
    'click #test'(event) {
        m = moment(new Date());
        midnight = m.startOf('day');

        entries = Daily.find({ date: { $gte: midnight._d } }).fetch();
        console.log(entries);
        total = 0;
        for (x in entries) {
            //console.log(entries[x].totalCal)
            total = total + entries[x].totalCal
        }
        console.log(total)
    },

    'submit form' (event) {
        event.preventDefault();
        //define vars
        var _id = event.target.foodListInput.value;
        var measurement = event.target.measurement.value;
        //Get the calorie value from the database
        var db = calorieDatabase.findOne({ _id: _id });
        var calScale = db.calories;
        var name = db.name;
        var unit = db.unit;
        var totalCal = measurement * calScale;


        //Store this in the Daily database
        Daily.insert({
            name: name,
            measurement: measurement,
            totalCal: totalCal,
            old_id: _id,
            unit: unit,
            date: new Date()
        })
    },
    'click .dailyItem': function (event, t) {
        //console.log(this.name)
        //populate the text items with the info

        //get the fields
        n = document.getElementById("foodListInput");
        c = document.getElementById("measurement");

        // set the values
        n.value = this.old_id;
        c.value = this.measurement

    },
    'dblclick .dailyItem': function (e, t) {
        // delete this from database
        Daily.remove({ _id: this._id })
    },

    'change #foodListInput': function () {
        // remove the old number on new dropdown selection
        m = document.getElementById("measurement");
        m.value = ""
    }
});

