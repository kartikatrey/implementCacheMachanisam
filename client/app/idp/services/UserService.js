import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";
import TableAPIService from "@/services/TableAPIService";
import store from "@/store/store";
import _ from "lodash";
export default class FieldService {

	static getPolicies(params, projection) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.addSelectColumns(projection);
			tableAPI.find(constants.DE_POLICY_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static getRoles(params, projection) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(params);
			tableAPI.addSelectColumns(projection);
			tableAPI.find(constants.CP_ROLE_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	
	static saveUser(userData) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.upsert(constants.CP_USER_ENDPOINT, userData, (error, response) => {				
				if (error || (!response || !response.data || !response.data._id)) {
					let errorMessage = ''
					if(response && response.data && response.data.data && response.data.data.errorMessages) {
						return resolve(response.data);
					}
					//error code 11000 is returned when the duplicate record is being created, based on the database index 
					// or we check in cp_user table if user exists or not if exist then we sends 400 status code
					if(_.get(response, "data.code") == 11000 || _.get(response, "data.status") == 400)
						errorMessage = response.data.message;
					else 
						errorMessage = error || _.get(response, "data.message", "Error while saving user data");
					return reject(errorMessage);
				}
				resolve(response.data);
			})
		})
	}

	static fetchById(id, projection) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addSelectColumns(projection);
			tableAPI.findById(constants.CP_USER_ENDPOINT, id, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	
	static getUserEmails(params) {
		return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/user-email", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response)
            })
		});   
	}
	
	static getUserFromStore(){
		let user = store.getters.user;
		return user;
	}

	static commitUserInStore(user){
		store.commit("setUser", user);
	}

	static getUserPreferencesFromStore(preferenceType){
		let userPreferences = preferenceType ? _.get(store.getters.user.preferences, preferenceType) : store.getters.user.preferences;
		return userPreferences;
	}

	static commitUserPreferencesInStore(preference_type, updatePreferanceData){
		let user = store.getters.user;
		!user.preferences && (user.preferences = {});
		_.set(user.preferences, preference_type, updatePreferanceData)
		store.commit("setUser", user);
	}

	static updateUserPreference(payload) {
		return new Promise((resolve, reject) => {
			AjaxService.putJson("/portal/api/user-preferences", payload, (error, response) => {
				error ? reject(error):resolve(response.data)
			})
		});
	}
	
	static fetch(query, selectedColumn=[]) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addQuery(query);
			tableAPI.addSelectColumns(selectedColumn)
            tableAPI.find(constants.CP_USER_ENDPOINT, (error, response) => {
                  error ? reject(error) : resolve(response);
             });
        })
    } 

	static updateUserGroup(payload) {
        return new Promise((resolve, reject) => {
            AjaxService.putJson('/portal/api/user-detail', payload, (error, response) => {
                return error ? reject(error) : resolve(response)
            })
        })
    }

	static fetch(query={}, selectedColumn=[]) {
        return new Promise((resolve, reject) => {
            let tableAPI = new TableAPIService();
            tableAPI.addQuery(query);
			tableAPI.addSelectColumns(selectedColumn)
            tableAPI.find(constants.CP_USER_ENDPOINT, (error, response) => {
                  error ? reject(error) : resolve(response);
             });
        })
    } 
	// Removed user domain dependancy
	// static getDomains(params) {
	// 	return new Promise((resolve, reject) => {
	// 		AjaxService.getJson("/portal/api/idp-domain-role", params, (error, response) => {
	// 			if (error) {
	// 				reject(error);
	// 				return;
	// 			}
	// 			resolve(response.data)
	// 		})
	// 	})
	// }

	static loginWithLocalStrategy(userData){
		return new Promise((resolve, reject) => {
            AjaxService.postJson("/auth/local", userData, (error, response) => {
				return error ? reject(error) : resolve((response && response.data.data) || '')
            })
		});
	}

	static validateEmailOtp(params){
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/auth/mfa/verify-otp", params, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
        })
    }


    static sendEmailOtp(user={}){
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/auth/mfa/send-email-otp", user, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
        })
       
    }
    
    static validateAuthenticatorMFACode(params){
            return new Promise((resolve, reject) => {
                AjaxService.postJson("/auth/mfa/verify-otp", params, (error, response) => {
                    return error ? reject(error) : resolve(response.data)
                })
            })
        
    }

	static sendActivationLink(params){
		return new Promise((resolve, reject) => {
			AjaxService.postJson("/portal/api/user/activation", params, (error, response) => {
				return error ? reject(error.response.data.error) : resolve(response.data);
			})
		})
	}
	static clearCache(){
		return new Promise((resolve, reject) => {
			AjaxService.getJson("/api/clear-cache", {}, (error, response) => {
				return error ? reject(error) : resolve(response);
			})
		})
	}
}
