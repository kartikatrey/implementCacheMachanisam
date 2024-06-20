<template>
    <el-dialog width="60%" :visible.sync="showTestDialog" :close-on-click-modal="false" class="test-text-prompt-dialog">
        
        <!-- Section: Prompt Test Form  -->
        <el-divider>
            <div class="prompt-test-section-title section-title">Test Prompt</div>
        </el-divider>

        <section class="prompt-test-section prompt-test-form" :class="{ 'scrollable-section': fields.length > 5 }">
            <el-form ref="testForm" :model="testForm" :rules="formRules" label-width="120px">
                <el-row v-for="(field, index) in fields" :gutter="40">
                    <el-col class="kp-form-group">
                        <el-form-item :prop="field" :label="field" :cid="`test-prompt-form-${field}`" class="prompt-test-form-item">
                            <el-input 
                                :id="`prompt-test-form-${field}-input`"
                                :name="field" 
                                :placeholder="`Enter the value for ${field}`" 
                                :rows="2"
                                v-model="testForm[field]"
                                type="textarea"
                            >
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </section>

        <!-- Section: Prompt test result -->
        <el-divider>
            <div class="prompt-test-section-title section-title">Test result</div>
        </el-divider>

        <section class="prompt-test-section prompt-test-result" v-loading="testBtnClicked" :class="{ 'scrollable-section': testResult.length > 90 }">
            <span id="prompt-test-result-text">{{testResult}}</span>
            <div class="text-result-buttons">
                <i
                    class="icon-top-right mdi"
                    :class="{'mdi-content-copy': !copied, 'mdi-check': copied}"
                    @click="copyToClipboard"
                ></i>
                <i
                    class="icon-top-right mdi mdi-creation"
                    @click="formatText"
                ></i>
            </div>
        </section>

        <!-- Section: Prompt Form footer -->
        <section class="prompt-test-section prompt-test-footer">
            <el-button size="small" @click="onCancelClick" class="kp-btn-form-outline">Cancel</el-button>
            <el-button size="small" type="primary" @click="testTextTypePrompt" :disabled="testBtnClicked">Test</el-button>
        </section>

    </el-dialog>
</template>

<script>
import openAiService from "@/idp/services/openAiService";
import _ from "lodash";

export default {
    name: "TestTextPromptDialog",

    props: [ "promptName", "fields", "showTestDialog" ],

    data() {
        return {
            testForm : {},
            formRules: {},
            testResult : "",
            testBtnClicked : false,
            copied : false,
        };
    },

    watch: {
        showTestDialog : {
            handler: function (newVal, oldVal){
                if(newVal !== oldVal){
                    this.$emit("closeTestDialog");
                }
            }
        }
    },

    methods: {
        onCancelClick() {
            this.showTestDialog = false;
            this.$emit("closeTestDialog");
        },
        async testTextTypePrompt() {
            try {
                let valid = await this.$refs.testForm.validate().catch((error) => { });
                if (!valid) {
                    this.notifyError("Please fill all required fields in the test prompt form.");
                    return;
                }
                this.testBtnClicked = true;
                const params = {
                    action: "test",
                    prompt_type: "text",
                    prompt_name : this.promptName,
                    variable_values : this.testForm
                }
                const response = await openAiService.testPrompt(params);
                this.testResult = _.get(response, "data.data");
                this.notifySuccess("Test case run successfully.");
                this.testBtnClicked = false;
            } catch (error) {
                this.testBtnClicked = false;
                this.testResult = error.message;
                console.log("Error while testing prompt.", error);
                this.notifyError("Error while testing prompt.");
            }
        },
        copyToClipboard() {
            this.copied = true;
            var textToCopy = document.getElementById('prompt-test-result-text');
            var range = document.createRange();
            range.selectNode(textToCopy);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();   
            setTimeout(() => { this.copied = false; }, 1000);
        },
        formatText(){
            if (typeof this.testResult === 'object') {
                this.testResult = JSON.stringify(this.testResult, null, 4);
            }
        },
    },

    created() {
        this.fields.forEach(field => {
            this.$set(this.formRules, field, [{ required : true, message : `Please enter the value for ${field}`, trigger : "blur" }]);
        })
    }

}

</script>

<style lang="scss">

@import "../_idpVariables";
@import "../_idpGlobal";
@import "../_idpVariablesDark";
@import "../_idpGlobalDark";

.test-text-prompt-dialog{
    .prompt-test-dialog-title{
        span {
            font-size: 16px;
            font-weight : 700;
        }
    }
    
    .prompt-test-section{
        overflow-x : hidden;
        padding: 15px;
    }
    
    .prompt-test-form {
        height : 200px;
        border: 1px solid var(--brand-01);
        border-radius: 4px;
    }
    
    .prompt-test-result{
        height: 100px;
        border: 1px solid var(--brand-01);
        display: flex;
        justify-content: space-between;
        border-radius: 4px;

    
        i {
            cursor: pointer;
            margin-left: 2rem;
        }
    
        span {
            white-space: pre-wrap;
            font-size: 16px;
            font-weight: 400;
        }
    }
    
    .prompt-test-section-title{
        padding: 5px 0 5px 0;
        font-size: 16px;
    }
    
    .prompt-test-form .prompt-test-form-item {
        display: flex;
        align-items: center;
    
        .el-form-item__content {
            width: 100%
        }
    }
    
    .prompt-test-footer {
        height: 25px;
        text-align: right;
    }
    
    .scrollable-section {
        overflow-x: hidden;
        overflow-y: auto;
    }
    
    .mdi-content-copy {
      color: var(--brand-03);           //blue-color
    }
    
    .mdi-check {
      color: var(--green-03);                 //green
    }

    .mdi-creation{
        color: var(--brand-03);           //blue-color
    }
    
    .el-dialog{
        padding: 2rem 3rem 0.5rem 3rem;
        margin-top: 3rem !important;
    }
}

</style>