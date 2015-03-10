/**
 * Views: Header View
 * View for header navigation
 */

app.views.headerView = Backbone.View.extend({
    
    el: '.header',

    responseEditTemplate: _.template($('#response-entity-edit-template').html()),
    
    events: {
        "click .create-new-entity": "openCreateDialog"
    },

    initialize: function() {},

    render: function() {},

    /**
     * Initialize and render a modal to create a new entity
     */
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

    /**
     * Bind click events to the editing modal for this entity
     */
    bindModalEvents: function() {
        var self = this;
        this.$modal.find('#entity-edit-save').on('click', $.proxy(self.saveCreateModal, self));
        this.$modal.find('#entity-edit-cancel').on('click', $.proxy(self.closeCreateModal, self));
    },

    /**
     * Unbind click events when the modal is closed
     */
    closeCreateModal: function() {
        this.$modal.find('#entity-edit-save').off('click');
        this.$modal.find('#entity-edit-cancel').off('click');
        $('.avgrund-overlay').trigger('click');
    },

    /**
     * Create this entity's model with input values and trigger a render
     */
    saveCreateModal: function() {
        var self = this,
            newEntityAttrs = {};

        $('.modal-container input').each(function(){
            var modelAttribute = $(this).data('model-attr');
            if (modelAttribute) {
                newEntityAttrs[modelAttribute] = $(this).val();
            }
        });

        var newEntity = new app.models.responseEntity(newEntityAttrs);
        app.responseEntities.add(newEntity).save();

        self.render();
        this.closeCreateModal();
    }

});