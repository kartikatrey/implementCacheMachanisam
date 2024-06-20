<template>
<el-main>
        <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="$router.push('field')"></el-button>
        <h1 class="kp-page-title" v-if="form._id">Edit {{pageTitle}}</h1>
        <h1 class="kp-page-title" v-else>Add {{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: 'field' }">Fields</el-breadcrumb-item>
        <el-breadcrumb-item v-if="form._id">Edit {{pageTitle}}</el-breadcrumb-item>
        <el-breadcrumb-item v-else>Add {{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="form" ref="form" label-width="150px" :rules="formRules">
        <!-- basic content -->
        <div data-v-step="1" id="basic-details" class="form-section card-base card-shadow--medium demo-box bg-white">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item prop="label" label="Label">
                        <el-input @input="handleLabelInput" v-model="form.label" :rows="2" placeholder="E.g. customer name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12" class="mt-20">
                    <el-form-item prop="name" label="Name">
                        <el-input disabled="true" class="threshold-input" prop="threshold" v-model="form.name" placeholder="E.g. customer_name"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12" class="mt-20">
                    <el-form-item prop="field_type" label="Field type">
                        <el-select class="select-box" size="large" v-model="form.field_type" filterable reserve-keyword placeholder="Please select field type">
                            <el-option v-for=" _type in fieldTypes" :key="_type" :label="_type" :value="_type" label-width="170px">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="Mandatory">
                        <el-checkbox class="active-input" v-model="form.is_mandatory"></el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12" class="mt-20">
                    <el-form-item prop="data_type" label="Data type">
                        <el-select class="select-box" size="large" v-model="form.type" filterable reserve-keyword placeholder="Please select data type">
                            <el-option v-for=" _type in labelTypes" :key="_type" :label="_type" :value="_type" label-width="170px">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12" class="mt-20">
                    <el-form-item prop="document_type" label="Document type">
                        <el-select :disabled="form._id" class="select-box" size="large" v-model="form.document_type" filterable reserve-keyword placeholder="Please select data type">
                            <el-option v-for=" _type in documentTypeList" :key="_type.value" :label="_type.label" :value="_type.value" label-width="170px">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12" class="mt-20">
                    <el-form-item prop="order" label="Order">
                        <el-input class="threshold-input" type="number" :min="1" v-model="form.order" placeholder="E.g. 1"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24" class="mt-20">
                    <el-button style="{margin-top: 36px}" v-on:click="saveField" class="btn-save" type="primary">
                        <i class="mdi mdi-check"></i> Save
                    </el-button>
                </el-col>
            </el-row>
        </div>
    </el-form>

    <h3 class="suggestion-button-title" v-if="showDatatable && form._id">Business rule</h3>
    <div v-if="showDatatable && form._id" class="grid-content bg-purple">
        <div data-v-step="2" class="table-wrap">
            <data-table :parameters="tableParams" ref="datatable"></data-table>
        </div>
    </div>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import Constants from "@/resources/Constants";
import FieldService from "@/doc-ex/services/FieldService";
import _ from 'lodash'

export default {
    name: "FieldConfig",
    components: {
        DataTable
    },
    computed: {
        tableParams() {
            return {
                apiName: `/portal/api/table/de_business_rule_field_map`,
                defaultData: {
                    'de_field_id': this.form._id,
                    'document_type': this.form.document_type,
                    'active': true
                },
                tableName: "field_business_rule_map",
                tableHeaderConfigParams: {
                    'document_type': this.form.document_type,
                },
                isRestify: true,
                queryParam: {
                    active: true,
                    de_field_id: this.form._id || null
                },
                limit: 10,
                allowInline: true,
                inlineAddButtonConfig: {
                    disable: this.form._id ? false : true
                }
            }
        }
    },
    data() {
        return {
            isEditMode: false,
            labelTypes: Constants.DOCEX.LABEL_TYPE,
            form: {},
            pageTitle:"field configuration",
            formRules: {
            label: [
                {
                    required: true,
                    message: "Please enter label",
                    trigger: "blur"
                }
        ]
       },
            fieldTypes: Constants.DOCEX.FIELD_TYPE,
            documentTypeList: Constants.DOCEX.DOCUMENT_TYPE_LIST,
            showDatatable: true
        };
    },
    methods: {
        handleLabelInput() {
            if(!this.isEditMode || this.form['is_custom_field']){
                let name = this.form['label'].trim().replace(/\s+/g, "_");
                this.form['name'] = name ? `c_${name.toLowerCase()}` : ''
            }
        },
        reRenderDatatable() {
            this.showDatatable = false
            this.$nextTick(() => {
                this.showDatatable = true
            })

        },
        async saveField() {
            let isValid = await this.$refs.form.validate().catch(error => {});
            if(!isValid){
                return;
            }
            form.document_subtype = form.document_type
            let res = await FieldService.save(this.form).catch((errorMessage) => {
                this.notifyError(errorMessage)
            })
            if (res) {
                this.form = res
                this.reRenderDatatable()
                this.notifySuccess("Records saved successfully")
            }
        },
        async init(fieldId) {
            let response = await FieldService.fetchById(fieldId).catch(error => {
                this.notifyError("Error while fetching field data");
            });
            this.form =
                (response && _.defaultsDeep(response, this.form)) || this.form;
            this.$nextTick(() => {
                this.reRenderDatatable()
            })

        }
    },
    async beforeMount() {
        let fieldId = this.$route.query.id
        if (!fieldId) return;
        this.isEditMode = true;
        this.init(fieldId);
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

.active-input {  
    margin-top: 8px;  
}
</style>
