import { calorieDatabase } from "../collections/calorieDatabase";

Meteor.methods({
    parseUpload(data) {
        check( data, Array );

        for ( var x in data) {
                let exists = calorieDatabase.findOne( { _id: data[x]._id } );

            if ( !exists ) {
                if (data[x]._id === ""){
                    // skip the blank file at the end of every papa parsed csv
                } else {
                    // inlclude the userID of whoever uploaded so it's in their subscripition
                    data[x].userId = Meteor.userId();

                    // add a lower-case name field for sorting (Mongo can't do case-insensitive sorting without black magic)
                    data[x].lowercaseName = data[x].name.toLowerCase();
                    calorieDatabase.insert(data[x]);
                }
            } else {
                console.warn( 'Rejected. This item already exists.' );
            }
        }
    }
});