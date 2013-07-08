(function ($) {

  /**
   * Backbone model for a Gem.
   * Currently only has one attribute: 'name', which should be a String.
   * @type {*}
   */
  var Gem = Backbone.Model.extend({
    defaults: function () {
      return {
        name: 'Gem'
      };
    }
  });

  /**
   * Lightweight collection of Gems. Orders alphabetically on name.
   * @type {*}
   */
  var GemList = Backbone.Collection.extend({
    model: Gem,
    localStorage: new Backbone.LocalStorage("gems-backbone"),
    comparator: 'name'
  });

  var Gems = new GemList();


  /**
   * Main class for the App's View.
   * @type {*}
   */
  var AppView = Backbone.View.extend({
    el: $('#main'),
    events: {
      'keypress #new_gem': 'createOnEnter',
      'click #submit_gem': 'createOrSelectGem',
      'typeahead:selected #new_gem' : 'createOrSelectGem'
    },

    initialize: function () {
      this.$input = this.$('#new_gem');
      this.$alertContainer = this.$('#alert_container');
      this.footer = this.$('footer');
      this.main = $('#main');

      Gems.fetch();
      this.initializeTypeahead();

      this.listenTo(Gems, 'add', this.initializeTypeahead);

    },

    initializeTypeahead: function () {
      this.$input.typeahead('destroy');

      this.$input.typeahead({
        local: Gems.pluck('name')
      });
    },

    /**
     * Called from the pressing "enter" on the input field.
     */
    createOnEnter: function (e) {
      if (e.keyCode != 13) return;
      if (!this.$input.val()) return;
      this.createOrSelectGem();
    },

    /**
     * Creates the Gem and displays an alert to the user about their new gem.
     */
    createOrSelectGem: function (e) {
      var gemName = this.$input.val();
      if(gemName.match(/^\w{3,}/)) {
        if(Gems.where({name: gemName}).length === 0) {
          Gems.create({name: gemName});
        }
        this.showMessage(gemName, true);
        this.$input.val('');
      } else {
        this.showMessage(gemName, false);
      }


    },
    showMessage: function (gemName, success) {
      this.$alertContainer.hide();
      if(success) {
        this.$alertContainer.html(
          '<div class=\'alert alert-success\'>Thanks for selecting ' + gemName +'! </div>');
      } else {
        this.$alertContainer.html(
          '<div class=\'alert alert-error\'> Sorry! ' + gemName +' isn\'t a valid name! </div>');
      }
      this.$alertContainer.fadeIn();
    }
  });
  var AppView = new AppView();
})(jQuery);
