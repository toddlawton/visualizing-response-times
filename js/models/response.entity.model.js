var app = app || {};

app.models.responseEntity = Backbone.Model.extend({
    defaults: {
        url: '',
        title: '',
        responseTime: 0
    }
});