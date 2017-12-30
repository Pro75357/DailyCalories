import {calorieDatabase, Daily} from "../../../collections/calorieDatabase";
import {Session} from "meteor/session";
import {Template} from "meteor/templating";

Template.daily.onCreated(function(){
    let m = moment(new Date()).format("YYYY-MM-DD");
    Session.set('mainDate', m)
});

Template.daily.onRendered(function(){
    document.getElementById('datePicker').value = Session.get('mainDate')
    console.log(Session.get('mainDate'))
});

Template.daily.helpers({

    dailyList: function () {
        let start = moment(Session.get('mainDate')).startOf('day');
        let end = moment(Session.get('mainDate')).add(1,'days').startOf('day');

        return Daily.find({ $and : [{date: { $gte: start._d}}, {date: { $lt: end._d}}]},
            {sort: {lowercaseName: 1}}).fetch();
    },
    totalDaily: function () {
        //first, get the database entries that match today's date
        // We will do this by getting all entries after midnight of today's date
        let start = moment(Session.get('mainDate')).startOf('day');
        let end = moment(Session.get('mainDate')).add(1,'days').startOf('day');

        let entries = Daily.find({ $and : [{date: { $gte: start._d}}, {date: { $lt: end._d}}]}).fetch();
        //console.log(entries)
        let total = 0;
        for (let x in entries) {
            //console.log(entries[x].totalCal)
            total = total + entries[x].totalCal
        }
        return total
    },
    foodList: function () {
        return calorieDatabase.find({},{sort: {lowercaseName: 1}}).fetch()
    },
    dayWord(){
        let today = moment(new Date()).format('YYYY-MM-DD');
        if (Session.equals('mainDate',today)){
            return "Today's"
        } else if (Session.equals('mainDate','')){
            return null;
        } else {
            return "Selected Date's"
        }
    }
});

Template.daily.events({
    'click #test'(event) {
        let m = moment(Session.get('mainDate'));
        let midnight = m.startOf('day');
        let end = m.endOf('day');

        let entries = Daily.find({ date: { $gte: midnight._d, $lt:end._d  } }).fetch();
        console.log(entries);
        let total = 0;
        for (let x in entries) {
            //console.log(entries[x].totalCal)
            total = total + entries[x].totalCal
        }
        console.log(total)
    },

    'submit .foodInput' (event) {
        event.preventDefault();
        //define vars
        let _id = event.target.foodListInput.value;
        let measurement = event.target.measurement.value;
        //Get the calorie value from the database
        let db = calorieDatabase.findOne({ _id: _id });
        let calScale = db.calories;
        let name = db.name;
        let unit = db.unit;
        let totalCal = measurement * calScale;


        //Store this in the Daily database
        Daily.insert({
            userId: Meteor.userId(),
            name: name,
            measurement: measurement,
            totalCal: totalCal,
            old_id: _id,
            unit: unit,
            date: new Date()
        })
    },
    'submit .exerciseInput'(event){
        event.preventDefault();
        let name = event.target.exerciseNameInput.value;
        let totalCal = event.target.exerciseCals.value;

        //Store this in the Daily database
        Daily.insert({
            userId: Meteor.userId(),
            name: name,
            totalCal: -totalCal,
            unit: "Exercise",
            date: new Date()
        })
    },
    'click .dailyItem': function (event, t) {
        //console.log(this.name)
        //populate the text items with the info

        //get the fields
        let n = document.getElementById("foodListInput");
        let c = document.getElementById("measurement");

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
        let  m = document.getElementById("measurement");
        m.value = ""
    },
    'change #datePicker': function(event){
        let date = event.target.value;
        Session.set('mainDate',date)
        console.log(Session.get('mainDate'))
    }
});

