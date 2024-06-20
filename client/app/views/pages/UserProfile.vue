<template>
    <el-main class="kp-main">
        <section class="page-body">

            <div class="page-title">
                <span class="page-title-text">Profile</span>
            </div>

            <section class="form-page-container" v-loading="loader">
                <div class="panel">
                    <div class="panel-body">
                        <el-form label-position="left" :model="form" :rules="formRules" ref="form" label-width="150px">
                            <ConfirmModel ref="model"></ConfirmModel>
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="full_name" label="Name">
                                            <el-input v-model="form.full_name" required=true></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="email" label="Email">
                                            <el-input v-model="form.email" disabled></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="contact" label="Contact">
                                            <el-input v-model="form.contact"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="selected_theme" label="Theme">
                                            <el-select v-model="form.selected_theme" class="select-box" placeholder="Select Theme" >
                                                <el-option v-for="(item, index) in themes" 
                                                :key="item.value" 
                                                :label="item.label" 
                                                :value="item.value" label-width="170px"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <!-- change password -->
                            <div class="change-pws-container" v-if="!showChangePwBtn">
                                <el-row :gutter="40">
                                    <el-col :span="12">
                                        <div class="kp-form-group">
                                            <el-form-item prop="new_password" label="New password">
                                                <el-input class="b-rad-4" v-model="form.new_password" type="password" auto-complete="off">
                                                </el-input>
                                                <span :style="{ color: errorMessageColor }" v-if="errorMessages.passwordErrorMessage">
                                                    <!-- Check if errorMessages.passwordErrorMessage is an array and not empty -->
                                                    <template v-if="Array.isArray(errorMessages.passwordErrorMessage) && errorMessages.passwordErrorMessage.length > 0">
                                                        <div v-for="(errorMessage, index) in errorMessages.passwordErrorMessage" :key="'new_pass_msg_'+index">
                                                            <span>{{ errorMessage }}</span>
                                                            <br> <!-- Add a line break after each error message -->
                                                        </div>
                                                    </template>
                                                    <!-- If it's not an array and not empty, render it as a single string -->
                                                    <template v-else-if="errorMessages.passwordErrorMessage.length">
                                                        {{ errorMessages.passwordErrorMessage }}
                                                    </template>
                                                </span>
                                            </el-form-item>
                                        </div>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="40">
                                    <el-col :span="12">
                                        <div class="kp-form-group">
                                            <el-form-item prop="confirm_password" label="Confirm password">
                                                <el-input class="b-rad-4" v-model="form.confirm_password" type="password" auto-complete="off"></el-input>
                                                 <span :style="{ color: errorMessageColor }" v-if="errorMessages.confirmPasswordErrorMessage">{{ errorMessages.confirmPasswordErrorMessage }}</span>
                                            </el-form-item>
                                        </div>
                                    </el-col>
                                </el-row>
                            </div>
                            <!-- // change password -->

                            <el-row :gutter="40">
                                <el-col :span="12" >
                                    <div class="kp-form-group" style="padding-left: 150px;">
                                        <el-button v-if=" isChangePwBtnVisible()" v-on:click="isChangePasswordClick()" size="small" >Change Password</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                            

                            <!-- // cancel change password -->

                            <el-row :gutter="40">
                                <el-col :span="12" >
                                    <div class="kp-form-group" style="padding-left: 150px;">
                                        <el-button v-if="!showChangePwBtn" v-on:click="handleCancelBtnClick()" size="small" >Cancel</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                          
                        <div v-show="!isVendorUser()">
                            <div class="grouping-divide"></div>
                            <div class="grouping-tile">Delegation</div>
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group user-profile-icons">
                                        <el-form-item class="control-label col-sm-2" prop="user" label="User">
                                            <el-select v-model="form.delegate.user" class="select-box"
                                                cid="user-form-delegate_user-select" clearable
                                                placeholder="Select Delegate User">
                                                <el-option v-for="(_delegate_user, index) in delegateUserList"
                                                    :cid="'user-form-policies_' + index" :key="_delegate_user.value"
                                                    :label="_delegate_user.label" :value="_delegate_user.value"
                                                    label-width="170px"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group user-profile-icons">
                                        <el-form-item label="Start Date" class="control-label col-sm-2"
                                            prop="start_date">
                                            <el-date-picker type="date" placeholder="Pick Start Date"
                                                v-model="form.delegate.start_date" style="width: 100%;" :picker-options="pickerOptions" value-format="yyyy-MM-dd" default-time="00:00:00">
                                            </el-date-picker>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <el-col :span="12">
                                    <div class="kp-form-group user-profile-icons">
                                        <el-form-item label="End Date" class="control-label col-sm-2" prop="end_date">
                                            <el-date-picker type="date" placeholder="Pick End Date"
                                                v-model="form.delegate.end_date" style="width: 100%;" :picker-options="pickerOptions" value-format="yyyy-MM-dd" default-time="00:00:00"
></el-date-picker>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>

                        </el-form>
                    </div> <!-- | panel body -->
                    <footer>
                        <div></div>
                        <el-row :gutter="40">
                                <el-col :span="12" >
                                    <div class="kp-form-group" style="padding-left: 150px;">
                                        <el-button v-if="showClearCacheBtn" v-on:click="clearCache()" size="small">Clear Cache</el-button>
                                    </div>
                                </el-col>
                            </el-row>
                        <div>
                            <el-button size="small" v-on:click="onSave" :key="buttonKey" type="primary">Save</el-button>
                        </div>
                    </footer>
                </div> <!-- | panel  -->
            </section> <!-- | form-page-container -->


      

        </section>
    </el-main>
</template>

<script>
import CommonService from "@/services/CommonService";
import UserServices from "@/idp/services/UserService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import EventBus from "@/EventBus";
import {renderUserSelectedTheme} from '@/util/CommonUtil';
import _ from "lodash";

export default {
    name: "UserProfile",
    components: {
        ConfirmModel
    },
    data() {
        return {
            showClearCacheBtn: false,
            loader: false,
            labelPosition: "top",
            isFormValid: true,
            showError: false,
            showChangePwBtn: true,
            isChangePwBtnClicked:false,
            errorMessages : {},
            errorMessageColor: "red",
            authType : '',
            form: {
                full_name:"",
                contact:"",
                email:"",
                selected_theme:"light",
                confirm_password:"",
                new_password:"",
                delegate: this.getDelegateUserObject(),
            },
            delegateUserList: [],
            themes:[
                { value: 'light', label: 'Light' },
                { value: 'dark', label: 'Dark' },
            ],
            dateFormats: constants.DATE_FORMATS,
            buttonKey: 1,
            endpoint: constants.CP_USER_ENDPOINT,
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false
            },
            editorOptions: {
                mode: "text/javascript",
                theme: "default",
                value: "{}"
            },
            formRules: {
                full_name: [{
                    required: true,
                    message: "Please enter name",
                    trigger: "change"
                }],
            },
            pickerOptions: {
                /*
                    Determines if a date should be disabled based on whether it is before the current date.
                    Subtracting 8.64e7 (number of milliseconds in a day) ensures dates earlier than today are disabled.
                */
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            }
        };
    },
    methods: {
        isChangePwBtnVisible() {
            return this.showChangePwBtn && this.authType != constants.AUTH_TYPES.SAML;
        }, 
        async clearCache() {
            try {
                const response = await UserServices.clearCache();
                if (response) {
                    this.notifySuccess('Cache cleared successfully');
                }
            } catch (error) {
                this.notifyError(" Failed to clear cache. Please try again later");
            }
        },
        isChangePasswordClick(){
            this.showChangePwBtn = !this.showChangePwBtn;
            this.isChangePwBtnClicked = true
        },
        handleCancelBtnClick(){
            this.showChangePwBtn = true
            // Reset password fields when canceling
            this.form.new_password = "";
            this.form.confirm_password = "";
            this.errorMessages = {}; // on cancel removing error messages.
        },
        async onSave() {
            try {
                let valid = await this.$refs.form.validate().catch((error) => {
                    this.notifyError('Please fill the correct details');
                });
                if (!valid) {
                    return;
                }
                this.cacheDataModal.isFormEdited = false;
                this.loader = true;
                this.errorMessages.passwordErrorMessage = "";
                this.errorMessages.confirmPasswordErrorMessage = "";
                let formResponse = await CommonService.save(this.endpoint, this.form)
                if (!_.isEmpty(formResponse.data && formResponse.data.data && formResponse.data.data.errorMessages)) {
                    const data = formResponse.data.data.errorMessages;
                    this.errorMessages.passwordErrorMessage = data.passwordErrorMessage;
                    this.errorMessages.confirmPasswordErrorMessage = data.confirmPasswordErrorMessage;
                    this.loader = false;
                    return;
                }
                if (formResponse && formResponse.data) {
                    if (formResponse.data._id) {
                        this.form = formResponse.data;
                        this.$store.commit('setSelectedTheme', this.form.selected_theme);
                        localStorage.setItem("kanverse_theme", this.form.selected_theme); //to set the editor theme according to the user's preference. 
                        renderUserSelectedTheme(this.form.selected_theme);
                        this.notifySuccess("User profile updated successfully");
                    } else {
                        this.notifyError(formResponse.data.message);
                    }
                }
                this.reset();
            }catch(e){
                this.loader = false;
                this.notifyError("Error while updating user data");
                console.log(e)
            }
        },
        getDelegateUserObject() {
            return {
                user: "",
                start_date: new Date(),
                end_date: new Date(),
            };
        },
        async fetchDelegateUser() {
            try {
                const columns = ["full_name","email"]
                const delegateuser = await UserServices.fetch({ active: true, },columns);
                if(_.isArray(delegateuser)){
                    this.delegateUserList = (delegateuser || []).map((role) => {
                        return { value: "" + role.email, label: "" + role.full_name };
                    });
                }
            } catch (e) {
                console.error(e);
            }
        },
        reset(){
            this.loader = false;
            this.isChangePwBtnClicked = false;
            this.showChangePwBtn = true;
            console.log("reset")
        },
        async init() {
            const user = this.$store.getters.user;
            this.authType = user && user.auth_type || "";
            const userRole = user && user.roles
            if(userRole && userRole.includes(constants.DOCEX.ROLES_MAP.IDP_ADMIN)){
                this.showClearCacheBtn = true;
            }
            let params = {
                email: user.email
            }
            this.loader = true;
            let response = await CommonService.fetchRecord(this.endpoint, params)
            this.form =
                (response && _.defaultsDeep(response[0], this.form)) || this.form;
            this.cacheDataModal.cachedForm = _.cloneDeep(this.form);
            this.loader = false;
        },
    },
    async beforeMount() {
        await this.init();
        this.fetchDelegateUser();
        // window.addEventListener("beforeunload", event => {
        //     if (!this.cacheDataModal.isFormEdited) return;
        //     event.preventDefault();
        //     event.returnValue = "";
        // });

        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",false);
    },
    // beforeRouteLeave: function (to, from, next) {
    //     if (this.cacheDataModal.isFormEdited) {
    //         //    return window.confirm('Do you really want to leave? you have unsaved changes!')
    //         return this.$refs.model.open(next);
    //     } else {
    //         return next();
    //     }
    // }
};
</script>

<style lang="scss">
// @import "../_idpGlobal";
@import "../../idp/_idpGlobal";
.pwd-btn {
    height: 30px;
    padding-top: 7px;
    position: relative;
    top: 20px;
}

.user-profile-icons{
    .el-input__icon{
        line-height: inherit !important;
        padding-top: 2.5px;
    }
}
</style>
