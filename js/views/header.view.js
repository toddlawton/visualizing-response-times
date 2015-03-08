app.views.headerView = Backbone.View.extend({
    
    el: '.header',

    responseEditTemplate: _.template($('#response-entity-edit-template').html()),
    
    events: {
        "click .create-new-entity": "openCreateDialog"
    },

    initialize: function() {
        console.log(this);
    },

    render: function() {},

    openCreateDialog: function() {
        var self = this;
        this.$modal = '';
        this.dialog = this.$el.avgrund({
            height: 320,
            holderClass: 'modal-container',
            enableStackAnimation: false,
            openOnEvent: false,
            onBlurContainer: '.container',
            onReady: function() {
                self.$modal = $('.modal-container');
                self.$modal.html( self.responseEditTemplate({'title': ' ', 'url': ' ', newEntity: true}) );
                self.bindModalEvents();
            },
            template: ''
        });
    },

    bindModalEvents: function() {
        var self = this;
        this.$modal.find('#entity-edit-save').on('click', $.proxy(self.saveCreateModal, self));
        this.$modal.find('#entity-edit-cancel').on('click', self.closeCreateModal);
    },

    closeCreateModal: function() {
        $('.avgrund-overlay').trigger('click');
    },

    saveCreateModal: function() {
        var self = this,
            newEntityAttrs = {};

        $('.modal-container input').each(function(){
            var modelAttribute = $(this).data('model-attr');
            if (modelAttribute) {
                // self.model.set(modelAttribute, $(this).val());
                newEntityAttrs[modelAttribute] = $(this).val();
            }
        });

        var newEntity = new app.models.responseEntity(newEntityAttrs);
        app.responseEntities.add(newEntity).save();

        self.render();
        this.closeCreateModal();
    }

});