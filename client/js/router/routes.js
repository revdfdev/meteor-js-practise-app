FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render('home')
    }
});