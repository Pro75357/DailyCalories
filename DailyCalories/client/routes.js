

Router.route('/', function () {
    if (!Meteor.userId()) {
        this.render('welcome');
    } else {
        Router.go('/daily')
        //this.render('mainBody')
    }
});

Router.route('/signup', function(){
    if (Meteor.userId()) {
        this.render('signup')
    } else {
        Router.go('/')
    }
});

Router.route('/daily', function(){
    if (Meteor.userId()) {
        this.render('daily')
    } else {
        Router.go('/')
    }
});

Router.route('/database', function(){
    if (Meteor.userId()) {
        this.render('database')
    } else {
        Router.go('/')
    }
});

Router.route('/importExport', function(){
    if (Meteor.userId()) {
        this.render('importExport')
    } else {
        Router.go('/')
    }
});