<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="$router.push('ner-list')"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>

    <el-breadcrumb separator="/" class="mb-20">
        <el-breadcrumb-item :to="{  path: 'ner-list' }">Ner</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="form" :label-position="labelPosition" label-width="100px" :rules="rules" ref="form">
        <ConfirmModel ref="model"></ConfirmModel>
        <div class="NER-model-wrap">
            <el-row :gutter="10">
                <el-col :span="9">
                    <div class="kp-form-area">
                        <div class="kp-form-panel no-m">
                            <div class="kp-form-select-1 kp-form-field no-m">
                                <el-form-item class="kp-form-field-label" label="Domain">
                                    <el-select v-model="domain" filterable placeholder="Select" @change="fetchTags();fetchObjectList();">
                                        <el-option v-for="(value,key) in form.domains" :key="value.domain" :label="key.domain" :value="value.domain"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
            <div class="kp-command-wrap no-p">
                <!-- <el-row :gutter="10"> -->
                <!-- left site -->
                <div class="left-col" :span="14">
                    <!--  inner -->
                    <div class="kp-inner">
                        <div v-for="(row,index) in form.nerData" class="kp-form-input-1 kp-form-input-template kp-form-field" :key="index">
                            <div class="kp-form-field-label kp-command-title">Command {{index+1}}
                                <el-button type="text" v-if="index>0" @click="removeNerBlock(index)" class="kp-blank-btn el-icon-delete el-button--default"></el-button>
                            </div>
                            <el-input class="input-statment" placeholder="E.g. What are my top 10 opportunities" v-model="row.statement">
                                <!-- <el-button size="mini" slot="append" >Find NER</el-button> -->
                                <el-button size="mini" slot="append" @click="fetchPrediction(row,index)">Find NER</el-button>
                                <!-- <template slot="append" @click="fetchPrediction(row,index)">FIND NER</template> -->
                            </el-input>
                            <div class="kp-ner-tag-wrap" v-if="row.displayPredictedData">
                                <p class="m-7">NER</p>
                                <span v-for="(prediction,index) in row.displayPredictedData" :key="index">
                                    {{`${prediction.tag} : ${prediction.value}`}}</span>
                                <!-- <span>undefined : undefined</span> -->
                            </div>
                        </div>
                    </div> <!-- end inner -->
                    <div class="kp-addbtn-wrap">
                        <el-button class="kp-btn-form-outline" @click="addNerBlock" v-if="showAddButton">+ Add another command</el-button>
                    </div>
                </div> <!-- left site end -->

                <!-- right site -->
                <div class="right-col" :span="10">
                    <!--  inner -->
                    <div class="kp-inner">
                        <p class="kp-title-ner mb-10">NER / Command {{currentIndex+1}}</p>
                        <div id="tag-content-body" class="content-body">
                            <table border="0" cellpadding="5" cellspacing="5">
                                <tbody v-if="wordTagMapList.length > 0">
                                    <tr v-for="(row,index) in wordTagMapList" :key="index">
                                        <td>
                                            <el-form-item class="kp-form-field-label no-m">
                                                <el-input placeholder="Please input" v-model="row.value" @change="setFormData"></el-input>
                                            </el-form-item>
                                        </td>
                                        <td>
                                            <el-form-item class="kp-form-field-label no-m">
                                                <el-select v-model="row.tag" placeholder="Select" @change="setFormData" filterable="true">
                                                    <el-option v-for="tag in tagList" :key="tag" :label="tag" :value="tag">
                                                    </el-option>
                                                </el-select>
                                            </el-form-item>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div> <!-- end inner -->
                    <div class="kp-addbtn-wrap">
                        <el-button class="kp-btn-form-outline" @click="showTagsDialog(index)">+ Add tag</el-button>
                    </div>
                </div><!-- end right site -->
            </div>
        </div>

    </el-form>
    <el-dialog width="30%" class="tags-modal-container" title="Add Tags" :visible.sync="displayEntityDialog">
        <el-row :gutter="10">
            <el-col style="height:1px" :span="5"></el-col>
            <el-col :span="12">
                <el-input v-model="newEntity" placeholder="E.g. I-ENTITY">
                </el-input>
                <span v-if="invalidTagValue" class="tag-validation">*Please enter valid tag name</span>
            </el-col>
            <el-col class="tag-save" :span="6">
                <el-button type="primary" size="small" @click="addTag">SAVE</el-button>
            </el-col>
        </el-row>
    </el-dialog>

    <el-button v-on:click="onSave" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
    <el-button v-on:click="$router.push('ner-list')" class="kp-btn-form-outline">Cancel</el-button>
    <!-- <div  v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div> -->
    <!-- </div> -->
</el-main>
</template>

<script>
import _ from "lodash";
import Constants from "@/resources/Constants";
import NerService from "@/services/NerService";
import EntityService from "@/services/EntityService";
import RoutingService from "@/services/RoutingService";
import CustomerService from "@/services/CustomerService";
import ConfirmModel from "@/components/ConfirmModel";
import {
    Loading
} from "element-ui";
import EntityTagListService from "@/services/EntityTagListService";
import IntentInfoService from "@/services/IntentInfoService";

export default {
    name: "NerForm",
    components: {
        Loading,
        ConfirmModel
    },
    data() {
        return {
            displayEntityDialog: false,
            domain: "",
            wordTagMapList: [],
            invalidTagValue: false,
            tagList: [],
            objectList: {},
            currentIndex: 0,
            isObjectFound: true,
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isEditForm: false,
                isNewForm: false
            },
            recordId: null,
            displayPredictedData: [],
            routerData: [],
            isQNACustomer: false,
            newEntity: null,
            labelPosition: "top",
            form: {
                nerData: [{
                    statement: ""
                }],
                domains: []
            },
            pageTitle: "Add Commands",
            showAddButton: true,
            loadingInstance: null,
            domainTagList: null
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                let cachedForm = _.pickBy(this.cacheDataModal.cachedForm, _.identity);
                let form = _.pickBy(this.form, _.identity);

                cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g, "");
                form = JSON.stringify(form).replace(/\\n|\\t|\\r/g, "");

                this.cacheDataModal.isFormEdited = cachedForm != form;
            },
            deep: true
        }
    },
    methods: {
        showTagsDialog() {
            this.displayEntityDialog = true;
        },

        updatedDomainTagList() {
            let updatedDomainTagList = this.domainTagList || {
                domain: this.domain,
                active: true,
                ENTITY_LIST: []
            };
            updatedDomainTagList["ENTITY_LIST"] = _.uniq(
                _.concat(
                    updatedDomainTagList["ENTITY_LIST"],
                    this.newEntity.toUpperCase()
                )
            );
            return updatedDomainTagList;
        },
        addTag() {
            if (_.isEmpty(this.newEntity)) {
                this.invalidTagValue = true;
                return;
            }
            this.invalidTagValue = false;
            let updatedDomainTagList = this.updatedDomainTagList();
            EntityTagListService.save(updatedDomainTagList)
                .then(response => {
                    this.domainTagList = response.data;
                    this.setTagList(this.domainTagList);
                    this.notifySuccess("Tag added successfully");
                })
                .catch(err => {
                    this.notifyError("Error while fetching tags");
                })
                .finally(() => {
                    this.displayEntityDialog = false;
                    this.newEntity = null;
                });
        },

        fetchPrediction(data, index) {
            if (!this.domain) {
                this.notifyError("Please select domain");
                return;
            }
            this.showLoader({
                target: "#tag-content-body"
            });
            let queryParams = {
                domain: this.domain,
                statement: data.statement
            };
            this.wordTagMapList = [];
            this.currentIndex = index;

            NerService.fetchPrediction(queryParams)
                .then(response => {
                    if(!response.status){
                         this.notifyError(response.result);
                         return;
                    }
                    let predictions=response.result
                    if (!_.isArray(predictions)) {
                        this.notifyError("Something went wrong, Please try later");
                        return;
                    }
                    _.each(predictions, item => {
                        this.wordTagMapList.push({
                            value: _.values(item)[0],
                            tag: _.keys(item)[0]
                        }); // convert predicted data in wordTagMapList format [{value:incident,tag:I-OBJECT}]
                    });
                    this.setFormData();
                })
                .catch(error => {
                     this.notifyError("Something went wrong, Please try later");
                })
                .finally(() => {
                    this.hideLoader();
                });
        },
        async onSave() {
            try {
                this.cacheDataModal.isFormEdited = false;
                let isValid = await this.validateFormData().catch(e => {});
                console.log("1")
                if (!isValid) return;
                let formData =
                    _.size(this.form.nerData) == 1 ?
                    this.form.nerData[0] :
                    this.form.nerData;
                _.isArray(formData) ?
                    _.each(formData, item => {
                        this.prepareRouterData(item);
                        this.prepareObjectList(item);
                    }) :
                    this.prepareRouterData(formData);
                this.prepareObjectList(formData);
                if (!this.isObjectFound) {
                    this.saveObjectData(this.objectList, formData.domain);
                }
                NerService.save(formData)
                    .then(response => {
                        this.notifySuccess("Data saved successfully");
                        this.$router.push({
                            path: "/ner-list"
                        });
                    })
                    .catch(err => {
                        console.log(" NerService.save..",err)
                        this.notifyError("Error while saving data");
                    });
                this.saveRouterData(this.routerData);
            } catch (err) {
                 console.log(" onSave..",err)
                this.notifyError("Error while saving data");
            }
        },

        prepareObjectList(formData) {
            let object = "";
            _.forEach(formData.displayPredictedData, function (value, key) {
                if (value.tag == "I-OBJECT") {
                    object = value.value;
                }
            });

            let self = this;
            for (var keyObject in self.objectList[0].OBJECT_LIST) {
                if (
                    !self.objectList[0].OBJECT_LIST[keyObject].includes(
                        object.toUpperCase()
                    )
                ) {
                    self.objectList[0].OBJECT_LIST[object.toUpperCase()] = [
                        object.toUpperCase()
                    ];
                    self.isObjectFound = false;
                } else {
                    self.isObjectFound = true;
                    return;
                }
            }
        },

        saveObjectData(object_list, domain) {
            let formData = {
                OBJECT_LIST: object_list[0].OBJECT_LIST
            };
            EntityService.saveObjectList(object_list[0]._id, formData)
                .then(response => {})
                .catch(error => {
                    this.notifyError("Error while processing tags data");
                });
        },

        prepareRouterData(formData) {
            let routerData = {};
            routerData.domain = formData.domain;
            routerData.statement = formData.statement;
            routerData.Model = "NER";
            this.routerData.push(routerData);
        },

        saveRouterData(formData) {
            RoutingService.save(formData)
                .then(response => {})
                .catch(error => {
                    this.notifyError("Error while processing router data");
                });
        },
        validateFormData() {
            return new Promise((resolve, reject) => {
                this.$refs["form"].validate().then(isValid => {
                    if (!isValid) return reject();

                    let data = this.form.nerData;
                    _.each(data, item => {
                        if (!item.data) {
                            // check where user provided ner data or not
                            this.notifyError("Please provide valid data");
                            return (isValid = false);
                        }
                    });
                    return resolve(isValid);
                });
            });
        },
        async fetchById() {
            try {
                let nerData = await NerService.fetchById(this.getNerIdFromUrl());
                this.domain = nerData.domain;
                this.convertToReadableFormat(nerData);
                this.setFormData();
            } catch (e) {
                this.notifyError("Error while fetching service data");
            }
        },

        // change prediction of record in wordTagMapList(ex. json array) format
        convertToReadableFormat(record) {
            this.form.nerData[0]["statement"] = record.statement;
            this.form.nerData[0]["_id"] = record._id;
            let predictedDataList = [];
            if (!_.isEmpty(record.data)) {
                predictedDataList = record.data.prediction.split("\n"); // split  ex. show O\nme O\nincident I-OBJECT\n\n to [[show O][me O][incident I-OBJECT][]]
            }
            predictedDataList = _.without(predictedDataList, ""); //remove extra "" from array
            _.each(predictedDataList, wordTagMap => {
                let tagValueList = wordTagMap.trim().split(" "); //split [show O] to [show,O]
                let wordAndTagMap = {
                    value: tagValueList[0], // value=show
                    tag: tagValueList[1] //tag= O
                };
                this.wordTagMapList.push(wordAndTagMap);
            });
        },

        //set data, domain and displayPredictedData(used show modified data on UI) in nerData
        setFormData() {
            let prediction = "";
            _.each(this.wordTagMapList, row => {
                prediction = prediction.concat(`${row.value} ${row.tag}\n`);
            });
            prediction = prediction.concat("\n");
            this.form.nerData[this.currentIndex]["data"] = {
                prediction
            };
            this.form.nerData[this.currentIndex]["domain"] = this.domain;
            this.form.nerData[this.currentIndex][
                "displayPredictedData"
            ] = this.wordTagMapList;
        },

        fetchObjectList() {
            EntityService.fetchObjectList({"domain":this.domain})
                .then(objectList => {
                    this.objectList = objectList;
                    return this.objectList;
                })
                .catch(error => {
                    console.log("error in fetch object list");
                });
        },

        setTagList(tagList) {
            this.tagList = tagList.ENTITY_LIST;
        },

        fetchTags() {
            EntityTagListService.fetchTagListByDomain(this.domain)
                .then(tagList => {
                    this.domainTagList = tagList; // {domain:'ABC',ENTITY:['A','B']}
                    this.setTagList(this.domainTagList);
                    // this.form.nerData =  this.form.nerData.each(data=>{return data.domain=this.domain})

                    _.each(this.form.nerData, data => {
                        data.domain = this.domain;
                    });
                })
                .catch(error => {
                    console.log("error in fetch tags");
                });
        },
        removeNerBlock(index) {
            this.form.nerData.splice(index, 1);
        },
        addNerBlock() {
            this.form.nerData.push({});
        },
        getNerIdFromUrl() {
            return this.$route.query.id;
        },
        
        setDomainForQNAcustomer() {
            this.isQNACustomer = true;
            this.domain = Constants.DOMAINS["WA-WF"];
        },

        async getDomain() {
            const response = await IntentInfoService.fetchDomainList().catch(
                (error) => {
                    this.notifyError("Error while fetching domains");
                });
            return response;

        },

        showLoader(params) {
            this.loadingInstance = Loading.service({
                ...params
            });
        },

        hideLoader() {
            if (this.loadingInstance) {
                this.loadingInstance.close();
                this.loadingInstance = null;
            }
        }
    },

    async beforeMount() {
        // this.init();
        let domains = await this.getDomain();
        if (_.isArray(domains)) {
            this.form.domains = domains;
        }
        this.showLoader({
            target: ".container"
        });
        let user = this.$store.getters.user;
        if (user.type === Constants.TRANING_MODEL_TYPES.QNA_MODEL_TYPE) {
            this.setDomainForQNAcustomer();
        }

        if (!this.$route.query.id) {

            this.fetchTags();
            this.fetchObjectList();
            this.cacheDataModal.cachedForm = {
                ...this.form
            };

        } else {

            this.fetchById()
                .then(record => {
                    this.pageTitle = "Edit Command";

                    this.showAddButton = false;
                    this.fetchTags();
                    this.fetchObjectList();

                })
                .catch(err => {
                    this.notifyError("Error while loading page");
                });
            this.cacheDataModal.cachedForm = {
                ...this.form
            };
        }
        this.hideLoader();
    },
    beforeRouteLeave: function (to, from, next) {
        if (this.cacheDataModal.isFormEdited) {
            //    return window.confirm('Do you really want to leave? you have unsaved changes!')
            return this.$refs.model.open(next);
        } else {
            return next();
        }
    },

    beforeDestroy() {
        this.hideLoader();
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.tags-modal-container {
    text-align: center;

    .tag-save {
        text-align: left;
    }

    .tag-validation {
        color: red;
        font-size: 12px;
    }
}

// Ner Model

.kp-command-wrap {
    background: #fff;
    padding: 32px;
    border-radius: 7px;
    margin-top: 32px;
    -webkit-box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
    box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
    margin-bottom: 32px;

    .kp-addbtn-wrap {
        background: #ffffff;
        padding: 15px 30px;
        width: auto !important;
    }

    .left-col {
        width: 59.3%;
        display: inline-block;

        .kp-inner {
            .kp-form-input-1 .kp-form-field-label {
                &:after {
                    display: none;
                }
            }
        }

        .kp-form-field {
            margin-bottom: 40px;
        }
    }

    .right-col {
        background: #f7f7f7;
        display: inline-block;
        width: 40%;

        .kp-inner {
            padding: 32px 0px 0px 32px !important;
        }

        .content-body {
            padding-right: 16px;
        }

        .kp-title-ner {
            font-weight: 700;
            color: #212121;
            font-size: 14px;
            margin: 0;
            //   margin-bottom: 10px;
        }

        .kp-addbtn-wrap {
            background: transparent !important;
        }
    }

    .left-col,
    .right-col {
        position: relative;

        .kp-inner {
            height: 300px;
            overflow-x: hidden;
            padding: 32px 32px 0px 32px;
            overflow-y: auto;
        }

        .kp-ner-tag-wrap {
            padding: 0 0 0 16px;
            border-left: 1px dashed #cbcbcb;
            color: #77787b;

            p {
                font-size: 14px;
                font-style: italic;
                font-weight: 300;
            }

            span {
                font-size: 14px;
                font-weight: 300;
                background: #f5f6fa;
                border: 0.5px solid #ebebeb;
                padding: 5px;
                border-radius: 5px;
                margin: 0px 0 7px 7px;
                display: inline-block;
            }
        }
    }

    .kp-form-field {
        .kp-command-title {
            font-weight: 700;
            color: #212121;
            clear: both;
            position: relative;
            padding-bottom: 10px;

            &::after {
                content: "";
                position: absolute;
                height: 0.5px;
                width: 65%;
                top: 9px;
                left: 90px;
                background: #a8a8a8;
            }

            .el-icon-delete {
                float: right;
                padding: 7px;
                margin-top: -5px;
            }
        }
    }
}

// end ner model

.content-body {
    height: 260px;
    overflow-y: auto;
    // padding: 16px;

    table {
        width: 100%;
    }

    td {
        padding: 0;
    }

    .el-form-item__content::before,
    .el-form-item__content::after {
        display: block !important;
    }

    .el-input__inner {
        border: 0;
        // border-bottom: 0 solid #dcdfe6 !important;
        border-radius: 0;
        padding-left: 16px;
        border-radius: 3px;
        border: 1px solid #dcdfe6;
    }

    th {
        text-align: left;
        font-weight: normal;
    }
}

//    content body

.sticky:before,
.sticky:after {
    content: "";
    display: table;
}
</style>
