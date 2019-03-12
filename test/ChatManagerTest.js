import { describe, it } from 'mocha';
import { assert, expect } from 'chai';
var sendM = require('../src/chat/scripts/chatManager.js').sendMessage;
var recM = require('../src/chat/scripts/chatManager.js').receiveMessages;


describe('ChatManagerTest', function () {
    it('Testing SendMenssage', async function () {
      let r =  await sendM();
      assert.equal(r, true);
   });
 
   it('Testing ReceiveMessage', async function () {
     let r = await recM();
     assert.typeOf(r,"Array");
   });
 
 });