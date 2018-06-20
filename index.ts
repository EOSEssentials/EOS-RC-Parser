// TYPES /////////////////////////////////////////////////////////

export type HTML = {h1?: string, h2?: string} | null;

// HELPERS //////////////////////////////////////////////////////

/**
 * Replaces curly brace placeholders
 *
 * @private
 * @param ricardian
 * @param placeholder
 * @param replacement
 * @returns {*}
 */
const replacePlaceholder = (ricardian: any, placeholder: any, replacement: any) => {
    while (ricardian.indexOf(`{{ ${placeholder} }}`) > -1) {
        ricardian = ricardian.replace(`{{ ${placeholder} }}`, `"${replacement}"`);
    }
    return ricardian;
};

/**
 * Html can be either a boolean, null, or an object of {h1,h2}
 *
 * @private
 * @param html
 * @returns {*}
 */
const htmlDefaults = (html: any) => {
    if (html === null) { return html; }
    if (html === false) { return null; }

    if (typeof html === "boolean") { html = {}; }
    if (!html.hasOwnProperty("h1")) { html.h1 = "h1"; }
    if (!html.hasOwnProperty("h2")) { html.h2 = "h2"; }

    return html;
};

// EXPORTED ///////////////////////////////////////////////////////////

/***
 * Parses the constitution
 *
 * @param {string} constitutionText Constitution Text
 * @param {string} signingAccount Signing Account
 * @param {Object} [html=null] HTML formatting
 * @returns {string} Parsed Constitution
 */
export const constitution = (constitutionText: string, signingAccount: string, html: HTML = null) => {
    const getArticleTag = () => constitutionText.match(new RegExp("#" + "(.*)" + "-"));

    html = htmlDefaults(html);

    // Replacing signer
    if (signingAccount) { constitutionText = replacePlaceholder(constitutionText, "signer", signingAccount); }

    // Optional HTML formatting.
    if (html !== null) {
        // Add default fallback to html
        if (!html.h1) { html.h1 = "h1"; }
        if (!html.h2) { html.h2 = "h2"; }

        let articleTag = getArticleTag();

        while (articleTag && articleTag[0].length) {
            const strippedArticleTag = articleTag[0].replace("# ", "").replace(" -", "");
            constitutionText = constitutionText.replace(articleTag[0], `<${html.h1}>${strippedArticleTag}</${html.h1.split(" ")[0]}>`);
            articleTag = getArticleTag();
        }
        constitutionText = constitutionText.replace(/[\n\r]/g, "<br>");
    }

    return constitutionText;
};

/**
 * Parses arbitrary contract action ricardian contracts.
 *
 * @param {string} actionName Action Name
 * @param {Object} actionParameters Action Parameters
 * @param {string} ricardianContract Ricardian Contract
 * @param {string} signingAccount Signing Account
 * @param {Object} [html=null] HTML Formatting
 * @returns {string} Parsed Ricardian Contract
 */
export const parse = (actionName: string, actionParameters: any, ricardianContract: string, signingAccount = null, html: HTML = null) => {
    html = htmlDefaults(html);

    // Stripping backticks
    ricardianContract =
        ricardianContract.replace(/`/g, "");

    // Replacing action name
    ricardianContract =
        replacePlaceholder(ricardianContract, actionName, actionName);

    // Replacing action parameters
    Object.keys(actionParameters).map((param) =>
        ricardianContract =
            replacePlaceholder(ricardianContract, param, actionParameters[param]),
    );

    // Replacing signer
    if (signingAccount) { ricardianContract = replacePlaceholder(ricardianContract, "signer", signingAccount); }

    // Optional HTML formatting.
    if (html !== null) {
        // Add default fallback to html
        if (!html.h1) { html.h1 = "h1"; }
        if (!html.h2) { html.h2 = "h2"; }

        ricardianContract = ricardianContract.replace("# Action", `<${html.h1}>Action</${html.h1.split(" ")[0]}>`);
        ricardianContract = ricardianContract.replace("## Description", `<${html.h2}>Description</${html.h2.split(" ")[0]}>`);
        ricardianContract = ricardianContract.replace(/[\n\r]/g, "<br>");
    }

    return ricardianContract;
};
