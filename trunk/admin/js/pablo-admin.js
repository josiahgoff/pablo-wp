(function ($, Backbone, _, window, undefined) {
  'use strict';

  window.wp = window.wp || {};
  window.tinyMCE = window.tinyMCE || {};

  // Localized data object from WP
  window.pablo = window.pablo || {};

  // App namespace
  window.Pablo = window.Pablo || {};
  Pablo.Models = Pablo.Models || {};
  Pablo.Collections = Pablo.Collections || {};
  Pablo.Views = Pablo.Views || {};
  Pablo.Events = _.extend({}, Backbone.Events);

  /////////////////////////////////////////
  // Models
  ////////////////////////////////////////

  Pablo.Models.App = Backbone.Model.extend({
    defaults: {
      text: '“When people go to work, they shouldn\'t have to leave their hearts at home.”\r\n\r\n– Betty Bender',
      fontFamily: 'serif',
      fontColor: 'rgb(255, 255, 255)',
      fontSize: 12,
      background: pablo.imgUrlRoot + '1.jpg'
    },

    initialize: function () {
      this.set('background', this.getRandomImage());

      this.listenTo(Pablo.Events, 'pablo:background:selected', this.updateBackground);
    },

    updateBackground: function (background) {
      this.set('background', background);
    },

    getRandomImage: function () {
      // Get random number between 1 and 40
      var min = 1,
        max = 39,
        num = Math.floor(Math.random() * (max - min + 1)) + min;

      return pablo.imgUrlRoot + num + '.jpg';
    }
  });

  Pablo.Models.Background = Backbone.Model.extend({
    defaults: {
      id: 1,
      img: '',
      thumb: ''
    },

    initialize: function () {
      this.set('img', pablo.imgUrlRoot + this.get('id') + '.jpg');
      this.set('thumb', pablo.imgUrlRoot + '_thumbs/' + this.get('id') + '.jpg');
    }
  });

  /////////////////////////////////////////
  // Collections
  ////////////////////////////////////////

  Pablo.Collections.Backgrounds = Backbone.Collection.extend({
    model: Pablo.Models.Background
  });

  /////////////////////////////////////////
  // Views
  ////////////////////////////////////////

  Pablo.Views.App = Backbone.View.extend({
    template: wp.template('pablo-app'),

    className: 'pablo-app',

    initialize: function () {
      this.listenTo(Pablo.Events, 'pablo:image:processed', this.insertImage);

      if (Pablo.controlsView) {
        Pablo.controlsView.remove();
      }
      Pablo.controlsView = new Pablo.Views.Controls({model: this.model});

      if (Pablo.previewView) {
        Pablo.previewView.remove();
      }
      Pablo.previewView = new Pablo.Views.Preview({model: this.model});

      if (Pablo.actionsView) {
        Pablo.actionsView.remove();
      }
      Pablo.actionsView = new Pablo.Views.Actions({model: this.model});
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

      Pablo.Events.trigger('pablo:image:inserted');
    }
  });

  Pablo.Views.Controls = Backbone.View.extend({
    template: wp.template('pablo-controls'),

    className: 'pablo-controls',

    events: {
      'keyup .pablo-text': 'updateText',
      'change .pablo-font-family-select': 'updateFontFamily',
      'change .pablo-font-size-select': 'updateFontSize',
      'change .pablo-font-color-select': 'updateFontColor'
    },

    initialize: function () {

    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      // Instantiate the backgrounds collection
      if (! Pablo.backgroundsCollection) {
        var backgrounds = [];

        for (var i = 1; i < 40; i ++) {
          backgrounds.push({id: i});
        }

        Pablo.backgroundsCollection = new Pablo.Collections.Backgrounds(backgrounds);
      }

      // Render backgrounds list view
      if (Pablo.backgroundsListView) {
        Pablo.backgroundsListView.remove();
      }
      Pablo.backgroundsListView = new Pablo.Views.BackgroundsList({collection: Pablo.backgroundsCollection});
      this.$el.find('.pablo-backgrounds').html(Pablo.backgroundsListView.render().el);

      return this;
    },

    updateText: function (e) {
      this.model.set('text', $(e.target).val());
    },

    updateFontFamily: function (e) {
      this.model.set('fontFamily', $(e.target).val());
    },

    updateFontSize: function (e) {
      this.model.set('fontSize', $(e.target).val());
    },

    updateFontColor: function (e) {
      this.model.set('fontColor', $(e.target).val());
    }
  });

  Pablo.Views.BackgroundsList = Backbone.View.extend({
    tagName: 'ul',

    className: 'pablo-backgrounds-list clearfix',

    initialize: function () {
    },

    render: function () {
      var _this = this;

      // Append each list item (background thumbnail)
      this.collection.each(function (bg) {
        _this.$el.append(new Pablo.Views.BackgroundsListItem({model: bg}).render().el);
      });

      return this;
    }
  });

  Pablo.Views.BackgroundsListItem = Backbone.View.extend({
    template: wp.template('pablo-backgrounds-list-item'),

    tagName: 'li',

    className: 'pablo-backgrounds-list-item',

    events: {
      'click img': 'selectBackground'
    },

    initialize: function () {
    },

    render: function () {
      this.$el.html(this.template(this.model.toJSON()));

      return this;
    },

    selectBackground: function () {
      Pablo.Events.trigger('pablo:background:selected', this.model.get('img'));
    }
  });

  Pablo.Views.Preview = Backbone.View.extend({
    className: 'pablo-preview',

    initialize: function () {
    },

    render: function () {
      // First make sure there's only one instance of the canvas view
      if (Pablo.canvasView) {
        Pablo.canvasView.remove();
      }
      Pablo.canvasView = new Pablo.Views.Canvas({model: this.model});

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
      this.ratio = 1;

      this.model.on('change:text change:fontFamily change:fontColor change:fontSize', this.updateText, this);
      this.model.on('change:background', this.updateBackground, this);
      this.listenTo(Pablo.Events, 'pablo:submit', this.getCanvasImage);
    },

    render: function () {
      var _this = this,
        bgImg = new Image();

      this.$el.detectPixelRatio(function (ratio) {
        _this.ratio = ratio;
      });

      bgImg.src = this.model.get('background');

      // Wait for image to load to get width/height
      $(bgImg).on('load', function () {
        _this.$el.drawImage({
          name: 'background',
          source: _this.model.get('background'),
          width: 400 * _this.ratio,
          height: 240 * _this.ratio,
          sWidth: bgImg.width * _this.ratio,
          sHeight: bgImg.height * _this.ratio,
          sx: 0, sy: 0,
          cropFromCenter: false,
          layer: true,
          bringToFront: false
        }).drawRect({
          name: 'shade',
          layer: true,
          fillStyle: 'rgba(0, 0, 0, 0.25)',
          width: 400 * _this.ratio,
          height: 240 * _this.ratio
        }).drawText({
          name: 'text',
          fillStyle: _this.model.get('fontColor'),
          x: 20 * _this.ratio, y: 60 * _this.ratio,
          fontSize: _this.model.get('fontSize') * _this.ratio,
          fontFamily: _this.model.get('fontFamily'),
          lineHeight: 1.3,
          text: _this.model.get('text'),
          maxWidth: 310,
          align: 'left',
          respectAlign: true,
          fromCenter: true,
          layer: true,
          draggable: true,
          bringToFront: true
        });
      });

      return this;
    },

    updateText: function () {
      var _this = this;

      if (! _this.textLayer) {
        _this.textLayer = _this.$el.getLayer('text');
      }

      _this.$el.setLayer(_this.textLayer, {
        text: _this.model.get('text'),
        fontSize: _this.model.get('fontSize') * _this.ratio,
        fontFamily: _this.model.get('fontFamily'),
        fillStyle: _this.model.get('fontColor')
      });

      _this.$el.drawLayers();
    },

    updateBackground: function () {
      var _this = this,
        bgImg = new Image();

      bgImg.src = _this.model.get('background');

      // Wait for image to load to get width/height
      $(bgImg).on('load', function () {
        if (! _this.backgroundLayer) {
          _this.backgroundLayer = _this.$el.getLayer('background');
        }

        _this.$el.setLayer(_this.backgroundLayer, {
          source: bgImg.src,
          sWidth: bgImg.width * _this.ratio,
          sHeight: bgImg.height * _this.ratio
        });

        _this.$el.drawLayers();
      });
    },

    getCanvasImage: function () {
      var image = this.$el.getCanvasImage('jpeg');

      Pablo.Events.trigger('pablo:image:processed', image);
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

      if (Pablo.appView) {
        Pablo.appView.remove();
      }
      Pablo.appView = new Pablo.Views.App({model: this.model});

      this.listenTo(Pablo.Events, 'pablo:cancel', this.close);
      this.listenTo(Pablo.Events, 'pablo:image:inserted', this.close);
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

      if (! _.isEmpty(text)) {
        data.text = text;
      }

      if (! Pablo.appModel) {
        Pablo.appModel = new Pablo.Models.App(data);
      } else {
        Pablo.appModel.set(data);
      }

      if (Pablo.modalView) {
        Pablo.modalView.remove();
      }
      Pablo.modalView = new Pablo.Views.Modal({model: Pablo.appModel}).render();
    });

  });
})(jQuery, Backbone, _, window, undefined);
