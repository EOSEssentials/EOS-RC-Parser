'use strict';

// HELPERS //////////////////////////////////////////////////////

/***
 * Replaces curly brace placeholders
 * @param ricardian
 * @param placeholder
 * @param replacement
 * @returns {*}
 */
var replacePlaceholder = function replacePlaceholder(ricardian, placeholder, replacement) {
    while (ricardian.indexOf('{{ ' + placeholder + ' }}') > -1) {
        ricardian = ricardian.replace('{{ ' + placeholder + ' }}', '"' + replacement + '"');
    }return ricardian;
};

/***
 * Html can be either a boolean, null, or an object of {h1,h2}
 * @param html
 * @returns {*}
 */
var htmlDefaults = function htmlDefaults(html) {
    if (html === null) return html;
    if (html === false) return null;

    if (typeof html === "boolean") html = {};
    if (!html.hasOwnProperty('h1')) html.h1 = 'h1';
    if (!html.hasOwnProperty('h2')) html.h2 = 'h2';

    return html;
};

// EXPORTED ///////////////////////////////////////////////////////////

/***
 * Parses the constitution
 * @param constitution
 * @param signingAccount
 * @param html
 * @returns {*}
 */
exports.constitution = function (constitution, signingAccount) {
    var html = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var getArticleTag = function getArticleTag() {
        return constitution.match(new RegExp('#' + "(.*)" + '-'));
    };

    html = htmlDefaults(html);

    // Replacing signer
    if (signingAccount) constitution = replacePlaceholder(constitution, "signer", signingAccount);

    // Optional HTML formatting.
    if (html !== null) {
        var articleTag = getArticleTag();

        while (articleTag && articleTag[0].length) {
            var strippedArticleTag = articleTag[0].replace('# ', '').replace(' -', '');
            constitution = constitution.replace(articleTag[0], '<' + html.h1 + '>' + strippedArticleTag + '</' + html.h1.split(' ')[0] + '>');
            articleTag = getArticleTag();
        }
        constitution = constitution.replace(/[\n\r]/g, '<br>');
    }

    return constitution;
};

/***
 * Parses arbitrary contract action ricardian contracts.
 * @param actionName
 * @param actionParameters
 * @param ricardianContract
 * @param signingAccount
 * @param html
 * @returns {*}
 */
exports.parse = function (actionName, actionParameters, ricardianContract) {
    var signingAccount = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var html = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

    html = htmlDefaults(html);

    // Stripping backticks
    ricardianContract = ricardianContract.replace(/`/g, '');

    // Replacing action name
    ricardianContract = replacePlaceholder(ricardianContract, actionName, actionName);

    // Replacing action parameters
    Object.keys(actionParameters).map(function (param) {
        return ricardianContract = replacePlaceholder(ricardianContract, param, actionParameters[param]);
    });

    // Replacing signer
    if (signingAccount) ricardianContract = replacePlaceholder(ricardianContract, "signer", signingAccount);

    // Optional HTML formatting.
    if (html !== null) {
        ricardianContract = ricardianContract.replace('# Action', '<' + html.h1 + '>Action</' + html.h1.split(' ')[0] + '>');
        ricardianContract = ricardianContract.replace('## Description', '<' + html.h2 + '>Description</' + html.h2.split(' ')[0] + '>');
        ricardianContract = ricardianContract.replace(/[\n\r]/g, '<br>');
    }

    return ricardianContract;
};
