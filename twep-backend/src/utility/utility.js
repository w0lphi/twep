// Utility function to convert keys to CamelCase
function convertKeysToCamelCase(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertKeysToCamelCase(item));
    }

    const camelCaseObj = {};
    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const camelCaseKey = snakeCaseToCamelCase(key);
            camelCaseObj[camelCaseKey] = convertKeysToCamelCase(obj[key]);
        }
    }

    return camelCaseObj;
}

// Utility function to convert snake_case to camelCase
function snakeCaseToCamelCase(str) {
    return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

module.exports = {
    convertKeysToCamelCase,
    snakeCaseToCamelCase,
};
