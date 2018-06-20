const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;
const rcParser = require('../');
require('mocha');


describe('parser', () => {

    const systemAbi = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'system.abi'), 'utf8'));

    const testAction = (actionName, data, signer = null, html = null) => {
        const ricardian = systemAbi.actions.find(fcAction => fcAction.name === actionName).ricardian_contract;
        const parsedRicardianContract = rcParser.parse(actionName, data, ricardian, signer, html);
        assert(parsedRicardianContract.indexOf('{{') === -1, `Could not parse the ${actionName} action`);
        assert(parsedRicardianContract.indexOf('}}') === -1, `Could not parse the ${actionName} action`);
        console.log(parsedRicardianContract);
        console.log('\r\n\------------------------------------------------------------------\r\n\ ');
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
        const parsed = testAction('bidname', {bid: '3 EOS', bidder: 'testaccount', newname: 'somename'}, 'testaccount', {h1:'b', h2:'i class="test"'});
        assert(parsed.indexOf('<b>') > -1, 'did not format html with custom tags');
        assert(parsed.indexOf('<i class="test">') > -1, 'did not format html with custom tags');
    });

    it('should be able to parse the constitution', () => {
        const ricardian = systemAbi.ricardian_clauses[0].body;
        const parsedRicardianContract = rcParser.constitution(ricardian, '', true);
        assert(parsedRicardianContract.indexOf('{{') === -1, `Could not parse the constitution`);
        assert(parsedRicardianContract.indexOf('}}') === -1, `Could not parse the constitution`);
    });

});