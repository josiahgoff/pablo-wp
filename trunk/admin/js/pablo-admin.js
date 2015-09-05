window.Pablo = window.Pablo || {};
Pablo.Models = Pablo.Models || {};
Pablo.Views = Pablo.Views || {};
Pablo.Events = _.extend({}, Backbone.Events);

(function ($, Backbone, _, window, undefined) {
  'use strict';

  window.wp = window.wp || {};
  window.tinyMCE = window.tinyMCE || {};
  window.pablo = window.pablo || {};

  Pablo.Models.Image = Backbone.Model.extend({
    defaults: {
      text: '“When people go to work, they shouldn\'t have to leave their hearts at home.”\r\n\r\n– Betty Bender',
      img: pablo.imgUrl
    }
  });

  Pablo.Views.App = Backbone.View.extend({
    template: wp.template('pablo-app'),

    className: 'pablo-app',

    initialize: function () {
      Pablo.Events.on('pablo:imageProcessed', this.insertImage, this);

      if (! Pablo.controlsView) {
        Pablo.controlsView = new Pablo.Views.Controls({model: this.model});
      }

      if (! Pablo.previewView) {
        Pablo.previewView = new Pablo.Views.Preview({model: this.model});
      }

      if (! Pablo.actionsView) {
        Pablo.actionsView = new Pablo.Views.Actions({model: this.model});
      }
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      this.$el.find('.pablo-app-main').append(Pablo.controlsView.render().el);
      this.$el.find('.pablo-app-main').append(Pablo.previewView.render().el);
      this.$el.find('.pablo-app-footer').html(Pablo.actionsView.render().el);

      return this;
    },

    insertImage: function (image) {
      var editor = tinyMCE.activeEditor,
        imgNode = editor.getDoc().createElement('img');

      // Create the image
      imgNode.src = image;

      // Deselect any text so the img doesn't replace it
      editor.selection.collapse();
      editor.execCommand('mceInsertContent', false, imgNode.outerHTML);

      Pablo.Events.trigger('pablo:imageInserted');
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
    },

    render: function () {
      // First make sure there's only one instance
      if (! Pablo.canvasView) {
        Pablo.canvasView = new Pablo.Views.Canvas({model: this.model});
      }

      // Then add html
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
      this.model.on('change:text', this.updateText, this);
      Pablo.Events.on('pablo:submit', this.getCanvasImage, this);
    },

    render: function () {
      var _this = this;

      this.$el.detectPixelRatio(function (ratio) {
        _this.$el.drawImage({
          source: _this.model.get('img'),
          width: 400 * ratio,
          height: 240 * ratio,
          layer: true,
          bringToFront: false,
          crossOrigin: 'anonymous'
        }).drawRect({
          layer: true,
          fillStyle: 'rgba(0, 0, 0, 0.25)',
          width: 400 * ratio,
          height: 240 * ratio
        }).drawText({
          name: 'text',
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
          bringToFront: true
        });
      });

      return _this;
    },

    updateText: function () {
      var _this = this;

      if (! _this.textLayer) {
        _this.textLayer = _this.$el.getLayer('text');
      }

      _this.$el.setLayer(_this.textLayer,{
        text: _this.model.get('text')
      });

      _this.$el.drawLayers();
    },

    getCanvasImage: function () {
      var image = this.$el.getCanvasImage('jpeg');

      Pablo.Events.trigger('pablo:imageProcessed', image);
    }
  });

  Pablo.Views.Actions = Backbone.View.extend({
    template: wp.template('pablo-actions'),

    className: 'pablo-actions',

    initialize: function () {
    },

    events: {
      'click .pablo-button-submit': 'submit',
      'click .pablo-button-cancel': 'cancel'
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    },

    submit: function () {
      Pablo.Events.trigger('pablo:submit');
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
      Pablo.Events.on('pablo:imageInserted', this.close, this);
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

  // Bootstrap it
  $(document).ready(function () {

    $('.js-pablo-modal').click(function () {
      var data = {},
        text = tinyMCE.activeEditor.selection.getContent({format: 'text'});

      if (!_.isEmpty(text)) {
        data.text = text;
      }

      if (! Pablo.imageModel) {
        Pablo.imageModel = new Pablo.Models.Image(data);
      } else {
        Pablo.imageModel.set(data);
      }

      if (! Pablo.modalView) {
        Pablo.modalView = new Pablo.Views.Modal({model: Pablo.imageModel}).render();
      } else {
        Pablo.modalView.render();
      }
    });

  });
})(jQuery, Backbone, _, window, undefined);
