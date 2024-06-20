import _ from "lodash"
let jsonpath = require("jsonpath");
const esprima = require("esprima");

module.exports = {
	/*
	 * scriptValidator method to validate script
	 * params :- rule,value, callback
	 */
	  scriptValidator: async function (rule, value, callback) {
      try {
        if(!value)return;
        const parsedCode = esprima.parseScript(value);
          callback()
      }catch (error) {
          rule.message = error;
          callback(error)
      }
		},

    emailValidator: async function (rule, value, callback) {
        let isValid=true;
        let errorMsg="";
        if(rule && rule['required'] && !value){
		    return callback(new Error("Please input email"))
        }
        const emailList = value.split(",");
        const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        for(const email of emailList){
            isValid =regexEmail.test(String(email.trim()).toLowerCase());
            if(!isValid){
                break;
            }
        }
        if(rule && rule['allowEmpty'] && !value){
		    return callback()
        }
        return isValid ? callback() :callback(new Error("Invalid email"));
    },

    EmptyValueValidator :   (rule, value, callback)=>{
        if (value && ("" + value).trim() === "") {
            callback(new Error("Please enter valid label name"));
        } else {
            callback();
        }
    },

    validateZipCode: (rule, value, callback) => {
      if (!value || ("" + value).trim() === "") {
        callback(new Error("Please enter zip code"));
        return;
      }
      let valid = true;
      if (value.length < 5 || value.length > 10) {
        valid = false
      }
      valid ? callback() : callback(new Error("Please enter zip code with length between 5 to 10 digits"));
    },

    QueryBuilderValidator : (rule, value, callback) => {
        if (!value || (value && (!value.children || !value.children.length))) {
          callback();
          return;
        }
        let operatorsToExclude = ["is empty", "is not empty"];
        let rulesInFieldCondition = jsonpath.query(
          value,
          '$..children[?(@.type=="query-builder-rule")].query'
        );
        if (!rulesInFieldCondition.length) {
          callback(new Error("Rules not found in the provided condition."));
          return;
        }
        //check if rules have operator other than "is empty"and "is not empty" and have no value
        let rulesWithNullVal = _.filter(rulesInFieldCondition, (obj) => {
          return (
            !_.includes(operatorsToExclude, obj.operator) && obj.value == null
          );
        });
        if (rulesWithNullVal.length) {
          callback(
            new Error(
              `Values in rules cannot be empty for operators other than "is empty"and "is not empty".`
            )
          );
          return;
        }
        //check if rules have operator "is empty" or "is not empty" and have some value
        let rulesWithVal = _.filter(rulesInFieldCondition, (obj) => {
          return _.includes(operatorsToExclude, obj.operator) && obj.value;
        });
        if (rulesWithVal.length) {
          callback(
            new Error(
              `Values provided in rules for operators "is empty"and "is not empty".`
            )
          );
          return;
        }
        callback();
      }
};



