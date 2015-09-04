window.Pablo = window.Pablo || {};
Pablo.Models = Pablo.Models || {};
Pablo.Views = Pablo.Views || {};
Pablo.Events = _.extend({}, Backbone.Events);

(function ($, Backbone, _, window, undefined) {
  'use strict';

  window.wp = window.wp || {};

  Pablo.Models.Image = Backbone.Model.extend({
    defaults: {
      text: '“Our lives begin to end the day we become silent about things that matter.”\r\n\r\n– Martin Luther King Jr.',
      img: '//d3ijcis4e2ziok.cloudfront.net/engaging-images-backgrounds/batch-2-full-size/16.jpg'
    }
  });

  Pablo.Views.App = Backbone.View.extend({
    template: wp.template('pablo-app'),

    className: 'pablo-app',

    initialize: function () {
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      this.controlsView = new Pablo.Views.Controls({model: this.model});
      this.previewView = new Pablo.Views.Preview({model: this.model});
      this.actionsView = new Pablo.Views.Actions({model: this.model});

      this.$el.find('.pablo-app-main').append(this.controlsView.render().el);
      this.$el.find('.pablo-app-main').append(this.previewView.render().el);
      this.$el.find('.pablo-app-footer').html(this.actionsView.render().el);

      return this;
    }
  });

  Pablo.Views.Controls = Backbone.View.extend({
    template: wp.template('pablo-controls'),

    className: 'pablo-controls',

    events: {
      'keyup .pablo-text': 'updateText'
    },

    initialize: function () {
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    },

    updateText: function (e) {
      var text = $(e.target).val();
      console.log(text);
      this.model.set('text', text);
    }
  });

  Pablo.Views.Preview = Backbone.View.extend({
    template: wp.template('pablo-preview'),

    className: 'pablo-preview',

    initialize: function () {
      this.model.on('change', this.render, this);
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    }
  });

  Pablo.Views.Actions = Backbone.View.extend({
    template: wp.template('pablo-actions'),

    className: 'pablo-actions',

    initialize: function () {
    },

    events: {
      'click .pablo-button-cancel': 'cancel'
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    },

    cancel: function () {
      Pablo.Events.trigger('pablo:cancel');
    }
  });

  Pablo.Views.Modal = Backbone.View.extend({
    template: wp.template('pablo-modal'),

    className: 'pablo-popup',

    initialize: function () {
      this.popup = $.magnificPopup.instance;
      this.appView = new Pablo.Views.App({model: new Pablo.Models.Image});

      Pablo.Events.on('pablo:cancel', this.close, this);
    },

    render: function () {
      var _this;

      this.$el.html(this.template({}));
      this.$el.find('.pablo-wrap').html(this.appView.render().el);

      // Trigger popup
      _this = this;
      this.popup.open({
        items: {
          src: _this.el
        },
        modal: true,
        type: 'inline'
      }, 0);

      return this;
    },

    close: function () {
      this.popup.close();
    }
  });

  $(document).ready(function () {

    $('.js-pablo-modal').click(function () {
      var modal = new Pablo.Views.Modal().render();
    });

  });
})(jQuery, Backbone, _, window, undefined);
