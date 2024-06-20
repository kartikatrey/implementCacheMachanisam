let constants = {};
import _ from "lodash";



constants.QNA_API_ENDPOINT = "/portal/api/qna-data"
constants.CUSTOMER_ONBOARDING_ENDPOINT = "/portal/api/customer-onboarding"
constants.CP_USER_ENDPOINT = "/portal/api/table/cp_user";
constants.CUSTOMER_REGISTRATION_ENDPOINT = "/portal/api/table/customer_registration";
constants.PAYMENT_PUBLISHABLE_KEY = process.env.PAYMENT_PUBLISHABLE_KEY || "pk_test_51GxAZIHCScu8XKgeayiq1916Hr1S7Hkvebno3V48362ImMphmJzH9bcmy7WpDgIAj514vKyOsID7s4BYWnUCAC8q00Njg7h9rD";
constants.CUSTOMER_CATALOGUE_ENDPOINT="/portal/api/table/product_catalogue";

export default constants;
