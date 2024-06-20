<template>
    <el-main class="kp-main">

        <ConnectionLogsDialog :isDialogVisible="isDialogVisible" @onCancelClick="isDialogVisible = false">
        </ConnectionLogsDialog>

        <section class="page-body">

            <div class="page-title">
                <el-button cid="form-header-back" v-on:click="$router.push('/idp/input-channels')"
                    icon="mdi mdi-arrow-left-circle-outline"></el-button>
                <span class="page-title-text">Input channel</span>
                <span>Add new input channel and edit existing</span>
            </div>

            <section class="form-page-container">

                <div class="panel">
                    <div class="panel-body">
                        <el-form label-position="left" :model="form" :rules="formRules" ref="form" label-width="120px">
                            <ConfirmModel ref="model"></ConfirmModel>
                            <!-- basic content -->

                            <div class="grouping-tile">General configuration</div>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="type" label="Type">
                                            <el-select cid="input-channel-form-type-select" clearable filterable
                                                v-model="form.type" v-on:change="onTypeChange" placeholder="Select">
                                                <el-option v-for="(value, index) in input_channels"
                                                    :cid="'input-channel-form-type_' + index" :key="value.value"
                                                    :value="value.value" :label="value.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="name" label="Name">
                                            <el-input v-model="form.name" cid="input-channel-form-name"
                                                :disabled="form._id ? true : false"
                                                placeholder="Provide channel name..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item disabled label="File upload path">
                                            <el-input disabled class="upload_folder_path-input"
                                                cid="input-channel-form-upload-path" v-model="form.name"
                                                placeholder="Upload folder path..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="document_type" label="Document type">
                                            <el-select name="document_type" clearable filterable
                                                v-model="form.document_type" placeholder="Select">
                                                <el-option v-for="value in doucument_types" :key="value.value"
                                                    :value="value.value" :label="value.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40">
                                <el-col :span="12" v-if="form.type == 'EMAIL'">
                                    <div class="kp-form-group">
                                        <el-form-item prop="auth_type" label="Authorization Type">
                                            <el-select cid="input-channel-form-auth-type-select" clearable filterable
                                                v-model="form.auth_type" v-on:change="onAuthTypeChange"
                                                placeholder="Select">
                                                <el-option :cid="'input-channel-form-auth-type_' + index"
                                                    v-for="(value, index) in auth_type_list" :key="value.value"
                                                    :value="value.value" :label="value.label"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <el-col :span="12" v-if="form.type == 'EMAIL'">
                                    <div class="kp-form-group">
                                        <el-form-item prop="email_service_provider" label="Service provider">
                                            <el-select clearable filterable
                                                cid="input-channel-form-service-provider-select"
                                                v-model="form.email_service_provider" placeholder="Select mail provider"
                                                v-on:change="onProviderChange">
                                                <el-option v-for="(item, index) in mail_provider"
                                                    :cid="'input-channel-form-service-provider' + index" :key="item.value"
                                                    :label="item.label" v-bind:value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40" v-if="form.type == 'SHAREPOINT'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="host" label="Host">
                                            <el-input cid="input-channel-form-host" class="host-input" prop="host"
                                                v-model="form.host" placeholder="Provide host..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="site_path" label="Site path">
                                            <el-input class="port-input" cid="input-channel-form-site-path"
                                                prop="site_path" v-model="form.site_path"
                                                placeholder="Provide site path..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40"
                                v-if="showHostAndPort || !(['EMAIL', 'SHAREPOINT', 'API'].includes(form.type))">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="host" label="Host">
                                            <el-input class="host-input" cid="input-channel-form-host" prop="host"
                                                v-model="form.host" placeholder="Provide host..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="port" label="Port">
                                            <el-input class="port-input" cid="input-channel-form-port" prop="post"
                                                type="number" v-model="form.port"
                                                placeholder="Provide port..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40" v-if="form.auth_type == 'oauth2'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="tenant_id" label="Tenant Id">
                                            <el-input class="tenant_id-input" cid="input-channel-form-tenant-id"
                                                prop="tenant_id" v-model="form.tenant_id"
                                                placeholder="Provide tenant id..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="client_id" label="Client Id">
                                            <el-input class="client_id-input" cid="input-channel-form-client-id"
                                                prop="client_id" v-model="form.client_id"
                                                placeholder="Provide client id..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40" v-if="form.auth_type != 'oauth2' && form.type != 'API'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="username" label="Email">
                                            <el-input class="username-input" cid="input-channel-form-email"
                                                prop="username" v-model="form.username"
                                                placeholder="Provide username..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>

                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="password" label="Password">
                                            <el-input class="password-input" cid="input-channel-form-passowrd"
                                                prop="password" v-model="form.password" type="password"
                                                placeholder="Provide password..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>


                            <el-row :gutter="40"
                                v-if="form.auth_type == 'oauth2' && !['SHAREPOINT', 'API'].includes(form.type)">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="client_secret" label="Client secret">
                                            <el-input type="password" cid="input-channel-form-client-secret"
                                                class="client_secret-input" prop="client_secret"
                                                v-model="form.client_secret"
                                                placeholder="Provide client secret..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="username" label="Email">
                                            <el-input class="username-input" cid="input-channel-form-email"
                                                prop="username" v-model="form.username"
                                                placeholder="Provide username..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40" v-if="form.auth_type == 'oauth2' && form.type == 'SHAREPOINT'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="client_secret" label="Client secret">
                                            <el-input type="password" cid="input-channel-form-client-secret"
                                                class="client_secret-input" prop="client_secret"
                                                v-model="form.client_secret"
                                                placeholder="Provide client secret..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item label="Drive">
                                            <el-input v-model="form.drive" cid="input-channel-form-drive"
                                                placeholder="Provide drive.."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40" v-if="form.type == 'FTP'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="ftp_input_dir" label="Source directory">
                                            <el-input cid="input-channel-form-source-directory"
                                                class="ftp_input_dir-input" prop="ftp_input_dir"
                                                v-model="form.ftp_input_dir"
                                                placeholder="Provide source directory..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group" v-if="form.type == 'FTP'">
                                        <el-form-item prop="ftp_process_dir" label="Process directory">
                                            <el-input cid="input-channel-form-process-directory"
                                                class="ftp_process_dir-input" prop="ftp_process_dir"
                                                v-model="form.ftp_process_dir"
                                                placeholder="Provide path to keep all processed files"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40" v-if="form.type == 'EMAIL'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="filter_by_mailbox" label="Read email from folder">
                                            <el-input cid="input-channel-form-read-email-from-folder"
                                                class="filter_by_mailbox-input" prop="filter_by_mailbox"
                                                v-model="form.filter_by_mailbox"
                                                placeholder="Provide folder name to filter mails..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="filter_by_subject" label="Filter by subject">
                                            <el-input class="filter_by_subject-input"
                                                cid="input-channel-form-filter-by-subject" prop="filter_by_subject"
                                                v-model="form.filter_by_subject"
                                                placeholder="Provide subject name to filter mails..."></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item disabled label="Enable document classification">
                                            <el-checkbox cid="input-channel-form-enable-document-classification"
                                                v-model="form.is_classification_required"
                                                @change="handleClassificationCheckbox"></el-checkbox>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item disabled prop="org" label="Select Hierarchy">
                                            <org-hierarchy-list :onSelectEventName="onSelectEventName"
                                                cid="input-channel-form-hierarchy"
                                                :hideHigherThanLevel="hideHigherThanLevel" :selectedValue="form.org"
                                                v-model="form.org" ref="orgComp"></org-hierarchy-list>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row v-if="form.type == 'EMAIL'" :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="action_after_email_processed"
                                            label="After email is processed">
                                            <el-select clearable
                                                cid="input-channel-form-after-email-is-processed-select" filterable
                                                v-model="form.action_after_email_processed" placeholder="Select action"
                                                v-on:change="onActionChange">
                                                <el-option v-for="(item, index) in action_on_email"
                                                    :cid="'input-channel-form-after-email-is-processed' + index"
                                                    :key="item.value" :label="item.label"
                                                    v-bind:value="item.value"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12" v-if="form.action_after_email_processed == 'move_to_folder'">
                                    <div class="kp-form-group">
                                        <el-form-item prop="email_move_folder_path" label="Move email to folder">
                                            <el-input cid="input-channel-form-move-to-folder"
                                                class="email_move_folder_path-input"
                                                v-model="form.email_move_folder_path"
                                                placeholder="Provide folder path"></el-input>

                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40" v-if="form.type == 'SHAREPOINT'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="read_from_folder" label="Read from folder">
                                            <el-input cid="input-channel-form-read-from-folder" prop="read_from_folder"
                                                v-model="form.read_from_folder"
                                                placeholder="Provide folder name or path to read files"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="move_to_folder" label="Move to folder">
                                            <el-input cid="input-channel-form-move-to-folder" prop="move_to_folder"
                                                v-model="form.move_to_folder"
                                                placeholder="Provide move to folder path"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40" v-if="form.type == 'API'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item :rules="{
            required: true,
            message: 'Please generate API key ',
            trigger: 'blur',
        }" prop="api_key" label="Api Key">
                                            <api-key-generate cid="input-channel-form-api-key" :api_key="form.api_key"
                                                @sendApiKey="getApiKey"></api-key-generate>
                                            <!-- <el-input class="password-input" prop="api_key" v-model="form.api_key" type="password" placeholder="Provide api key"></el-input> -->
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40" v-if="form.type != 'API'">
                                <el-col :span="12" v-if="form.auth_type=='BASIC'">
                                    <div class="kp-form-group">
                                        <el-form-item prop="password_expiration_duration"
                                            label="Password expiration time">
                                            <el-input cid="input-channel-form-password-expiration-duration"
                                                type="number" v-model="form.password_expiration_duration"
                                                placeholder="Days"></el-input>
                                        </el-form-item>
                                    </div>
                                </el-col>
                                <el-col :span="12" v-if="form.type == 'EMAIL'">
                                    <div class="kp-form-group">
                                        <el-form-item disabled label="Enable Inline Attachment"
                                            prop="enable_inline_attachment">
                                            <el-checkbox cid="input-channel-form-enable-inline-attachment"
                                                v-model="form.allow_inline"></el-checkbox>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <!-- New Ignore Email List Field -->
                            <el-row :gutter="40" v-if="form.type == 'EMAIL'">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="ignore_email_list" label="Ignore Email List">
                                            <div>
                                                <el-tag v-for="(email, index) in form.ignore_email_list" :key="index"
                                                    closable @close="removeIgnoredEmail(index)">
                                                    {{ email }}
                                                </el-tag>
                                                <el-input v-model="newIgnoredEmail" placeholder="Add email to ignore list"
                                                    size="small" @keyup.enter.native="addIgnoredEmail">
                                                    <el-button slot="append" @click="addIgnoredEmail">Add</el-button>
                                                </el-input>
                                            </div>
                                        </el-form-item>
                                    </div>
                                </el-col>

                            <!-- New Accepted Email List Field -->

                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item prop="accept_email_list" label="Accept Email List">
                                            <div>
                                                <el-tag v-for="(email, index) in form.accept_email_list" :key="index"
                                                    closable @close="removeAcceptEmail(index)">
                                                    {{ email }}
                                                </el-tag>
                                                <el-input v-model="newAcceptEmail"
                                                    placeholder="Add email to accept list" size="small"
                                                    @keyup.enter.native="addAcceptEmail">
                                                    <el-button slot="append" @click="addAcceptEmail">Add</el-button>
                                                </el-input>
                                            </div>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>

                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <div class="kp-form-group">
                                        <el-form-item label="Active">
                                            <toggle-button :sync="true" :color="{
            checked: '#5f8fdf',
            unchecked: '#DCDFE6',
            disabled: '#CCCCCC',
        }" cid="input-channel-form-active-button"
                                                v-model="form.active"></toggle-button>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40">
                                <el-col :span="24">
                                    <div class="kp-form-group">
                                        <el-form-item prop="advanced_script" label="Script">
                                            <!-- <codemirror :value="form.advanced_script" v-model="form.advanced_script" :options="editorOptions"></codemirror> -->
                                            <KanverseEditor
                                                :options="{ 'width': '100%', 'height': '500px', 'language': 'businessRule' }"
                                                :content="form.advanced_script" :refreshModel="form._id !== undefined"
                                                v-model="form.advanced_script"
                                                @onDidChangeModelContent="handleContentChange">
                                            </KanverseEditor>
                                        </el-form-item>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-form>
                    </div> <!-- | panel body -->
                    <footer>
                        <div>
                        </div>
                        <div v-if="this.$route.query.id">
                            <TestConnectionButton :recordId="this.$route.query.id" :connectionType="'input_channel'"
                                @testConnectionRequested="isDialogVisible = true"></TestConnectionButton>
                        </div>
                        <div>
                            <el-button cid="input-channel-form-cancel" size="small"
                                v-on:click="$router.push('/idp/input-channels')">Cancel</el-button>
                        </div>
                        <div>
                            <el-button v-if="isSaveActionAllowed" size="small" type="primary" cid="input-channel-form-submit"
                                :disabled="saveClicked" v-on:click="save">Submit</el-button>
                        </div>
                    </footer>
                </div> <!-- | panel -->

            </section> <!-- | form-page-container -->

        </section>
        <VersionRelatedList v-if="showVersionList" :id="form._id" title="Channel rule versions"></VersionRelatedList>
    </el-main>
</template>

<script>
import Constants from "@/resources/Constants";
import navigation from "@/mixins/navigation.js";
import $ from "jquery";
import Codemirror from "@/components/Codemirror";
import KanverseEditor from "@/components/KanverseEditor";
import InputChannelService from "@/idp/services/InputChannel";
import ConfirmModel from "@/components/ConfirmModel";
import EventBus from "@/EventBus";
import Validator from "@/services/Validator";
import OrgHierarchyList from "@/idp/components/OrgHierarchyList.vue";
import CustomerConfig from "@/idp/services/DeCustomerConfig";
import ApiKeyGenerate from "@/idp/components/ApiKeyGenerate.vue";
const lodash = require("lodash");
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import TestConnectionButton from "@/idp/components/TestConnectionButton.vue";
import ConnectionLogsDialog from "@/idp/components/ConnectionLogsDialog.vue";
import formMixin from "@/mixins/formMixin.js";

export default {
    name: "InputChannelForm",
    mixins: [formMixin],
    components: {
        ConfirmModel,
        Codemirror,
        KanverseEditor,
        OrgHierarchyList,
        VersionRelatedList,
        ApiKeyGenerate,
        TestConnectionButton,
        ConnectionLogsDialog
    },
    data() {
        var EmptyValueValidator = (rule, value, callback) => {
            if (value && ("" + value).trim() === "") {
                callback(new Error("Please enter valid label name"));
            } else {
                callback();
            }
        };
        const storage = JSON.parse(localStorage.getItem('vuex'))
        const userOrg = storage["user"] && storage["user"]["org"] ? storage["user"]["org"] : null;

        return {
            pageTitle: "input channel",
            saveClicked: false,
            isSaveActionAllowed : true,
            hideHigherThanLevel: userOrg,
            isDialogVisible: false,
            form: {
                name: "",
                upload_folder_path: "",
                type: "",
                password: "",
                username: "",
                host: "",
                port: "",
                notification_emails: "",
                ftp_input_dir: "",
                ftp_process_dir: "",
                is_classification_required: false,
                allow_inline: false,
                org: "",
                auth_type: "",
                tenant_id: "",
                client_id: "",
                client_secret: "",
                email_move_folder_path: "",
                action_after_email_processed: "",
                api_key: "",
                advanced_script: "",
                active: true,
                ignore_email_list: [],
                accept_email_list: []
            },
            newIgnoredEmail: "", // New data property to store the email being added
            newAcceptEmail: "",
            cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isInitialized: false,
            },
            editorOptions: {
                mode: "text/javascript",
                theme: "default"
            },
            mail_provider: Constants.DOCEX.MAIL_SERVICE_PROVIDER,
            host_port_mapping: Constants.DOCEX.EMAIL_HOST_PORT_MAPPING,
            action_on_email: Constants.DOCEX.ACTION_ON_EMAIL,

            input_channels: Constants.DOCEX.INPUT_CHANNEL_LIST,
            auth_type_list: Constants.DOCEX.AUTH_TYPE,
            doucument_types: [],
            fields_message_mapping: {
                name: "Please provide channel name",
                type: "Please provide channel type",
                username: "Please provide email",
                password: "Please provide password",
                host: "Please provide host",
                port: "Please provide port",
                notification_emails: "Please provide emails",
                ftp_input_dir: "Please provide source directory path",
                filter_by_mailbox: "Please provide folder to filter mailbox",
                email_service_provider: "Please provide email service provider",
                document_type: "Please provide document type"
            },
            rules: {},
            showVersionList: true,
            formRules: {
                advanced_script: [
                    {
                        validator: Validator.scriptValidator,
                        trigger: "blur",
                        message: "Syntax errors found.", // This message replaced with actual sytanx error 
                    },
                    {
                        required: true,
                        message: "Script cannot be empty",
                        trigger: "blur",
                    },
                ],
                name: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide channel name",
                },
                {
                    required: true,
                    message: "Please provide channel name",
                    trigger: "blur",
                },
                ],
                org: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please select org hierarchy",
                },
                {
                    required: true,
                    message: "Please provide org hierarchy",
                    trigger: "blur",
                },
                ],

                type: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide channel type",
                },
                {
                    required: true,
                    message: "Please provide channel type",
                    trigger: "blur",
                },
                ],
                username: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide email",
                },
                {
                    required: true,
                    trigger: "blur",
                    message: "Please provide email",
                },
                ],
                password: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide password",
                },
                {
                    required: true,
                    message: "Please provide password",
                    trigger: "blur",
                },
                ],
                host: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide host",
                },
                {
                    required: true,
                    message: "Please provide host",
                    trigger: "blur",
                },
                ],
                port: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide port",
                },
                {
                    required: true,
                    message: "Please provide port",
                    trigger: "blur",
                },
                ],

                notification_emails: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide emails",
                },
                {
                    required: false,
                    message: "Please provide emails",
                    trigger: "blur",
                },
                ],
                ftp_input_dir: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide source directory path",
                },
                {
                    required: true,
                    message: "Please provide source directory path",
                    trigger: "blur",
                },
                ],
                // filter_by_subject: [
                //   {
                //     validator: EmptyValueValidator,
                //     trigger: "blur",
                //     message: "Please provide subject to filter mailbox",
                //   },
                //   {
                //     required: true,
                //     message: "Please provide subject to filter mailbox",
                //     trigger: "blur",
                //   },
                // ],
                filter_by_mailbox: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide folder to filter mailbox",
                },
                {
                    required: true,
                    message: "Please provide folder to filter mailbox",
                    trigger: "blur",
                },
                ],
                read_from_folder: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide folder to read from",
                },
                {
                    required: true,
                    message: "Please provide folder to read from",
                    trigger: "blur",
                },
                ],
                move_to_folder: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide folder to move to",
                },
                {
                    required: true,
                    message: "Please provide folder to move to",
                    trigger: "blur",
                },
                ],

                email_service_provider: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide email service provider",
                },
                {
                    required: true,
                    message: "Please provide email service provider",
                    trigger: "blur",
                },
                ],
                ftp_process_dir: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide process directory path",
                },
                {
                    required: true,
                    message: "Please provide process directory path",
                    trigger: "blur",
                },
                ],
                client_id: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide client id",
                },
                {
                    required: true,
                    message: "Please provide Please provide client id",
                    trigger: "blur",
                },
                ],
                tenant_id: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide tenan id",
                },
                {
                    required: true,
                    message: "Please provide Please tenan id",
                    trigger: "blur",
                }
                ],
                client_secret: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide client secret",
                },
                {
                    required: true,
                    message: "Please provide client secret",
                    trigger: "blur",
                }
                ],
                auth_type: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide authorization type",
                },
                {
                    required: true,
                    message: "Please provide authorization type",
                    trigger: "blur",
                }
                ],
                email_move_folder_path: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide folder path",
                },
                {
                    required: true,
                    message: "Please provide folder path",
                    trigger: "blur",
                }
                ],
                action_after_email_processed: [{
                    validator: EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide value",
                },
                {
                    required: true,
                    message: "Please provide value",
                    trigger: "blur",
                }
                ]
            },
            ftpRules: {},
            onSelectEventName: "INPUT_CHANNEL_FORM"
        };
    },
    watch: {
        form: {
            handler(newVal, oldVal) {
                if (this.cacheDataModal.isInitialized) {
                    this.cacheDataModal.isFormEdited =
                        JSON.stringify(this.cacheDataModal.cachedForm) !=
                        JSON.stringify(this.form);
                }
            },
            deep: true,
        },
    },
    methods: {
        handleContentChange(event, content) {
            this.form.advanced_script = content;
        },
        getApiKey(apiKey) {
            // this.form.api_key = apiKey;
            this.$set(this.form, "api_key", apiKey);
        },
        async getDocumentType() {
            const docTypeConfig = await CustomerConfig.getAllDocsCustConfiguration({ document_type: { $exists: true } });
            this.doucument_types = await CustomerConfig.getDocumentTypeList(docTypeConfig);
        },
        async init(recordId) {
            await this.getDocumentType();
            if (!recordId) {
                this.cacheDataModal.isInitialized = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.form,
                };
                return;
            }
            try {
                let channelData = await InputChannelService.fetchById(recordId);
                channelData.old_password = channelData.password;
                channelData.old_client_secret = channelData.client_secret;

                if (channelData.host) {
                    _.each(this.host_port_mapping, (mapping, key) => {
                        if (mapping.host === channelData.host)
                            channelData.email_service_provider = key;
                    });
                }
                if (!channelData.email_service_provider)
                    channelData.email_service_provider = "other";

                this.form = Object.assign({}, this.form, channelData);
                this.cacheDataModal.isInitialized = true;
                this.cacheDataModal.isFormEdited = false;
                this.cacheDataModal.cachedForm = {
                    ...this.form,
                };
                this.addRules();

            } catch (error) {
                this.notifyError("Error");
            }
        },
        onProviderChange() {
            let formData = this.form;
            let type = this.form.type;
            let emailProvider = formData.email_service_provider;
            let mapping = this.host_port_mapping[emailProvider];
            this.showHostAndPort = false;
            if (!mapping) this.showHostAndPort = true;
            this.$set(this.form, "host", lodash.get(mapping, "host", ""));
            this.$set(this.form, "port", lodash.get(mapping, "port", ""));
        },

        onTypeChange() {
            this.addRules();
            this.showHostAndPort = true;
            if (this.form.type === 'SHAREPOINT') this.$set(this.form, "auth_type", "oauth2");
            if (this.form.type !== "FTP") {
                this.showHostAndPort = false;
                this.$set(this.form, "tenant_id", "");
                this.$set(this.form, "client_secret", "");
                this.$set(this.form, "client_id", "");
            }
            if (this.form.type !== "API") {
                this.showHostAndPort = false;
            }
            this.$set(this.form, "host", "");
            this.$set(this.form, "port", "");
            this.$set(this.form, "password", "");
            this.$set(this.form, "username", "");
        },
        onActionChange() {
            if (this.form.action_after_email_processed == "mark_as_read") {
                this.$set(this.form, "email_move_folder_path", "");

            }
        },
        onAuthTypeChange() {

        },
        handleClassificationCheckbox() {
            (this.form.is_classification_required && this.form.type !== 'API') ? this.removeDocumentTypeValidation() : this.addDocumentTypeValidation()
        },
        addDocumentTypeValidation() {
            this.formRules = _.merge(this.formRules, {
                document_type: [{
                    validator: this.EmptyValueValidator,
                    trigger: "change",
                    message: "Please provide document type",
                },
                {
                    required: true,
                    message: "Please provide document type",
                    trigger: "change",
                }]
            })
        },
        removeDocumentTypeValidation() {
            this.$delete(this.formRules, "document_type")
        },
        async save() {
            this.saveClicked = true
            let valid = await this.$refs.form.validate().catch((error) => {
            });
            if (!valid) {
                this.saveClicked = false
                return;
            }

            if (this.form.type != "FTP") return this.insertRecord();
            InputChannelService.testConnection(this.form).then((response) => {
                console.log(response);
                response = response.data;
                if (!response.success) {
                    return this.handleError(response.message);
                }
                this.insertRecord();
            });
        },

        setUploadFolderPath() {
            this.form.upload_folder_path = this.form.name;
        },

        insertRecord() {
            this.cacheDataModal.isFormEdited = false;
            this.setUploadFolderPath();
            InputChannelService.save(this.form)
                .then((response) => {
                    if (
                        _.get(response, "data.name") == "MongoError" &&
                        _.get(response, "data.errmsg").includes("duplicate key")
                    ) {
                        return this.handleError("Channel name is already present. ");
                    }
                    if (response.status == 200 || response.status == 201) {
                        if (!response.data.status && response.data.statusMessage) {
                            return this.handleError(response.data.statusMessage);
                        }
                        this.notifySuccess("Record saved successfully");
                        this.cacheDataModal.isFormEdited = false;
                        this.$router.push({
                            path: "/idp/input-channels",
                        });
                        return;
                    }
                    this.handleError("Something went wrong.");
                })
                .catch((error) => {
                    this.handleError("Error while processing");
                });
        },
        handleError(message) {
            this.saveClicked = false
            this.notifyError(message);
        },
        addRules() {
            let type = this.form.type;
            let typeRules = this[`${type.toLocaleLowerCase()}Rules`];
            this.formRules = _.merge(this.formRules, typeRules);
            this.handleClassificationCheckbox();
        },

        addFormRules() {
            let rules = {};
            _.each(this.fields_message_mapping, (message, field) => {
                let ruleArr = [];
                ruleArr.push({
                    validator: this.EmptyValueValidator,
                    trigger: "blur",
                    message: message,
                });
                ruleArr.push({
                    required: true,
                    message: message,
                    trigger: "blur",
                });
                rules[field] = ruleArr;
            });
            this.rules = rules;
        },

        addIgnoredEmail() {
            if (this.newIgnoredEmail && !this.form.ignore_email_list.includes(this.newIgnoredEmail)) {
                this.form.ignore_email_list.push(this.newIgnoredEmail);
                this.newIgnoredEmail = "";
                this.checkEmailListConflict();
            }
        },

        removeIgnoredEmail(index) {
            this.form.ignore_email_list.splice(index, 1);
        },
        addAcceptEmail() {
            if (this.newAcceptEmail && !this.form.accept_email_list.includes(this.newAcceptEmail)) {
                this.form.accept_email_list.push(this.newAcceptEmail);
                this.newAcceptEmail = "";
                this.checkEmailListConflict();
            }
        },

        removeAcceptEmail(index) {
            this.form.accept_email_list.splice(index, 1);
        },
        checkEmailListConflict(){
      if(this.form.accept_email_list.length > 0 && this.form.ignore_email_list.length > 0 ){
        this.$notify({
                title: "Warning",
                message: "The Accept Email List has been filled. Any emails or domains in the Ignore Email List will not be considered.",
                type: "warning",
        });
      }
    },
    },
    beforeDestroy() {
        EventBus.$off(["ON_SELECT_ORG_HIERARCHY_" + this.onSelectEventName]);
    },
    async beforeMount() {
        this.isSaveActionAllowed = await this.isSaveActionPermitted('input_channel');
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",true);
        EventBus.$on("ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName, (data) => {
            this.form.org = data && data.org
        })
        let recordId = this.$route.query.id;
        this.addFormRules();

        this.init(recordId);

        window.addEventListener("beforeunload", (event) => {
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
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
</style>