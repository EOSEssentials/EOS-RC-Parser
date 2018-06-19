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
        // console.log(parsedRicardianContract);
        // console.log('\r\n\------------------------------------------------------------------\r\n\ ');
        return parsedRicardianContract;
    };

    it('should be able to parse the newaccount action', () => {
        testAction('newaccount', {creator: 'testcreator', name: 'testaccount', owner: 'somekey', active:'somekey'}, 'testcreator');
    });

    it('should be able to parse the updateauth action', () => {
        testAction('updateauth', {account: 'testaccount', permission: 'subactive', parent: 'active', auth:'active'}, 'testaccount');
    });

    it('should be able to parse the bidname action', () => {
        testAction('bidname', {bid: '3 EOS', bidder: 'testaccount', newname: 'somename'}, 'testaccount');
    });

    it('should be able to parse the bidname action with html enabled', () => {
        const parsed =testAction('bidname', {bid: '3 EOS', bidder: 'testaccount', newname: 'somename'}, 'testaccount', true);
        assert(parsed.indexOf('<h1>') > -1, 'did not format html');
        assert(parsed.indexOf('<h2>') > -1, 'did not format html');
    });

    it('should be able to parse the bidname action with html enabled and custom tags', () => {
        const parsed = testAction('bidname', {bid: '3 EOS', bidder: 'testaccount', newname: 'somename'}, 'testaccount', {h1:'b', h2:'i'});
        assert(parsed.indexOf('<b>') > -1, 'did not format html with custom tags');
        assert(parsed.indexOf('<i>') > -1, 'did not format html with custom tags');
    });

});