require('chai');
var assert = require('assert');
var flogin = require('../src/chat/scripts/LogInManager.js').login;
var flogout = require('../src/chat/scripts/LogInManager.js').logout;

describe('LogInManagerTest', function () {
   it('Testing Login', async function () {
     let r =  await flogin();
     assert.equal(r, true)
  });

  it('Testing Logout', async function () {
    let r = await flogout();
    assert.equal(r, true)
  });

});