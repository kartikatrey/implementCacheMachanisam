<template>
<!-- digital Assistant -->
<div class="digital-assistant-wrap">
    <el-form :model="form" id="payment-form" :rules="formRules" ref="form">
        <el-form-item prop="customer_name">
            <span class="digital-assistance">Digital assistant name <br /></span>
            <el-input v-model="form.customer_name" @blur="handleBlur()" placeholder="Please enter assistant name. E.g. Jade"></el-input>
        </el-form-item>
        <!-- <el-form-item prop="defaultNerDomains">
            <div class="checkbox_block module-container">
                <el-row>
                    <el-col :span="10">
                        <span>Include modules:</span>
                    </el-col>
                    <br />
                    <br />
                    <el-col :span="14">
                        <el-row>
                            <el-col :span="8" v-for="(key, value, index) in default_domains" :key="index">
                                <el-tooltip class="item" effect="dark" :content="key.description" placement="right-start">
                                    <i class="mdi mdi-information-outline"></i>
                                    <el-checkbox :id="key.value" @change="updateNerModule($event,key.value)">
                                        {{value}}
                                    </el-checkbox>
                                </el-tooltip>

                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>

                </el-col>
                </el-row>
                </el-col>
                </el-row>

            </div>
        </el-form-item> -->
    </el-form>
</div>
</template>

<script>
import _ from "lodash";
import AjaxService from "../services/AjaxService";
import EventBus from "@/EventBus";
import PaymentService from "@/services/PaymentService";
import CustomerService from "@/services/CustomerService"

import {
    Loading
} from "element-ui";
export default {
    name: "DigitalAssistant",

    data() {
        return {
            form: {
                customer_name: "",
                // defaultNerDomains: []

            },
            // default_domains: {},
            formRules: {
                customer_name: [{
                    required: true,
                    message: "Please enter customer name",
                    trigger: "blur"
                }],
            },
        };
    },
    methods: {
        //  @blur="handleBlur()"
        handleBlur() {
            //    let data={
            //         customer_name:this.customer_name,
            //         defaultNerDomains:this.defaultNerDomains

            //     }
            EventBus.$emit("DADetails", this.form);
        },
        // updateNerModule(val, model) {

        //     if (val) {
        //         this.form.defaultNerDomains.push(model)
        //     } else {
        //         this.form.defaultNerDomains = _.without(this.form.defaultNerDomains, model)
        //     }
            // let data={
            //     customer_name:this.customer_name,
            //     defaultNerDomains:this.defaultNerDomains

            // }
        //     EventBus.$emit("DADetails", this.form);

        // // },
        // getConfiguration() {
        //     CustomerService.getConfiguration("/portal/api/table/configuration")
        //         .then(response => {
        //             this.default_domains = response[0]['default_ner_domain']
        //         })
        //         .catch(error => {
        //             let errorMessage = error.statusMessage
        //             if (error.statusMessage)
        //                 return this.notifyError(error.statusMessage);

        //         })
        // }

    },
    beforeMount() {
        // this.getConfiguration()
    }
};
</script>

<style lang="scss">
.digital-assistant-wrap {
    .digital-assistance {
        font-weight: 600;
        color: #aaa7a7;
        margin-bottom: 7px;
        display: inline-block;
    }

    .el-form-item__content {
        line-height: 15px
    }

    .module-container {
        .el-checkbox .el-checkbox__label {
            color: #6c6767;
            font-weight: bold;
        }
    }

    .checkbox_block {
        margin-top: 15px;

        .checkbox_div {
            padding-left: 100px;
        }
    }

    // .el-input {
    //     padding-top: 10px;
    // }
}

// upload file
</style>