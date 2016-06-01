import expect from 'expect.js';
import AllocUtil from './performance-alloc-common.js';


describe('allocation message performance for different numbers of addresses', function() {
  this.timeout(100000);

  let allocUtil = new AllocUtil();

  it('prepare: connect stub', function(done) {
    allocUtil.prepare(done);
  });



  /********** single object address  ********************/

  it('100 object address allocation requests for 1 address each ', function(done) {
    allocUtil.allocLoop( "object", 100, 1, done);
  });

  it('100 object address de-allocation requests for 1 address each ', function(done) {
    allocUtil.deallocLoop( "object", done);
  });

  // it('1000 object address allocation requests for 1 address each ', function(done) {
  //   allocUtil.allocLoop( "object", 1000, 1, done);
  // });
  //
  // it('1000 object address de-allocation requests for 1 address each ', function(done) {
  //   allocUtil.deallocLoop( "object", done);
  // });
  //
  // it('10000 object address allocation requests for 1 address each ', function(done) {
  //   allocUtil.allocLoop( "object", 10000, 1, done);
  // });
  //
  // it('10000 object address de-allocation requests for 1 address each ', function(done) {
  //   allocUtil.deallocLoop( "object", done);
  // });
  //

  /********** block of object addresses  ********************/

  it('100 object address allocation requests for 3 addresses each ', function(done) {
    allocUtil.allocLoop( "object", 100, 3, done);
  });

  it('100 object address de-allocation requests for 3 addresses each ', function(done) {
    allocUtil.deallocLoop( "object", done);
  });

  // it('1000 object address allocation requests for 3 addresses each ', function(done) {
  //   allocUtil.allocLoop( "object", 1000, 3, done);
  // });
  //
  // it('1000 object address de-allocation requests for 3 addresses each ', function(done) {
  //   allocUtil.deallocLoop( "object", done);
  // });
  //
  // it('10000 object address allocation requests for 3 addresses each ', function(done) {
  //   allocUtil.allocLoop( "object", 10000, 3, done);
  // });
  //
  // it('10000 object address de-allocation requests for 3 addresses each ', function(done) {
  //   allocUtil.deallocLoop( "object", done);
  // });

  /********** block of object addresses WITH allocation key ********************/

  it('100 object address allocation requests for 3 addresses each with allocationKey', function(done) {
    allocUtil.allocLoop( "object", 100, 3, done, true);
  });

  it('100 object address de-allocation requests for 3 addresses each with allocationKey', function(done) {
    allocUtil.deallocLoop( "object", done, true);
  });


  // it('1000 object address allocation requests for 3 addresses each with allocationKey', function(done) {
  //   allocUtil.allocLoop( "object", 1000, 3, done, true);
  // });
  //
  // it('1000 object address de-allocation requests for 3 addresses each with allocationKey', function(done) {
  //   allocUtil.deallocLoop( "object", done, true);
  // });
  //
  // it('10000 object address allocation requests for 3 addresses each with allocationKey', function(done) {
  //   allocUtil.allocLoop( "object", 10000, 3, done, true);
  // });
  //
  // it('10000 object address de-allocation requests for 3 addresses each with allocationKey', function(done) {
  //   allocUtil.deallocLoop( "object", done, true);
  // });
  //
  //
  // it('cleanup: disconnect stub', function(done) {
  //   allocUtil.prepare(done);
  // });

  it('cleanup: disconnect stub', function(done) {
    allocUtil.prepare(done);
  });

});
