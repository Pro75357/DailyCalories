import {AllFoods} from "../../collections/calorieDatabase";


Session.setDefault('allFoodsTypeAhead',null);
Session.setDefault('autoInput',null);

function AF(){
    return AllFoods.find({lowercaseName: {$regex: Session.get('autoInput')}},{limit: 25});
}

Template.testing.helpers({
    allFoodsVomit(){
        return //JSON.stringify(AllFoods.find({}).fetch(), null, 2)
    },
    allFoodsCount(){
        return AllFoods.find().count()
    },
    autoFoodsCount(){
        return AF().count()
    },
    autoFoods(){
        return AF().fetch()
    }
});

Template.testing.events({
    'change [name="uploadCSV"]' ( event, template ) {
        Session.set('uploading', true)
        Papa.parse( event.target.files[0], {
            header: true,
            complete( results, file ) {
                //console.dir(results.data)
                Meteor.call('parseAllFoods', results.data, (error, response) => {
                    if (error) {
                        alert('warning ' + error.reason);
                        Session.set('uploading', false)
                    } else {
                        Session.set('uploading', false);
                        alert('Upload complete!');
                    }
                })
            }
        })
    },

    'change #autoInput'(event){
        Session.set('autoInput',event.target.value.toLowerCase())
    },
    'click .autoList'(event){
        console.log(event.target.id)

    }


});
