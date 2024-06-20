<template>
<div class="properties-container" v-loading="loading">
    <PropertiesHeader :currentNode="currentNode" :dialogFlowData="dialogFlowData" />
    <div class="content-body">
        <el-form :model="form" ref="form" label-width="110px" :rules="formRules">
            <div class="without-tabs-container">
                <el-form-item class="inline-label-item" label="Remote Host" prop="host">
                    <el-input v-model="form.host" placeholder="Please enter host details"></el-input>
                </el-form-item>

                <el-form-item class="inline-label-item" prop="username" label="Username">
                    <el-input v-model="form.username" placeholder="Please enter the username"></el-input>
                </el-form-item>                
                
                <el-form-item class="inline-label-item" prop="password" label="Password">
                    <el-input v-model="form.password" type="password" placeholder="Please enter the password"></el-input>
                </el-form-item>                
                
                <el-form-item class="inline-label-item" prop="protocol" label="Protocol">
                    <el-select clearable filterable class="inline-label-item" v-model="form.protocol" placeholder="Select protocol">
                        <el-option v-for="(item, index) in protocols" :key="index" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </el-form-item>
                
                <el-form-item class="inline-label-item" prop="port" label="Port">
                    <el-input v-model="form.port" placeholder="Please enter the port"></el-input>
                </el-form-item>

                <el-form-item class="inline-label-item" prop="upload_path" label="Upload Path">
                    <el-input v-model="form.upload_path" placeholder="Please provide the remote upload path"></el-input>
                </el-form-item>

                <el-form-item class="inline-label-item" prop="filelist" label="Files to upload">
                    <el-input v-model="form.filelist" placeholder="Please provide the file list to upload"></el-input>
                </el-form-item>
            </div>
        </el-form>
    </div>
    <PropertiesFooter :currentNode="currentNode" :form.sync="form" :dialogFlowData="dialogFlowData" :formRef="$refs" />
</div>
</template>

<script>
import PropertiesFooter from "@/dialogflow/components/properties/PropertiesFooter.vue";
import _ from "lodash";
// import Codemirror from "@/components/Codemirror.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import wfDirty from "@/mixins/wfDirty.js";
import Constants from "@/resources/Constants";
import Validator from "@/services/Validator";

export default {
    name: "FTP Upload",
    props: ["dialogFlowData", "currentNode", "documentTypes"],
    mixins: [wfDirty],
    components: {
        PropertiesHeader,
        PropertiesFooter
    },
    data() {
        
        return {
            protocols: Constants.FTP_PROTOCOLS,
            doucument_types: Constants.DOCEX.DOCUMENT_TYPE_LIST,
            form: {
                host: "",
                username: "",
                password: "",
                port: "",
                upload_path:"",
                filelist: ""
            },
            formRules: {
                host: [{
                    validator: Validator.EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide valid host",
                }, {
                    trigger: "blur",
                    required: true,
                    message: "Host is required"
                }, ],
                username: [{
                    validator: Validator.EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide valid username",
                }, {
                    trigger: "blur",
                    required: true,
                    message: "Username is required",
                }, ],
                password: [{
                    validator: Validator.EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide the password",
                },{
                    trigger: "blur",
                    required: true,
                    message: "Password is required",
                }],
                upload_path: [{
                    validator: Validator.EmptyValueValidator,
                    trigger: "blur",
                    message: "Please provide the Upload path",
                },{
                    trigger: "blur",
                    required: true,
                    message: "Upload path is required",
                }],
                
            },
        };
    },
    methods: {
        
        async init() {
            console.log("protocols", this.protocols);
            let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
            this.form = {
                node_id: nodeData["node_id"],
                ...this.form,
            };
            _.size(nodeData) > 1 ? (this.form = nodeData) : null;
            this.$nextTick(() => {
                this.clonedForm = JSON.parse(JSON.stringify(this.form))
            })
        },
        registerEvents() {
            
        },
        async postProcessing() {
            try {
                //__dynamic_fields is a list of special fields for which values will be evaluated as 
                // template string. e.g. value of upload path can be - /home/${context.workflowContext.get('filename')}
                this.form.__dynamic_fields = ["upload_path","filelist","host"];
                return true
            } catch (e) {
                console.log(e);
                return false;
            }
        },      

        handleError(message) {
            this.notifyError(message);
        }
    },
    beforeMount() {
        this.init();       
    },
};
</script>

<style lang="scss">

</style>
