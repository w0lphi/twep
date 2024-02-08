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

function convertSnakeToCamel(obj) {
    const camelCaseObj = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let camelCaseKey = key.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
            // Special case for 'purchase_date'
            if (camelCaseKey === 'PurchaseDate') {
                camelCaseKey = 'purchase_date';
            }
            camelCaseObj[camelCaseKey] = obj[key];
        }
    }
    return camelCaseObj;
}



module.exports = {
    convertKeysToCamelCase,
    snakeCaseToCamelCase,
    convertSnakeToCamel,
};
