var app = app || {};

app.ResponseEntity = Backbone.Model.extend({
    defaults: {
        url: '',
        title: '',
        responseTime: 0
    }
});