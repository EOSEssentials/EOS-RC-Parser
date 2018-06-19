const replacePlaceholder = (ricardian, placeholder, replacement) => {
    while(ricardian.indexOf(`{{ ${placeholder} }}`) > -1)
        ricardian = ricardian.replace(`{{ ${placeholder} }}`, `"${replacement}"`);
    return ricardian;
};

exports.constitution = abi => {

};

exports.parse = (actionName, actionParameters, ricardianContract, signingAccount = null) => {
    ricardianContract =
        ricardianContract.replace(/`/g, '');

    ricardianContract =
        replacePlaceholder(ricardianContract, actionName, actionName);

    Object.keys(actionParameters).map(param =>
        ricardianContract =
            replacePlaceholder(ricardianContract, param, actionParameters[param])
    );

    if(signingAccount) ricardianContract = replacePlaceholder(ricardianContract, "signer", signingAccount);

    return ricardianContract;
};