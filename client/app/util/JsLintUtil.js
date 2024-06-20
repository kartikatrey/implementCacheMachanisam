// import { JSHINT } from 'jshint';

var _ = require('lodash');
export default class JsLintUtil {
   
	static validateScript(value) {
        return new Promise((resolve, reject) => {
           
            JSHINT(value,{}, { jQuery: false })
            // var errors = JSHINT.data().errors;
            let errors=[]
            _.forEach(JSHINT.data().errors,(err) => {
                if(err.code.startsWith('E')){
                    errors.push(err)
                 }
                
            });
            console.log("errors in script are::",errors)
            if(errors.length>0){
             reject(errors);
             return;
            }
          resolve(true);
        })
    }
}
