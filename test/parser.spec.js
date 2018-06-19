const assert = require('chai').assert;
require('mocha');

const parser = require('../src/parser');

describe('parser', () => {

    const systemAbi = require('./data/system.abi');

    it('should be able to parse ricardian contracts and remove curlys; replacing them with data', () => {
        const ricardian = systemAbi.abi.actions.find(fcAction => fcAction.name === 'bidname').ricardian_contract;
        const parsedRicardianContract = parser.parse('bidname', {bid:'3 EOS', bidder:'testaccount', newname:'somename'}, ricardian, "testaccount");
        console.log(parsedRicardianContract);
    });

});