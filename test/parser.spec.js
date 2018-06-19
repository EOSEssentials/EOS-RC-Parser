const assert = require('chai').assert;
require('mocha');

const parser = require('../src/parser');

describe('parser', () => {

    const systemAbi = require('./data/system.abi');

    const testAction = (actionName, data, signer = null, html = null) => {
        const ricardian = systemAbi.abi.actions.find(fcAction => fcAction.name === actionName).ricardian_contract;
        const parsedRicardianContract = parser.parse(actionName, data, ricardian, signer, html);
        assert(parsedRicardianContract.indexOf('{{') === -1, `Could not parse the ${actionName} action`);
        assert(parsedRicardianContract.indexOf('}}') === -1, `Could not parse the ${actionName} action`);
        console.log(parsedRicardianContract);
        console.log('\r\n\------------------------------------------------------------------\r\n\ ');
    };

    // it('should be able to parse the newaccount action', () => {
    //     testAction('newaccount', {creator: 'testcreator', name: 'testaccount', owner: 'somekey', active:'somekey'}, 'testcreator');
    // });
    //
    // it('should be able to parse the updateauth action', () => {
    //     testAction('updateauth', {account: 'testaccount', permission: 'subactive', parent: 'active', auth:'active'}, 'testaccount');
    // });
    //
    // it('should be able to parse the bidname action', () => {
    //     testAction('bidname', {bid: '3 EOS', bidder: 'testaccount', newname: 'somename'}, 'testaccount');
    // })

    it('should be able to parse the bidname action with html enabled', () => {
        testAction('bidname', {bid: '3 EOS', bidder: 'testaccount', newname: 'somename'}, 'testaccount', true);
    });

});