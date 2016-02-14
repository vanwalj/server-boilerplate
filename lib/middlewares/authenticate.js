'use strict';

module.exports = () => function * authenticate (next) {
  this.assert(this.state.user, 401);

  yield next;
};
