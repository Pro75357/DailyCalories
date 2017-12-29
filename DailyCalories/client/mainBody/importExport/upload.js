import { calorieDatabase } from "../../../collections/calorieDatabase";

Template.upload.onCreated(function(){
    Session.set('uploading', false)
});

Template.upload.helpers({
    uploading() {
        return Session.get('uploading');
    },
    databaseCount(){
        return calorieDatabase.find({}).fetch().length
    },

    databaseVomit(){
        return JSON.stringify(calorieDatabase.find({}).fetch(), null, 2)
    }
});


Template.upload.events({
    'change [name="uploadCSV"]' ( event, template ) {
        Session.set('uploading', true)
        Papa.parse( event.target.files[0], {
            header: true,
            complete( results, file ) {
                //console.dir(results.data)
                Meteor.call('parseUpload', results.data, (error, response) => {
                    if (error) {
                        alert('warning ' + error.reason);
                        Session.set('uploading', false)
                    } else {
                        Session.set('uploading', false)
                        alert('Upload complete!');
                    }
                })
            }
        })
    },

    'submit #deleteForm': function(event){
        event.preventDefault()
        if (event.target.deleteText.value === 'delete'){
            Meteor.call('deleteAll')
            event.target.deleteText.value = ''
        } else {
            alert('must type "delete" to confirm delete all action')
            event.target.deleteText.value = ''
        }
    },

    'click #export': function (event) {
        var data = calorieDatabase.find({}).fetch()
        var csv = Papa.unparse(data)
       //console.log(csv)
        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        var a = window.document.createElement("a");
        a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
        a.download = "database.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

    }
});
