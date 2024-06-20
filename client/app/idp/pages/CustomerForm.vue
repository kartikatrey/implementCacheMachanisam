<template>
    <el-main class="kp-main slushbucket_container">
        <section class="page-body">
            <div class="page-title" v-if="form._id">
                <el-button cid="form-header-back" v-on:click="$router.push('/idp/customer-list')"
                    icon="mdi mdi-arrow-left-circle-outline"></el-button>
                <span class="page-title-text">Edit {{pageTitle}}</span>
            </div>

            <div class="page-title" v-else>
                <el-button cid="form-header-back" v-on:click="$router.push('/idp/customer-list')"
                    icon="mdi mdi-arrow-left-circle-outline"></el-button>
                <span class="page-title-text">Add {{pageTitle}}</span>
            </div>
            <section v-loading="loading" class="form-page-container tabs-page-container">
                <div class="panel">
                    <div class="panel-body" v-loading="loading">
                        <el-form label-position="left" :model="form" ref="form" label-width="120px" :rules="formRules">
                            <el-tabs v-model="activeTab">
                                <el-tab-pane label="General" name="general">
                                    <div class="tab-body">
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <!-- <div class="kp-form-group">
                                                    <el-form-item class="control-label col-sm-2" prop="company_name"
                                                        label="Company name">
                                                        <el-input cid="company-form-name" class="form-control"
                                                            v-model="form.company_name" :rows="2"></el-input>
                                                    </el-form-item>
                                                </div> -->
                                            </el-col>

                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item class="control-label col-sm-2" prop="customer_name"
                                                        label="Customer name">
                                                        <el-input cid="company-form-name" class="form-control"
                                                            v-model="form.customer_name" :rows="2"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <!-- <div class="kp-form-group">
                                                    <el-form-item prop="email" label="Email">
                                                        <el-input v-model="form.email"
                                                            placeholder="E.g. headoffice@jadeglobal.com"></el-input>
                                                    </el-form-item>
                                                </div> -->
                                            </el-col>
                                            <el-col :span="12">
                                                <!-- <div class="kp-form-group">
                                                    <el-form-item prop="phone" label="Contact">
                                                        <vue-tel-input v-model="form.phone" :maxLen="17"
                                                            cid="user-form-phone" autocomplete="off" validCharactersOnly
                                                            @validate="onContactValidate"
                                                            invalidMsg="Please enter valid contact number"
                                                            defaultCountry="US"></vue-tel-input>
                                                    </el-form-item>
                                                </div> -->
                                            </el-col>
                                        </el-row>

                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item prop="address" label="Address">
                                                        <el-input name="address" v-model="form.address" type="textarea"
                                                            :rows="3" placeholder="Enter addresss"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item class="control-label col-sm-2" prop="domain"
                                                        label="Domain">
                                                        <el-input v-model="form.domain"></el-input>
                                                    </el-form-item>
                                                </div>
                                                <!-- <div class="kp-form-group">
                                                    <el-form-item class="control-label col-sm-2" prop="type"
                                                        label="Type">
                                                        <el-select v-model="form.type" placeholder="Select type">
                                                            <el-option v-for="item in typeList" :key="item.value"
                                                                :label="item.label" :value="item.value"></el-option>
                                                        </el-select>
                                                    </el-form-item>
                                                </div> -->
                                            </el-col>
                                        </el-row>

                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item prop="document_processing_limit"
                                                        label="Document processing limit">
                                                        <el-input v-model="form.document_processing_limit" type="number"
                                                            placeholder="E.g. 10"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item prop="billing_email" label="Billing email">
                                                        <el-input v-model="form.billing_email" type="email"
                                                            placeholder="E.g. headoffice@jadeglobal.com"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            </el-row>
                                            <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item prop="stage_change_event_allowed"
                                                        label="Web hook enable">
                                                        <el-checkbox v-model="form.stage_change_event_allowed">
                                                        </el-checkbox>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="Configuration" name="configuration">
                                    <div class="tab-body">
                                        <el-row :gutter="40">
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item class="control-label col-sm-2" prop="idp_share_name"
                                                        label="Share name">
                                                        <el-input cid="company-form-idp_share_name" class="form-control"
                                                            v-model="form.idp_share_name" :rows="2" placeholder="Enter share name Ex. demo"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item class="control-label col-sm-2" prop="share_size"
                                                        label="Share size">
                                                        <el-input cid="company-form-share_size" class="form-control"
                                                            v-model="form.share_size" :rows="2" placeholder="Enter size in GB. Ex. 1"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <!-- <el-form-item class="control-label col-sm-2" prop="allowed_ip_range" label="Ip range">
                                                        <el-input cid="company-form-allowed_ip_range" class="form-control" v-model="form.allowed_ip_range" :rows="2"></el-input>
                                                    </el-form-item> -->
                                                </div>
                                            </el-col>
                                        </el-row>
                                        <el-row :gutter="40">                                      
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item class="control-label col-sm-2" prop="timezone" label="Timezone">
                                                        <el-input cid="company-form-timezone" class="form-control" v-model="form.timezone" :rows="2" placeholder="Timezone - Asia/Kolkata"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                            <el-col :span="12">
                                                <div class="kp-form-group">
                                                    <el-form-item class="control-label col-sm-2" prop="process_email_threshold"
                                                        label="Process Email Threshold">
                                                        <el-input cid="company-form-process_email_threshold" class="form-control"
                                                            v-model="form.process_email_threshold" :rows="2" placeholder="0"></el-input>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="Admin user" name="admin_user">
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item class="control-label col-sm-2" prop="username" label="Admin username">
                                                    <el-input cid="company-form-username" @change="defaultEmail" class="form-control" v-model="form.username" :rows="2"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item class="control-label col-sm-2" prop="password"label="Admin password">
                                                    <el-input type="password" cid="company-form-password" class="form-control" v-model="form.password" :rows="2"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                               <el-form-item class="control-label col-sm-2" prop="default_email" label="Admin email">
                                                    <el-input readonly cid="company-form-default-email" class="form-control" v-model="form.default_email" :rows="2"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="kp-form-group">
                                                <el-form-item class="control-label col-sm-2" prop="admin_contact"label="Admin contact">
                                                    <vue-tel-input 
                                                        :maxLen="17"
                                                        cid="company-form-admin-contact" 
                                                        autocomplete="off" 
                                                        validCharactersOnly
                                                        v-model="form.admin_contact" 
                                                        :rows="2"
                                                        class="form-control"
                                                        @validate="onContactValidate"
                                                        invalidMsg="Please enter valid contact number"
                                                        defaultCountry="IN"
                                                    >
                                                    </vue-tel-input>
                                                </el-form-item>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </el-tab-pane>
                            </el-tabs>
                        </el-form>
                    </div>
                    <!-- Footer -->
                    <footer>
                        <div></div>
                        <div>
                            <el-button size="small" v-on:click="onBack">Cancel</el-button>
                        </div>
                        <div>
                            <el-button size="small" id="register-btn" v-on:click="onSave" type="primary">Save
                            </el-button>
                        </div>
                    </footer>
                </div>
            </section>
        </section>
    </el-main>
</template>
<script>

import _ from "lodash";
import Constants from "@/resources/Constants";
import EventBus from "@/EventBus";
import { VueTelInput } from "vue-tel-input";
import CustomerService from "@/idp/services/CustomerService";
import KsServerService from "@/idp/services/KsServerService";

export default {
    name:"CustomerForm",
    components: {
        VueTelInput, 
    },
    data(){
        let validateContact = (rule, value, callback) => {
            if (!value) {
                callback();
                return;
            }
            this.isContactValid ? callback() : callback(new Error(`Please enter valid contact`));
        };
        let validateEmail = (rule, value, callback) => {
            if (!value || ("" + value).trim() === "") {
                callback(new Error("Email cannot be empty"));
                return;
            }
            validateAdminandBillingEmail(rule, value, callback)
        };
        let validateAdminandBillingEmail = (rule, value, callback) => {
            let valid = true;
            const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            valid = regex.test(value);
            valid ? callback() : callback(new Error("Please provide valid email"));
        };
        return{
            activeTab:'general',
            loading: false,
            isContactValid: false,
            pageTitle: "customer",
            editorOptions: {
                mode: "text",
                theme: "default",
                value:"{}"
            },
            typeList:Constants.CUSTOMER_TYPE,
            ksServerList:[],
            form:{
                customer_name:"",
                domain:"",              
                address:"",
                billing_email:"",
                document_processing_limit:null,
                stage_change_event_allowed:false,              
                idp_share_name:"",         
                ks_server_id:null,
                share_size:"",
                password:"",
                username:"",
                default_email:"",
                timezone:"",
                process_email_threshold:30,
                allowed_ip_range:[],
                admin_contact:""
            },
            formRules: {
                username: [
                    {
                    equired: true,
                    message: "Please enter default username",
                    trigger: "change"
                    }
                ],
                password: [
                    {
                    equired: true,
                    message: "Please enter default password",
                    trigger: "change"
                    }
                ],
                admin_contact: [
                    {
                        validator: validateContact,
                        trigger: "change",
                    },
                ],
                customer_name: [
                    {
                        required: true,
                        message: "Please enter customer name",
                        trigger: "change"
                    }
                ],
                domain: [
                    {
                        required: true,
                        message: "Please enter domain",
                        trigger: "change"
                    }
                ],
                mobileDomain: [
                    {
                        required: true,
                        message: "Please enter mobile domain",
                        trigger: "change"
                    }
                ],
                billing_email: [
                    {
                        validator: validateAdminandBillingEmail,
                        trigger: "blur",
                    }
                ],
                address: [
                    {
                        required: true,
                        message: "Please enter address",
                        trigger: "change"
                    }
                ],
            },
        };   
    },
    methods: {
        defaultEmail(){
            this.form.default_email = this.form.username + '@' + this.form.domain + '.com';
        },
        onContactValidate(data) {
            
            this.isContactValid = data.isValid;
        },
        onBack() {
            this.$router.push("/idp/customer-list");
        },
        async onSave(){
            try{
                this.Loading = true;
                const valid = await this.$refs.form.validate().catch((error) => {
                    console.log("error"+error)
                    this.notifyError("errors occure while validating"); 
                });
                if (!valid) {
                    this.Loading = false;
                    return this.notifyError("Please resolve the errors before proceeding");   
                }
                let response;
                let message;
                if(!this.form._id){
                    response  = await CustomerService.createCustomer(this.form);
                    message="Customer created successfully";
                }  
                else{
                    response = await CustomerService.UpdateCustomer(this.form);
                    message="Customer updated successfully";
                }
                if (response.statusCode==200){
                    this.Loading = false;
                    this.notifySuccess(message);
                    this.$router.push({ path: "/idp/customer-list" });
                }
            } catch (e){
                console.log(e);
                this.Loading = false;
                this.notifyError("Error while processing ..");
            }
        },
        async prepareKsServerList(){
           try{
                this.Loading = true;
                const columns = ["name"]
                const KS_ServerList = await KsServerService.find({},columns);
                this.ksServerList = (KS_ServerList || []).map((obj) => {
                    return { value: "" + obj._id, label: "" + obj.name };
                });
                this.Loading = false;
            } catch (e){
                this.Loading = false;
                console.error("Error occure "+e);
            }
        },
        async init(recordId){
            try {
                this.prepareKsServerList()
                if(recordId){
                    const customers = await CustomerService.find({_id: recordId});
                    this.form = Object.assign({}, ...customers);
                }
            } catch (error){
                this.notifyError("Error");
            }
        },
    },
    beforeMount() {
            this.$store.commit("setDisplayIdpTree",false);
            this.$store.commit("setDisplayIdpNavbar",true);
            let recordId = this.$route.query.id;
            this.init(recordId);
        },
}
</script>
<style lang="scss">
@import "../_idpGlobal";
.kp-form-group {
  .vue-tel-input {
    height: 22px;
    background-color: var(--dark-10);
    input {
      background-color: var(--dark-10);
      font-size: var(--font-sm);
    }
  }
}
</style>
