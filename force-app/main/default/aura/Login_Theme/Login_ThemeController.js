({
    initialize: function(component) {
        var url = $A.get('$Resource.loginbg');
        component.set('v.backgroundImageURL', url);
    }
})