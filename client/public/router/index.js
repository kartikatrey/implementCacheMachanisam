import Vue from "vue";
import Router from "vue-router";

//pages
import Login from "../views/pages/authentication/Login.vue";
import VendorLogin from "../views/pages/authentication/VendorLogin.vue";
import Register from "../views/pages/authentication/Register.vue";
import ForgotPassword from "../views/pages/authentication/ForgotPassword.vue";
import VendorForgotPassword from "../views/pages/authentication/VendorForgotPassword.vue";
import TryItRegister from '../views/pages/authentication/TryItRegister.vue'
import TryItOTP from '../views/pages/authentication/TryItOTP.vue'
import RegisterCustomer from "../views/pages/RegisterCustomer.vue"
import NotFound from "../views/pages/NotFound.vue";
import TooManyTryRequests from "../views/pages/TooManyTryRequests.vue";
import SignUp from "../views/pages/authentication/SignUp.vue";

import Approval from "../views/pages/Approval.vue";
import OTP from "../views/pages/Otp.vue";
//ui
import store from "../store";
import layouts from "../layout";

Vue.use(Router);


const router = new Router({
	mode: "history",
	routes: [{
		path: "/",
		name: "login",
		component: Login,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/login",
		name: "login",
		component: Login,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/vendor/login",
		name: "vendor-login",
		component: VendorLogin,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/register",
		name: "register",
		component: Register,
		meta: {
			layout: layouts.contenOnly4
		}
	},
	{
		path: "/sign-up",
		name: "sign-up",
		component: SignUp,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/register-customer",
		name: "register-customer",
		component: RegisterCustomer,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/forgot-password",
		name: "forgot-password",
		component: ForgotPassword,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/vendor/forgot-password",
		name: "vendor-forgot-password",
		component: VendorForgotPassword,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/try-it-register",
		name: "try-it-register",
		component: TryItRegister,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/try-it-otp",
		name: "try-it-otp",
		component: TryItOTP,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/too-many-try-requests",
		name: "too-many-try-requests",
		component: TooManyTryRequests,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/process-approval",
		name: "approval",
		component: Approval,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/auth/request-form",
		name: "OTP",
		component: OTP,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "/logout",
		beforeEnter(to, from, next) {
			auth.logout();
			next({
				path: "/login"
			});
		}
	},
	{
		path: "/app*",
		name: "app",
		component: Login,
		meta: {
			layout: layouts.contenOnly
		}
	},
	{
		path: "*",
		name: "not-found",
		component: NotFound,
		meta: {
			layout: layouts.contenOnly
		}
	}
	]
});


//insert here login logic
const auth = {
	loggedIn() {
		return store.getters.isLogged;
	},
	logout() {
		store.commit("setLogout");
	}
};

router.afterEach((to, from) => {
	setTimeout(() => {
		store.commit("setSplashScreen", false);
	}, 500);
});

export default router;