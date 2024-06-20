import AjaxService from "@/services/AjaxService";
import store from "@/store/store";
import _ from "lodash";
import Constants from "@/resources/Constants";

export default class UserService {

    constructor() { }

    static getLoggedInUserInfo() {
        console.log("inside getLoggedInUserInfo==========")
        return new Promise((resolve, reject) => {
            AjaxService.getJson("/portal/api/logged-in-user-info", {}, (error, response) => {
                return error ? reject(error) : resolve(response.data)
            })
        })
    }

    static routeUserAfterLogin(user) {
        store.commit("setSelectedTheme", _.get(user, "selected_theme", Constants.DOCEX.THEMES.LIGHT));
        store.commit("setUser", user);
        store.commit("setShowApptour", true);
        console.log("in routeUserAfterLogin===========")
        // localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("qnaChild", "");
        localStorage.setItem("qnaChildId", "");
        localStorage.setItem("customerName", "");
        store.commit("setImpersonate", false);
        // Redirect to orignial url after successfull authentication
        const urlParams = new URLSearchParams(window.location.search);
        const rURL = urlParams.get("rURL");
        // if (rURL) return window.location.replace(rURL);
        if (rURL) {
            if (rURL.includes("portal/api/storage-files"))
                window.open(rURL);
            else if(_.includes(user.roles, "ap_contributor"))
                window.location.replace("/idp/document/invoice");
            else
                return window.location.replace(rURL);
        }
        // For QNA customer show Digital assistance list on login
        if (user.roles.includes("qna"))
            return window.location.replace("/digital-assistant-list");
        // For IDP user route to IDP Dashboard

        // const isIdpUser = this.isIdpUser();
        console.log("re routing from routeUserAfterLogin============")
        // if (!(_.includes(user.roles, "customer") || _.includes(user.roles, "admin")) && isIdpUser){
            if(this.isTryItUser() || _.includes(user.roles, "ap_contributor")){
                return window.location.replace("/idp/document/invoice");
            }
            return window.location.replace("/app/idp");
        // }
        // For other than IDP user route to default Dashboard
        // return window.location.replace("/app");
    }
    static isIdpUser() {
        const userRoles = _.get(store, 'getters.user.roles', []);
        const roles = [
            Constants.DOCEX.ROLES_MAP.IDP_REVIEWER,
            Constants.DOCEX.ROLES_MAP.IDP_PUBLISHER,
            Constants.DOCEX.ROLES_MAP.IDP_PUBLISHER_ONLY,
            Constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN,
            Constants.DOCEX.ROLES_MAP.IDP_APPROVER,
            Constants.DOCEX.ROLES_MAP.IDP_ADMIN,
            Constants.DOCEX.ROLES_MAP.IDP_REVIEWER_ONLY,
            Constants.DOCEX.ROLES_MAP.IDP_VENDOR

        ]
        return roles.some(role => userRoles.includes(role));

    }
    static isIdpAdmin() {
        const userRoles = _.get(store, 'getters.user.roles', []);
        return _.includes(userRoles, "idp_admin");
    }
    static isTryItUser() {
        const user = _.get(store, 'getters.user', {});
		return user.customer_id == Constants.DOCEX.TRY_IT.CUSTOMER_ID;
    }
    static isSystemAdmin() {
        const userRoles = _.get(store, 'getters.user.roles', []);
        return _.includes(userRoles, "admin")
    }
    static getRouteParamForIdpDashboard() {
        let routeParam = true;
        const isImpersonate = store.getters.isImpersonate;
        const user = store.getters.user;
        if(this.isTryItUser()){
            routeParam = { name: "no-access-dashboard" };
            return routeParam;
        }
        if(user.is_vendor_user){
            routeParam = { name: "vendor-dashboard" };
            return routeParam;
        }
        const isIdpAdmin = this.isIdpAdmin();
        if (isIdpAdmin && !isImpersonate) {
            routeParam = { name: "idp-admin-dashboard" };
        } else if (!(_.includes(user.roles, "admin")) && this.isIdpUser()) {
            routeParam = { name: "operations-dashboard" };
        }
        return routeParam;
    }
    static getRouteParamForTryItUser(currentRoute){
        let routeParam = currentRoute;
        if(this.isTryItUser()){
            routeParam = { name: "idp_invoice_list" };
        }
        return routeParam;
    }
}
