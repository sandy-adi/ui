import Ember from 'ember';
const RELOAD_TIMER = 5000;

export default Ember.Route.extend({
  model(params) {
    return this.get('store').findRecord('build', params.build_id).then(build => {
      // reload again in a little bit if queued
      const reloadQueuedBuild = () => {
        if (build.get('status') === 'QUEUED') {
          setTimeout(() => build.reload().then(reloadQueuedBuild), RELOAD_TIMER);
        }
      };

      reloadQueuedBuild();

      return build;
    });
  }
});