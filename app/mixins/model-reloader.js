import Ember from 'ember';
import ENV from 'screwdriver-ui/config/environment';

export default Ember.Mixin.create({
  /**
   * Overridable function to determine if a model should be reloaded
   * @method shouldReload
   * @param {Object}    model  The model that is to be reloaded
   * @return {Boolean}          True is model should be reloaded
   */
  shouldReload() {
    return true;
  },
  /**
   * Schedules reload of events data
   * @method scheduleReload
   */
  scheduleReload() {
    // The testing environment waits for asyncronous operations to complete.
    // If the reloader is active during tests, the tests will always timeout.
    // I'm not sure of a better way to handle this
    if (ENV.environment !== 'test') {
      const runLater = Ember.run.later(this, 'reloadModel', this.get('reloadTimeout'));

      this.set('runLater', runLater);
    }
  },

  /**
   * Reloads the list of events
   * @method reloadEvents
   */
  reloadModel() {
    const model = this.get(this.get('modelToReload'));

    if (this.shouldReload(model)) {
      model.reload().then(() => this.scheduleReload());
    }
  },

  /**
   * Starts reloading if not already doing so
   * @method startReloading
   */
  startReloading() {
    if (!this.get('runLater')) {
      this.scheduleReload();
    }
  },

  /**
   * Stops reloading
   * @method stopReloading
   */
  stopReloading() {
    if (this.get('runLater')) {
      Ember.run.cancel(this.get('runLater'));
      this.set('runLater', null);
    }
  }
});
