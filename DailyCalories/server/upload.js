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
                    calorieDatabase.insert(data[x]);
                }
            } else {
                console.warn( 'Rejected. This item already exists.' );
            }
        }
    }
});