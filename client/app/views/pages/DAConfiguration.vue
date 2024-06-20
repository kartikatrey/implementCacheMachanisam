<template>
<el-main>
    <h3 class="configuration-title">Configuration</h3>
    <el-form :model="form" :rules="formRules" ref="form" label-width="150px">
        <!-- basic content -->
        <div data-v-step="1" id="basic-details" class="form-section card-base card-shadow--medium demo-box bg-white">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item prop="welcome_message" label="Welcome message">
                        <el-input v-model="form.welcome_message" type="textarea" :rows="2" placeholder="E.g. I am ethan."></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" class="recommendation_message">
                    <el-form-item prop="recommendation_message" label="Recommendation message">
                        <el-input :rows="2" v-model="form.recommendation_message" type="textarea" placeholder="Enter recommendation..."></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12" class="mt-20">
                    <el-form-item prop="threshold" label="Threshold">
                        <el-input class="threshold-input" prop="threshold" v-model="form.threshold" type="number" placeholder="E.g. 60"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="9" :offset="3" class="mt-20">
                    <el-checkbox v-model="form.auto_complete">Auto complete</el-checkbox>
                </el-col>
                <el-col :span="5" :offset="3" class="mt-20">
                    <el-checkbox v-model="form.hide_button_after_selection">Hide button after selection</el-checkbox>
                </el-col>
            </el-row>

            <el-row :gutter="10"></el-row>
            <el-row :gutter="10">
                <el-col :span="24" class="mt-20">
                    <el-button style="{margin-top: 36px}" v-on:click="saveDAConfiguration" :key="buttonKey" class="btn-save" type="primary">
                        <i class="mdi mdi-check"></i> Save
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </el-form>

    <h3 class="suggestion-button-title">Suggestion button</h3>
    <div class="grid-content bg-purple">
        <div data-v-step="2" class="table-wrap">
            <data-table :parameters="tableParams" ref="datatable"></data-table>
        </div>
    </div>
    <v-tour name="userGuide" :steps="steps" :options="tourOptions" :callbacks="callbacks"></v-tour>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import DAService from "@/services/DAService";
import Constants from "@/resources/Constants";
import {
    mapState
} from 'vuex';
import EventBus from "@/EventBus";
import userGuide from "@/mixins/userGuide.js";
import navigation from "@/mixins/navigation.js";
import $ from 'jquery'

export default {
    name: "DAConfiguration",
    components: {
        DataTable
    },
    mixins: [userGuide, navigation],
    data() {
        return {
            tourOptions: {
                highlight: true,
                startTimeout: 200,
                stopOnTargetNotFound: true
            },
            steps: Constants.USER_GUIDE_STEPS.DA_CONFIGURATION,
            buttonKey: 1,
            form: {
                welcome_message: Constants.WELCOME_MESSAGE,
                auto_complete: false,
                recommendation_message: Constants.RECOMMENDATION_MESSAGE,
                hide_button_after_selection: false,
                threshold: 60
            },
            daConfigId: "",
            tableParams: {
                apiName: `/portal/api/table/da_recommendation_btn`,
                tableName: "da_recommendation_btn",
                isRestify: true,
                queryParam: {
                    active: true
                },
                limit: 10,
                allowInline: true
            },
            formRules: {
                welcome_message: [{
                    required: true,
                    message: "Please enter welcome message",
                    trigger: "blur"
                }],
                auto_complete: [{
                    required: true,
                    trigger: "blur"
                }],
                recommendation_message: [{
                    required: false,
                    message: "Please enter recommendation message",
                    trigger: "blur"
                }],
                hide_button_after_selection: [{
                    required: true,
                    trigger: "blur"
                }],
                threshold: [{
                    required: true,
                    message: "Enter threshold between 1 to 100",
                    validate: true,
                    trigger: "change",
                    validator: (rule, value, callback) => {
                        if (value && Number(value) > 0 && Number(value) <= 100) {
                            callback();
                        } else {
                            callback(new Error("Enter threshold between 1 to 100"));
                        }
                    }
                }]
            },
            searchValue: ""
        };
    },
    computed: {
        ...mapState({
            isTableInEditMode: 'isTableInEditMode'
        })
    },
    methods: {
        getDAConfiguration() {
            let self = this;
            DAService.get()
                .then(response => {
                    if (response && response.length > 0) {
                        self.form = response[0].da_config || {};
                        self.daConfigId = response[0]._id;
                    } else {
                        console.log(response);
                    }
                })
                .catch(error => {
                    self.notifyError("Error while processing");
                });
        },
        saveDAConfiguration() {
            this.$refs.form.validate(valid => {
                if (!valid) {
                    return;
                }
                let postData = {
                    da_config: this.form
                };
                this.daConfigId ? (postData._id = this.daConfigId) : "";
                DAService.save(postData)
                    .then(response => {
                        this.notifySuccess("Record saved successfully");
                        this.getDAConfiguration();
                    })
                    .catch(error => {
                        this.notifyError("Error while processing");
                    });
            });
        },
        setup() {
            return new Promise(async (success, reject) => {
                try {
                    let response = await DAService.setup({
                        isExitSetup: true,
                        customer_id: localStorage.getItem("qnaChildId")
                    });
                    if (!response.data.status) {
                        this.notifyError("Error while cancel setup");
                        return reject();
                    }
                    setTimeout(() => {
                        localStorage.setItem("qnaChild", "");
                        EventBus.$emit("update-menu", {
                            type: "update-menu"
                        });
                        this.$store.commit("setTableEditMode", false);
                        success();
                    }, 1000)

                } catch (ex) {
                    this.notifyError("Error while cancel setup");
                    reject();
                    console.log(ex);
                }
            });
        },
    },
    beforeMount() {
        this.getDAConfiguration();
    },
    //need refactoring
    // async beforeRouteLeave(to, from, next) {
    //     if (this.isTableInEditMode) {
    //         let res = await this.$confirm(
    //             `Changes you made may not be saved.`,
    //             "Leave page?", {
    //                 confirmButtonText: "Confirm",
    //                 cancelButtonText: "Cancel",
    //                 type: "warning"
    //             }
    //         ).
    //         then(() => {
    //                 this.$store.commit("setTableEditMode", false);
    //                 next();
    //             })
    //             .catch((err) => {
    //                 next(false)
    //             })
    //         return;
    //     }

    //     if (to.path == '/digital-assistant-list' && localStorage.getItem("qnaChild")) {
    //         await this.setup();
    //         EventBus.$emit("update-toolbar", {});
    //     }
    //     next()
    // },
    mounted() {
        this.setupGuide()
          $("#basic-details, .table-wrap").on('click', (event)=>{
            this.$stopTour()
        });
    },

    beforeDestroy(){
         $("#basic-details, .table-wrap").off('click')
    }
};
</script>

<style lang="scss">
.modal-dropdown {
    margin-bottom: 34px;

    .sub-heading {
        font-weight: 700;
        text-transform: uppercase;
        font-size: 0.875rem;
        display: block;
        margin-bottom: 7px;
    }
}

.threshold-input {
    input {
        padding-right: 0px
    }
}

// Temporart CSS ---------------------------

.page-info-container .el-col {
    border: none;
}

.configuration-title {
    font-size: 22px;
    color: #005da6;
    margin: 0;
    display: inline-block;
    margin-bottom: 32px;
}

.page-vue-good-table .table-buttons-wrap {
    background: none;
    margin-bottom: 16px;
}

tbody>tr:first-child {
    // border: none !important;
    border-top: 1px solid #ffffff;
    padding-top: 16px;
}

// .vgt-table thead th {
//     padding-left: 0px !important;
// }

// .vgt-table tbody td {
//     padding-left: 0px !important;
// }

// .vgt-wrap__footer {
//     padding-left: 0px !important;
// }

.form-section {
    padding: 18px;
}

.recommendation_message {
    label {
        line-height: 1.3 !important;
    }
}

.suggestion-button-title {
    margin-top: 42px;
    font-size: 20px;
    color: #005da6;
    display: inline-block;
}
</style>
