window.Pablo = window.Pablo || {};
Pablo.Models = Pablo.Models || {};
Pablo.Views = Pablo.Views || {};
Pablo.Events = _.extend({}, Backbone.Events);

(function ($, Backbone, _, window, undefined) {
  'use strict';

  window.wp = window.wp || {};
  window.tinyMCE = window.tinyMCE || {};

  Pablo.Models.Image = Backbone.Model.extend({
    defaults: {
      text: '“When people go to work, they shouldn\'t have to leave their hearts at home.”\r\n\r\n– Betty Bender',
      img: '//d3ijcis4e2ziok.cloudfront.net/engaging-images-backgrounds/batch-2-full-size/48.jpg'
    }
  });

  Pablo.Views.App = Backbone.View.extend({
    template: wp.template('pablo-app'),

    className: 'pablo-app',

    initialize: function () {
      Pablo.controlsView = new Pablo.Views.Controls({model: this.model});
      Pablo.previewView = new Pablo.Views.Preview({model: this.model});
      Pablo.actionsView = new Pablo.Views.Actions({model: this.model});
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      this.$el.find('.pablo-app-main').append(Pablo.controlsView.render().el);
      this.$el.find('.pablo-app-main').append(Pablo.previewView.render().el);
      this.$el.find('.pablo-app-footer').html(Pablo.actionsView.render().el);

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

      this.model.set('text', text);
    }
  });

  Pablo.Views.Preview = Backbone.View.extend({
    className: 'pablo-preview',

    initialize: function () {
      this.model.on('change', this.render, this);
    },

    render: function () {
      // First add html
      Pablo.canvasView = new Pablo.Views.Canvas({model: this.model});
      this.$el.html(Pablo.canvasView.el);

      // Then render canvas
      Pablo.canvasView.render();

      return this;
    }
  });

  Pablo.Views.Canvas = Backbone.View.extend({
    id: 'pablo-canvas',

    tagName: 'canvas',

    attributes: {
      width: 400,
      height: 240
    },

    initialize: function () {
    },

    render: function () {
      var _this = this;

      this.$el.detectPixelRatio(function (ratio) {
        _this.$el.drawImage({
          source: _this.model.get('img'),
          width: 400 * ratio,
          height: 240 * ratio,
          layer: true,
          bringToFront: false
        }).drawRect({
          layer: true,
          fillStyle: 'rgba(0, 0, 0, 0.25)',
          width: 400 * ratio,
          height: 240 * ratio
        }).drawText({
          fillStyle: '#fff',
          x: 20 * ratio, y: 60 * ratio,
          fontSize: 22,
          fontFamily: 'Merriweather, serif',
          lineHeight: 1.3,
          text: _this.model.get('text'),
          maxWidth: 310,
          align: 'left',
          respectAlign: true,
          layer: true,
          draggable: true,
          bringToFront: true,
        });
      });

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
      Pablo.appView = new Pablo.Views.App({model: this.model});

      Pablo.Events.on('pablo:cancel', this.close, this);
    },

    render: function () {
      var _this;

      this.$el.html(this.template({}));
      this.$el.find('.pablo-wrap').html(Pablo.appView.render().el);

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
      var data = {},
        text = tinyMCE.activeEditor.selection.getContent({format: 'text'}),
        imageModel,
        modal;

      if (!_.isEmpty(text)) {
        data.text = text;
      }

      imageModel = new Pablo.Models.Image(data);
      modal = new Pablo.Views.Modal({model: imageModel}).render();
    });

  });
})(jQuery, Backbone, _, window, undefined);
