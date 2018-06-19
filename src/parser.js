const replacePlaceholder = (ricardian, placeholder, replacement) => {
    while(ricardian.indexOf(`{{ ${placeholder} }}`) > -1)
        ricardian = ricardian.replace(`{{ ${placeholder} }}`, `"${replacement}"`);
    return ricardian;
};

exports.constitution = abi => {

};

                                                                                        // { h1:'h1', h2:'h2' }
exports.parse = (actionName, actionParameters, ricardianContract, signingAccount = null, html = null) => {

    if(html !== null){
        if(typeof html === "boolean") html = {};
        if(!html.hasOwnProperty('h1')) html.h1 = 'h1';
        if(!html.hasOwnProperty('h2')) html.h2 = 'h2';
    }

    // Stripping backticks
    ricardianContract =
        ricardianContract.replace(/`/g, '');

    // Replacing action name
    ricardianContract =
        replacePlaceholder(ricardianContract, actionName, actionName);

    // Replacing action parameters
    Object.keys(actionParameters).map(param =>
        ricardianContract =
            replacePlaceholder(ricardianContract, param, actionParameters[param])
    );

    // Replacing signer
    if(signingAccount) ricardianContract = replacePlaceholder(ricardianContract, "signer", signingAccount);

    // Optional HTML formatting.
    if(html !== null){
        ricardianContract = ricardianContract.replace('# Action', `<${html.h1}>Action</${html.h1}>`);
        ricardianContract = ricardianContract.replace('## Description', `<${html.h2}>Action</${html.h2}>`);
        ricardianContract = ricardianContract.replace(/[\n\r]/g, '<br>');
    }

    return ricardianContract;
};