<template>
<el-main id="container">
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/menu-list' }">Menu</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                    <el-form :model="cp_menu" :rules="validationRules" ref="ruleForm">
                        <ConfirmModel ref="model"></ConfirmModel>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Label" prop="label">
                                        <el-input v-model="cp_menu.label" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="URL" prop="url">
                                        <el-input v-model="cp_menu.url" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Class" prop="class">
                                        <el-input v-model="cp_menu.class" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" label="Order" prop="order">
                                        <el-input v-model="cp_menu.order" placeholder="Please input"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row :gutter="72">
                            <el-col :span="8">
                                   <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item label="Roles" prop="roles" class="kp-form-field-label">
                                    <el-select
                                            v-model="cp_menu.roles"
                                            multiple
                                            clearable
                                            placeholder="Select Role"
                                    >
                                        <el-option
                                            v-for="role in roles"
                                            :key="role.value"
                                            :label="role.label"
                                            :value="role.value"
                                        >
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label" prop="parent_menu_id" label="Parent menu">
                                        <el-select clearable placeholder="Please select Parent Menu" v-model="cp_menu.parent_menu_id">
                                            <el-option v-for="menu in menuList" :value="menu._id" :key="menu._id" :label="menu.label"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>

                            </el-col>
                        </el-row>
                        <el-row :gutter="72">
                            <el-col :span="8">
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-checkbox class="kp-form-field-checkbox1" v-model="cp_menu.hidden">Hidden</el-checkbox>
                                    <!-- <el-form-item class="kp-form-field-label" label="Hidden" prop="hidden">
                                    <el-input v-model="cp_menu.hidden" placeholder="Please input"></el-input>
                                </el-form-item> -->
                                </div>
                            </el-col>
                        </el-row>
                        <!-- </div> -->
                    </el-form>
                </el-col>
            </el-row>
        </div>
        <el-button v-on:click.once="onSave" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div>
    </div>
</el-main>
</template>

<script>
import _ from "lodash";
import Json from "@/util/Json";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import MenuService from "@/services/MenuService";
import ConfirmModel from "@/components/ConfirmModel";

export default {
    name: "MenuFrom",
    components: {
        ConfirmModel
    },
    data() {
        return {
            requiredParam: {},
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                // isEditForm: false,
                // isNewForm: false,
            },
            pageTitle: "New menu",
            editorOptions: {
                mode: "text/javascript",
                theme: "default"
            },
            cp_menu: {},
            menuList: [],
            buttonKey: 1,
            isSaveData: false,
            isFormValid: true,
            endpoint: constants.MENU_ENDPOINT,
            validationRules: this.setValidationRules(),
            roles: constants.ROLES,
        };
    },
    watch: {
        cp_menu: {
            handler(newVal, oldVal) {
                if (!this.isSaveData) {
                    let cachedForm = _.pickBy(this.cacheDataModal.cachedForm, _.identity);
                    let cp_menu = _.pickBy(this.cp_menu, _.identity);
                    cachedForm = JSON.stringify(cachedForm).replace(/\\n|\\t|\\r/g, "");
                    cp_menu = JSON.stringify(cp_menu).replace(/\\n|\\t|\\r/g, "");
                    this.cacheDataModal.isFormEdited = cachedForm !=
                        cp_menu;
                }
            },
            deep: true
        }
    },
    methods: {
        async init() {
            const menuId = this.getMenuIdFromUrl();
            if (menuId) {
                let cp_menu = await CommonService.fetchById(
                    this.endpoint,
                    menuId
                ).catch(error => {
                    this.notifyError("Error while fetching menu data");
                });

                this.cp_menu =
                    (cp_menu && _.defaultsDeep(cp_menu, this.cp_menu)) || this.cp_menu;
                //this.cp_menu.roles = cp_menu.roles.join(",");
                this.cp_menu.roles = cp_menu.roles; //added beacause of multiple role selection
                // this.cacheDataModal.isEditForm = true;
                // this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.cp_menu
                };
                this.pageTitle = "Edit menu";
            } else {
                // this.cacheDataModal.isNewForm = true;
                // this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.cp_menu
                };
            }
        },
        getMenuIdFromUrl() {
            return this.$route.query.id || "";
        },
        async onSave() {
            let isValid = await this.$refs.ruleForm.validate().catch(error => {});
            this.isSaveData = true;
            this.isFormValid = isValid;
            this.cacheDataModal.isFormEdited = false;
            this.cp_menu.roles = _.isString(this.cp_menu.roles) ? this.cp_menu.roles.split(",") : this.cp_menu.roles;
            let cp_menu =
                isValid &&
                (await CommonService.save(this.endpoint, this.cp_menu).catch(error => {
                    this.isFormValid = false;
                    this.notifyError("Error while saving menu data!!");
                }));
            if (cp_menu) {
                this.cp_menu._id = cp_menu.data._id; 
                // add service id after first request to existing service object to avoid duplicate service entries
                this.notifySuccess("Menu saved successfully!!");
                this.displayList();

            }

            this.buttonKey++;
        },

        async fetchMenuList() {
            this.menuList = await MenuService.fetchMenuList().catch(error => {
                this.notifyError("Error while fetching menu list");
            });
        },

        displayList() {
            this.$router.push({
                path: "/menu-list"
            });
        },
        setValidationRules() {
            return {
                label: [{
                    required: true,
                    message: "Please input label",
                    trigger: "change"
                }],
                roles: [{
                    required: true,
                    message: "Please input roles",
                    trigger: "blur"
                }],
                url: [{
                    required: false,
                    message: "Please input url",
                    trigger: "change"
                }],
                order: [{
                    required: true,
                    message: "Please input order",
                    trigger: "change"
                }]
                // hidden: [{
                //     required: true,
                //     message: "Please input roles",
                //     trigger: "blur"
                // }],
            };
        },
        validateRequestHeader(rule, value, callback) {
            if (_.isEmpty(value)) {
                callback();
            }
            Json.isJson(value) ?
                callback() :
                callback(new Error("Please input correct JSON format!!"));
        }
    },

    beforeMount() {
        let user = this.$store.getters.user;
        if (user.roles.includes("admin")) {
            this.showList = true;
        }
        this.init();
        this.fetchMenuList();
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

.el-tabs__active-bar {
    height: 4px !important;
}

.el-tabs__nav-wrap {
    margin-bottom: 0px !important;
}

.section-id {
    height: 42px;
}

.el-tabs__content {
    padding: 0 0 0 15px !important;
}

.service-config-container {
    position: sticky;
    width: 100%;
    top: 0px;
    z-index: 999;

    .el-tabs__header {
        margin-bottom: 25px !important;
        padding: 0 !important;

        background: #f3f7fa;
        overflow: hidden;
        font-weight: 700;
    }

    .el-tabs__nav-wrap {
        a {
            text-decoration: none;
            color: #4a596a;
        }
    }
}

// form section
.form-section {
    padding: 10px;
    margin-bottom: 10px;

    .codemirror {
        border: 1px solid #dcdfe6;
        border-radius: 4px;
    }

    .el-input,
    .el-radio__label,
    .el-form-item__label,
    .el-select-dropdown__item,
    .el-button {
        font-size: $font-size-12;
    }

    .el-row {
        margin-bottom: 0px;
    }

    .form-heading {
        border-bottom: 1px solid #ebeef5;
        height: 15px;
        line-height: 15px;
        font-size: $font-size-12;
        font-weight: 500;
        font-weight: 700;
        text-transform: uppercase;
        padding: 0 16px;
        margin-top: 0;
        padding-bottom: 10px;
    }

    .el-select {
        width: 100%;
    }

    .el-form-item {
        margin-bottom: 0px;
    }

    .el-input__inner {
        height: 30px;
        line-height: 30px;
    }

    .el-form-item__error {
        position: relative;
        padding-top: 0px;
    }

    // Default Condition
    .el-tabs__content,
    .el-tabs__header {
        padding: 15px;
    }

    .object-container {
        background: $color-white;
        overflow: hidden;
        margin-bottom: 10px;

        .btn-addtag {
            margin-bottom: 20px;
        }

        .obj-name {
            background: #f3f7fa;
            padding: 5px 16px;
            margin: 0;
            font-weight: bold;
            text-transform: uppercase;
            font-size: $font-size-14;
        }

        .obj-name-container {
            i {
                cursor: pointer;
            }

            .obj-noneditable {
                font-weight: bold;
                font-size: $font-size-14;
                display: inline-block;
                line-height: 28px;
            }

            .right-icon-set {
                span {
                    cursor: pointer;
                    font-size: 17px;
                    padding: 0 5px;
                }

                display: inline-block;
                float: right;
                padding: 4px;
            }
        }

        .el-button--text {
            font-weight: bold;
        }

        .object-body {
            padding: 16px;

            .el-form-item {
                margin-bottom: 10px;
            }

            .tagname-container {
                border-bottom: 1px solid #dcdfe6;
                padding: 10px 0;
                margin-bottom: 10px;

                .el-input {
                    width: auto;
                    margin-right: 20px;
                }

                .tagname-code-area-container {
                    // background: #e4e7ed;
                    padding: 15px;
                    min-height: 100px;
                    vertical-align: top;
                    width: 55%;
                    display: inline-block;
                    margin-left: 20px;

                    .enter-code-indicator {
                        opacity: 0.5;
                    }
                }
            }
        }
    }

    // Default Condition
}

// end form section
</style>
