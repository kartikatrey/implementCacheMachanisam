<template>
<el-main>
    <h1 class="kp-page-title">Similarity Check</h1>
    <el-form :label-position="labelPosition" label-width="100px" :model="form" ref="form" :rules="validationRules">
        <div class="kp-form-panel kp-toolbar-filter">
            <el-row>
                <el-col>
                    <!-- <el-row :gutter="72">
                        <el-col :span="8">
                            <div class="kp-form-select-1 kp-form-field">
                                <el-form-item class="kp-form-field-label" prop="customer_id" label="Customer">
                                    <el-select clearable @change="onSystemChange" placeholder="Please select customer" v-model="form.customer_id">
                                        <el-option v-for="customer in customers" :value="customer._id" :key="customer._id" :label="customer.customer_name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row> -->
                    <el-row :gutter="72">
                        <el-col :span="16">
                            <div class="kp-form-input-1 kp-form-field">
                                <el-form-item class="kp-form-field-label" prop="statements" label="Statements">
                                    <el-input type="textarea" rows="4" placeholder="Statements" @change="onSystemChange" v-model="form.statements"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
    </el-form>
    <el-button class="kp-btn-form-primary" type="primary" @click="onClickCheckSimilarity">Check</el-button>
    <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    <div class="grid-content bg-purple" v-if="displayTable()">
        <div class="table-wrap">
            <data-table :parameters="tableParameters" ref="datatable"></data-table>
        </div>
    </div>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
// import CustomerService from "@/services/CustomerService";
import Constants from "@/resources/Constants";
import AjaxService from "@/services/AjaxService";
import EventBus from "@/EventBus";
import {
    mapState
} from 'vuex'

export default {
    name: "SimilarityCheck",
    components: {
        DataTable,
    },
    data() {
        return {
            labelPosition: "top",
            isFormValid: true,
            dialogFormVisible: false,
            form: {
                customer_id: "",
                statements: ""
            },
            tableParameters: {
                limit: 10,
                tableName: "checkSimilarity",
                rows: [],
                customfilter:false,
                globalSearch:false
            },
            // customers: [],
            validationRules: this.validationRules(),
            showList: false
        };
    },
    computed: {
    ...mapState({
            customerId:"customerId"
        })
    },
    methods: {
        async init() {
            // try {
            //     this.customers = await CustomerService.find();
            //     console.log(this.customers);
            // } catch (e) {
            //     console.log(e);
            // }
        },
        validationRules() {
            return {
                customer_id: [{
                    required: true,
                    message: "Please select customer",
                    trigger: "blur"
                }],

                statements: [{
                    required: true,
                    message: "Please provide statements",
                    trigger: "blur"
                }]
            }
        },
        onClickCheckSimilarity() {
            if(!this.customerId){
                this.notifyError("Please select customer");
                return;
            }
            this.$refs.form.validate((valid) => {
                if (!valid)
                    return;
                AjaxService.postJson(Constants.CHECK_SIMILARITY_ENDPOINT, this.form, (error, res) => {
                    console.log(res)
                    if (res.data.data) {

                        this.tableParameters.rows = res.data.data
                        EventBus.$emit('refreshTable');
                        // this.$refs.datatable.refreshTable();
                        return
                    }
                    this.$notify.error({
                        title: "Error",
                        message: res.data.data.message
                    });

                });
            })
        },
        displayTable() {
            return !_.isEmpty(this.tableParameters.rows);
        },

    },
    beforeMount() {
        let user = this.$store.getters.user;
        if (user.roles.includes("admin")) {
            this.showList = true
        }
        this.init();
    },
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";
</style>
