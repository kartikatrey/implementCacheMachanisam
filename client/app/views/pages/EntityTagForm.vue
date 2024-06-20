<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>

    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/entity-tag-list' }">Entity tags</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="validation" ref="form">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-select-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="domain" label="Domain">
                                        <el-select clearable filterable v-model="form.domain" @change="onDomainChange(form.domain)" placeholder="Select">
                                            <el-option v-for="value in options" :key="value" :value="value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="ENTITY_LIST" label="Tags">
                                        <el-select v-model="selectedEntityList" @change="onTagChange(selectedEntityList)" multiple filterable allow-create default-first-option placeholder="Choose tags for your article">
                                            <el-option v-for="item in form.ENTITY_LIST" :key="item" :label="item" :value="item"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="5" class="no-p">
                                <div class="tag-action-container">
                                    <!-- <el-button
                        class="kp-blank-btn el-icon-plus el-button--default"
                        v-on:click="addEntities()"
                        ></el-button> -->
                                    <el-tooltip class="item" effect="dark" content="Delete tags" placement="top-start">
                                        <el-button class="kp-blank-btn el-icon-delete el-button--default" v-on:click="removeEntities()"></el-button>
                                    </el-tooltip>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-col>

            </el-row>
        </div>
        <el-button v-on:click.once="onSave" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">* Please check field with errors</div>
    </div>
</el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import EntityTagListService from "@/services/EntityTagListService";
import ConfirmModel from "@/components/ConfirmModel";
import CommonService from "@/services/CommonService";

export default {
    name: "EntityTagListForm",
    components: {
        ConfirmModel
    },
    data() {
        return {
            labelPosition: "top",
            //isEditing:false,
            options: Constants.DOMAINS,
            buttonKey: 1,
            pageTitle: "New entity tag",
            isFormValid: true,
            domain: "",
            tagsToAdd: [],
            tagsToRemove: [],
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isEditForm: false,
                isNewForm: false
            },
            form: {
                domain: "",
                ENTITY_LIST: []
            },
            oldFilledform: {
                domain: "",
                ENTITY_LIST: []
            },
            selectedEntityList: [],
            validation: this.validationRules(),
            endPoint: "/portal/api/table/entity_tag_list"
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
                    this.cacheDataModal.isFormEdited =
                        JSON.stringify(this.cacheDataModal.cachedForm) !=
                        JSON.stringify(this.form);
                }
            },
            deep: true
        }
    },
    methods: {
        validationRules() {
            return {
                domain: [{
                    required: true,
                    message: "Please select domain",
                    trigger: "change"
                }],
                ENTITY_LIST: [{
                    required: true,
                    message: "Please provide tags",
                    trigger: "blur"
                }]
            };
        },
        onSave() {
            this.$refs.form.validate(valid => {
                this.isFormValid = valid;
                if (!valid) {
                    return;
                }
                this.cacheDataModal.isFormEdited = false;
                EntityTagListService.save(this.form)
                    .then(response => {
                        this.form._id = response._id;
                        this.notifySuccess("Record saved successfully");
                        this.displayList();
                    })
                    .catch(error => {
                        this.isFormValid = false;
                        this.notifyError("There is an error in saving Entity tag data");
                    });
                this.buttonKey++;
            });
        },
        async onDomainChange(domain) {
            this.form.domain = domain;
            this.existingRecord = await CommonService.fetchRecord(
                this.endPoint, {
                    domain: this.form.domain,
                    active: true
                }).catch(error => {
                this.notifyError("Error while fetching entity tag data");
            });
            if (!_.isEmpty(this.existingRecord)) {
                this.form = this.existingRecord;
                //   this.form.ENTITY_LIST = this.existingRecord.ENTITY_LIST;
                this.notifyError("Domain already exist");
                return;
            }
            // this.fetchEntityTagList();
        },

        displayList() {
            this.$router.push({
                path: "/entity-tag-list"
            });
        },
        async fetchEntityTagList() {
            if (!this.domain) {
                this.form.ENTITY_LIST = [];
                return;
            }
            this.entityTagListRec = await EntityTagListService.fetchTagListByDomain(
                this.domain
            ).catch(error => {
                this.notifyError("Error while fetching objects!!");
            });
            this.form.ENTITY_LIST = this.entityTagListRec.ENTITY_LIST;
            // this.selectedEntityList = this.entityTagListRec.ENTITY_LIST;
        },
        onTagChange() {
            console.log("before add: ", this.form.ENTITY_LIST);
            this.form.ENTITY_LIST = _.union(
                this.form.ENTITY_LIST,
                this.selectedEntityList.map(function (tag) {
                    return tag.toUpperCase();
                })
                // this.selectedEntityList
            );
            //   this.tagsToAdd = this.selectedEntityList;
            console.log("after add: ", this.form.ENTITY_LIST);
        },
        removeEntities() {
            this.$confirm(
                    `Are you sure you want to delete selected entities?`,
                    "Confirmation", {
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        type: "warning"
                    })
                .then(() => {
                    _.remove(this.form.ENTITY_LIST, c =>
                        this.selectedEntityList.includes(c)
                    );
                    this.selectedEntityList = [];
                })
                .catch(() => {});
        },
        async init() {
            try {
                if (!this.$route.query.id) {
                    this.cacheDataModal.isNewForm = true;
                    this.cacheDataModal.isFormEdited = false;
                    this.cacheDataModal.cachedForm = {
                        ...this.form
                    };
                    return;
                }
                let entityTagsData = await EntityTagListService.fetchById(
                    this.$route.query.id
                );
                this.form = entityTagsData;
                this.cacheDataModal.isEditForm = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.form
                };
                // this.form.ENTITY_LIST = entityTagsData.ENTITY_LIST.join(",");
                // this.selectedEntityList = entityTagsData.ENTITY_LIST;        
                this.pageTitle = "Edit entity tag";
            } catch (e) {
                console.log(e);
            }
        }
    },
    beforeMount() {
        let user = this.$store.getters.user;
        if (user.roles.includes("admin")) {
            this.showList = true;
        }
        this.init();
        window.addEventListener("beforeunload", event => {
            if (!this.cacheDataModal.isFormEdited) return;
            event.preventDefault();
            event.returnValue = "";
        });
    },
    beforeRouteLeave: function (to, from, next) {
        if (this.cacheDataModal.isFormEdited) {
            //    return window.confirm('Do you really want to leave? you have unsaved changes!')
            return this.$refs.model.open(next);
        } else {
            return next();
        }
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.tag-action-container {
    padding: 18px;

    .el-button {
        color: #008ABF;
        font-weight: 700;
        border-color: #565f70;
        background-color: #eff4fc;
        border-radius: 100px;
        margin: 0;
        padding: 12px 0px;
        width: 40px;

        &:hover {
            background-color: #d8e7ff;
        }
    }
}

.el-form--label-top .el-form-item__label {
    margin-bottom: 5px;
}
</style>
