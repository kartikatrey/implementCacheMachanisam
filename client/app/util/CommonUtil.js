import _ from "lodash";
import hash from "object-hash";
import DocumentService from "../idp/services/DocumentService";
import Constants from "@/resources/Constants";
import moment from "moment";

export function isInViewport(ele) {
    const element = document.querySelector(ele);
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

export function getQueryFilter() {
    let filter = {};
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const filterString = urlParams.get("filter");
        filter = JSON.parse(filterString || "{}");
    } catch (err) {
        filter = {};
    }
    return filter;
}

/**
 * Sets the table input class based on the selected field.
 * @param {object} selectedField - The selected field object.
 */
export function setTableInputClass(selectedField, tableName, isDialogField ) {
    const cid = DocumentService.createFieldCid(selectedField, tableName, isDialogField);
  
    // Find the element with the matching cid attribute
    let element = document.querySelector(`[cid="${cid}"]`);
  
    // Remove 'input-border' class from all elements with the class
    const allElementsWithClasses = document.querySelectorAll('.input-border');
    allElementsWithClasses.forEach(ele => {
      ele.classList.remove('input-border');
    });
  
    // Remove 'input-error-border' class from all elements with the class
    const allElementsWithErrorClasses = document.querySelectorAll('.input-error-border');
    allElementsWithErrorClasses.forEach(ele => {
      ele.classList.remove('input-error-border');
    });
  
    let className = "";
  
    // Determine the appropriate class based on the presence of validation messages
    if (_.size(selectedField.validationMsgs) > 0) {
      className = "input-error-border";
    } else {
      className = "input-border";
    }
  
    // Add the class to the selected element
    element.classList.add(className);
  }

export function getCardBrandIconUrl(cardBrand) {
    let brandURLMapping = {
        "Visa": "https://js.stripe.com/v3/fingerprinted/img/visa-365725566f9578a9589553aa9296d178.svg",
        "MasterCard": "https://js.stripe.com/v3/fingerprinted/img/mastercard-4d8844094130711885b5e41b28c9848f.svg",
        "American Express": "https://js.stripe.com/v3/fingerprinted/img/amex-a49b82f46c5cd6a96a6e418a6ca1717c.svg",
        "Discover": "https://js.stripe.com/v3/fingerprinted/img/discover-ac52cd46f89fa40a29a0bfb954e33173.svg",
        "JCB": "https://js.stripe.com/v3/fingerprinted/img/jcb-271fd06e6e7a2c52692ffa91a95fb64f.svg",
        "Diners Club": "https://js.stripe.com/v3/fingerprinted/img/diners-fbcbd3360f8e3f629cdaa80e93abdb8b.svg",
        "UnionPay": "https://js.stripe.com/v3/fingerprinted/img/unionpay-8a10aefc7295216c338ba4e1224627a1.svg"
    }
    return brandURLMapping[cardBrand];
}

export function capitalize(string) {
    string = string.toLocaleLowerCase();
    const arrOfString = string.split(" ");
    for (var i = 0; i < arrOfString.length; i++) {
        arrOfString[i] = arrOfString[i].charAt(0).toUpperCase() + arrOfString[i].slice(1);
    }
    return arrOfString.join(" ");
}

export function isArrayContainsArrayElement(array1,array2){
    return array1.some(r=> array2.includes(r))
}

export function isFieldPresentInPrediction(documentData,fieldName) {
    try {
        const fieldPrediction = _.find(documentData.prediction, (item) => { return item.name == fieldName });
        if (fieldPrediction && fieldPrediction.value) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

export function isLineFieldPresentInPrediction(documentData,fieldName) {
    try {
        let table = _.find(documentData.prediction, (item) => { return item.name == "table" });
        let rows =(table && table.content &&  table.content.rows) || [];
        if (rows.length==0) {
            return false;
        }
        for (let index = 0; index < rows.length; index++) {
            const fieldPrediction = _.find(rows[index], (item) => { return item.name == fieldName });
            if (fieldPrediction && fieldPrediction.value) {
                return true;
            }
        }
    } catch (e) {
        return false;
    }
}

export function capitalizeFirstLetter(string){
    let words = string.split(" ");
    words = words.map((word) => {
        return word[0].toUpperCase() + word.substring(1).toLowerCase();
    }).join(" ");
    return words;
}

export function docTypeLabelMapping(docType){
    const docTypeLabelMapping = {
        "invoice": "Invoice",
        "po": "Sales Order",
        "insurance": "Insurance",
        "summary": "Summary",
        "quote": "Quote",
        "claim_image": "Claim Image",
        "meter_reading": "Meter Reading",
        "trade_confirm": "Trade Confirm",
        "kyb": "KYB",
        "sov": "sov",
        "vendor_onboarding": "Vendor Onboarding",
        "insurance_quotation": "Insurance Quotation",
    }
    return docTypeLabelMapping[docType]
}

export function formatToCurrency(currencyType, value){
    return Intl.NumberFormat('en-US', { style: 'currency', currency: currencyType, notation: "compact", maximumFractionDigits: 1}).format(value);
}

export function formatToUSDCurrency(value){
    return formatToCurrency("USD", value);
}



  export function  generateHash(obj) {
    if (typeof obj === 'object') {
      // sort object by key name
      obj = Object.keys(obj).sort().reduce((a, c) => (a[c] = obj[c], a), {});
    }
    obj = JSON.stringify(obj)
    return hash(obj);
};

/**
 * Flattens an object by converting nested properties into a flat structure.
 * If a property is an array, it iterates over its elements and adds them to the root level object.
 * @param {Object} data - The object to flatten.
 * @returns {Object} - The flattened object.
 */
export function flattenObject(data) {
    const flattened = {};
    function flatten(obj, prefix = '') {
      for (const key in obj) {
        if (Array.isArray(obj[key])) {
          // If the property is an array, iterate over its elements
          // and call flatten with key as prefix and '__SEPARATOR__' added to the prefix.

          obj[key].forEach((item, index) => {
            flatten(item, `${key}__SEPERATOR__`); // Adding group key as seperator 
          });
        } else {
          // Add the key-value pair to the flattened object with the prefix.
          flattened[`${prefix}${key}`] = obj[key];
        }
      }
    }
  
    // Start the flattening process.
    flatten(data);
  
    return flattened;
  }

  /**
 * Converts a flattened object to its unflattened representation.
 * @param {Object} flattened - The flattened object to be unflattened.
 * @returns {Object} - The unflattened object.
 */
export function unflattenObject(flattened) {
    const unflattened = {};

    // Iterate over each key in the flattened object
    for (const key in flattened) {
        // Split the key into parts using the '__SEPERATOR__' separator
        const parts = key.split('__SEPERATOR__');
        let current = unflattened;

        // Traverse through the parts of the key to build the nested structure
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];

            // Create nested objects if they don't exist
            if (!current[part] || typeof current[part] !== 'object') {
                current[part] = {};
            }

            // Move to the next nested object
            current = current[part];
        }

        // Assign the value to the final key in the nested structure
        current[parts[parts.length - 1]] = flattened[key];
    }

    // Return the unflattened object
    return unflattened;
}
export function renderUserSelectedTheme(theme) {
    if (theme === Constants.DOCEX.THEMES.DARK) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
};

/**
 * Calculates start date for current year
 * UseCases- 
 * 
 * // Example with a date before today in the current year
 * Suppose, if startDate = '15-06-2022'
 * Calculate start date for the current year,then it would be startDateWithCurrentYear = '15-06-2023'
 * If startDateWithCurrentYear is before 'today' then, function would return same 'startDateWithCurrentYear'
 * So,here function would return '15-06-2023' as startDate
 *  
 * // Example with a date after today in the current year
 * Suppose, if startDate = '22-09-2021'
 * Calculate start date for the current year,then it would be startDateWithCurrentYear = '22-09-2023'
 * If startDateWithCurrentYear is after 'today' then, 
 * function would return a date year before startDateWithCurrentYear as 'subsDateWithPastYear' = '22-09-2022'
 * So,here function would return '22-09-2022' as startDate
 * 
 */
export function getStartDateForCurrentYear(startDate){
    if(!startDate){
        return startDate;
    }
    const today = moment();
    
    // Calculate start date in current year
    const currentYear = moment().year();
    const startDateWithCurrentYear = moment(startDate).set('year', currentYear);
      
    // Compare date after 1 year with today's date
    if (startDateWithCurrentYear.isAfter(today)) {
      const startDateWithPastYear = startDateWithCurrentYear.clone().subtract(1, 'year');
      startDate = startDateWithPastYear;
    } else {
      startDate = startDateWithCurrentYear;
    }
    //Covert startDate to date format as startDate was in moment form
    return moment(startDate).toDate();
}

// Get active/inactive Status column template for list view
export function getStatusBadge(props) {
    const statusMap = {
        true :  `<div cid="${'row-' + props.column.field + '-' + props.index}" class="el-badge mark"><sup class="badge-active">Active</sup></div>`,
        false :  `<div cid="${'row-' + props.column.field + '-' + props.index}" class="el-badge mark"><sup class="badge-pending">Inactive</sup></div>`
    }
    let htmlTemplate = statusMap[props.row.active];
    return htmlTemplate;
}

// Checks if the input is an array and every element of the array is non-object.
export function isPlainArray(array) {
    return Array.isArray(array) && _.every(array, item => !_.isObject(item));
}

export function appendTimestampToFileName(fileName) {
    // Extract file extension (assuming the extension comes after the last dot)
    const [nameWithoutExtension, extension] = _.split(fileName, '.');

    // Generate timestamp in the format DD-MM-YYYY_HH-M
    const timestamp = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).replace(/\//g, '-').replace(/, /g, '_').replace(/:/g, '-');

    // Construct the new file name using _.join
    const newFileName = _.join([nameWithoutExtension, '__', timestamp, '.', extension], '');
    return newFileName;
}