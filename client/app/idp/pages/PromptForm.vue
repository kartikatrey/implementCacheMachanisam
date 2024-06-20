<template>
  <el-main class="kp-main">
      <section class="prompt-form-page-body page-body">
  
          <div class="page-title">
            <el-button cid="form-header-back" v-on:click="onBack" icon="mdi mdi-arrow-left-circle-outline"></el-button>
              <span class="page-title-text">Prompt</span>
              <span>Add new Prompt</span>
          </div>
  
          <section class="form-page-container">
  
              <div class="panel">
                  <div class="panel-body">
                      <el-form label-position="left" :model="form" :rules="formRules" ref="form" label-width="120px">
                        <ConfirmModel ref="model"> </ConfirmModel>
  
                        <div class="grouping-tile" >General configuration</div>
  
                        <el-row :gutter="40">
                            <!-- Prompt label -->
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="label" label="Label">
                                        <el-input name="label" @change="handleLabelInput" v-model="form.label" cid="prompt-form-label" placeholder="Provide Prompt label..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <!-- Prompt name -->
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="name" label="Name">
                                        <el-input name="name" :disabled="form._id !== undefined"  v-model="form.name" cid="prompt-form-name" placeholder="Provide Prompt Name..."></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                          
                        <el-row :gutter="40">

                              <!-- Prompt type -->
                              <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="type" label="Type">
                                        <el-select
                                            cid="prompt-form-type"
                                            v-model="form.type"
                                            placeholder="Please select type of prompt"
                                            v-on:change="onPromptTypeChange"
                                            >
                                            <el-option
                                                v-for="(item,index) in promptTypes"
                                                :cid="'prompt-form-type_'+index"
                                                :key="item.value"
                                                :value="item.value"
                                                :label="item.label"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                              </el-col>

                              <!-- Prompt variable names -->
                              <el-col v-if="form.type === 'text'"  :span="12">
                                  <div class="kp-form-group">
                                      <el-form-item prop="variable_names">
                                        <template slot="label" class="variable-name-label">
                                            <span>Variable Names</span>
                                            <el-tooltip
                                                content="variables to replace with actual values in guidelines prompt"
                                                placement="top"
                                                effect="light">
                                                <span class="mdi mdi-information-outline"></span>
                                            </el-tooltip>
                                        </template>
                                        <el-input cid="prompt-form-variable-names" v-model="form.variable_names" 
                                          placeholder="Enter Variable Names">
                                        </el-input>
                                      </el-form-item>
                                  </div>
                              </el-col>
                              
                              <!-- Prompt temperature -->
                              <el-col v-if="form.type === 'image'"  :span="12">
                                  <div class="kp-form-group">
                                      <el-form-item prop="temperature" class="prompt-form-temperature">
                                        <template slot="label" class="temperature-label">
                                            <span>Temperature</span>
                                            <el-tooltip
                                                content="Adjusts response randomness. Higher values (e.g., 0.8) generate creative but less focused output. Lower values (e.g., 0.2) produce more focused and deterministic output."
                                                placement="top"
                                                effect="light">
                                                <span class="mdi mdi-information-outline"></span>
                                            </el-tooltip>
                                        </template>
                                        <el-input cid="prompt-form-temperature" controls-position="right" v-model.number="form.temperature" 
                                          placeholder="Enter temperature for the prompt" type="number" :precision="1" :min="0" :max="1" :step="0.1">
                                        </el-input>
                                      </el-form-item>
                                  </div>
                              </el-col>

                        </el-row>

                        <el-row :gutter="40">
                            <!-- LLM Type -->
                            <el-col v-if="form.type === 'image'" :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="llm_type" label="LLM Type">
                                        <el-select
                                            cid="prompt-form-llm-type"
                                            v-model="form.llm_type"
                                            placeholder="Select"
                                            v-on:change="onLLMTypeChange"
                                            >
                                            <el-option
                                                v-for="(item, index) in llmTypes"
                                                :cid="'prompt-form-llm-type_'+index"
                                                :key="item.value"
                                                :value="item.value"
                                                :label="item.label"
                                            ></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <!-- Prompt Max tokens -->
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="maxTokens" label="Max tokens" class="prompt-form-max-tokens">
                                        <el-input cid="prompt-form-max-tokens" v-model.number="form.max_tokens" type="number">
                                        </el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row :gutter="40">
                            <!-- Prompt model -->
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="model" label="Model">
                                        <el-select cid="prompt-form-model-type" v-model="form.model" placeholder="Select">
                                            <el-option v-for="(item,index) in modelOptions" :cid="'prompt-form-model-type_'+index" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>

                            <!-- Active flag -->
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="active" label="Active">
                                        <el-checkbox class="active-input" prop="active" v-model="form.active" :checked="form._id === undefined"></el-checkbox>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <el-row v-if="form.type === 'image'" :gutter="40">
                            <!-- Detail -->
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="detail" label="Detail">
                                        <el-select cid="prompt-form-detail" v-model="form.detail" placeholder="Select">
                                            <el-option v-for="(item,index) in Details" :cid="'prompt-form-detail_'+index" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="kp-form-group">
                                    <el-form-item prop="multi_images" label="Multi Images">
                                    <el-checkbox prop="multi_images" v-model="form.multi_images"></el-checkbox>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <!-- Prompt Description -->
                        <el-row :gutter="40">
                            <el-col>
                                <div class="kp-form-group">
                                    <el-form-item prop="description" label="Description">
                                        <el-input v-model="form.description" cid="prompt-form-description" :rows="5" placeholder="Enter description..." type="textarea"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <!-- System prompt -->
                        <el-row :gutter="40">
                            <el-col>
                                <div class="kp-form-group">
                                    <el-form-item prop="system_prompt" label="System Prompt">
                                        <el-input v-model="form.system_prompt" cid="prompt-form-system-prompt" :rows="5" placeholder="Enter System Prompt..." type="textarea"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <!-- User prompt -->
                        <el-row :gutter="40">
                            <el-col>
                                <div class="kp-form-group">
                                    <el-form-item prop="user_prompt" label="User Prompt">
                                        <el-input  v-model="form.user_prompt" cid="prompt-form-user-prompt" :rows="5" placeholder="Enter User Prompt..."   type="textarea"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <!-- Assistant prompt  -->
                        <el-row :gutter="40">
                            <el-col>
                                <div class="kp-form-group">
                                    <el-form-item prop="assistant_prompt" label="Assistant prompt">
                                        <el-input  v-model="form.assistant_prompt" cid="prompt-form-assistant-prompt" :rows="5" placeholder="Enter assistant prompt..."   type="textarea"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>

                        <!-- GuideLines Prompt -->
                        <el-row :gutter="40">
                            <el-col>
                                  <div class="kp-form-group">
                                      <el-form-item prop="guidelines_prompt" label="Guidelines Prompt">
                                          <el-input v-model="form.guidelines_prompt" cid="prompt-form-name-guidelines-prompt" placeholder="Enter Guidelines Prompt..." :rows="15" type="textarea" ></el-input>
                                      </el-form-item>
                                  </div>
                              </el-col>
                        </el-row>
                      </el-form>
                  </div>
                  <footer>
                      <div>
                      </div>
                      <div>
                          <el-button cid="prompt-form-cancel" size="small" v-on:click="onBack">Cancel</el-button>
                      </div>
                      <div>
                            <el-button v-if="form._id !== undefined" size="small" type="primary" :disabled="saveClicked" cid="propmts-form-submit" v-on:click="handleTestPromptClick"> 
                                Test
                            </el-button>
                      </div>
                      <div>
                            <el-button size="small" type="primary" cid="propmts-form-submit" :disabled="saveClicked" v-on:click="save"> 
                                Save
                            </el-button>
                      </div>
                  </footer>
              </div>
  
          </section>
  
      </section>
      
      <!-- Test TEXT TYPE prompt -->
      <TestTextPromptDialog v-if="textTypePrompt && showTestDialog" :fields="originalVariables" :showTestDialog="showTestDialog" :promptName="form.name" @closeTestDialog="showTestDialog = false"></TestTextPromptDialog>

      <!-- Test IMAGE TYPE prompt -->
      <TestImagePromptDialog v-if="imageTypePrompt && showTestDialog" :showTestDialog="showTestDialog" :promptName="form.name" :llmType="form.llm_type" @closeTestDialog="showTestDialog = false"></TestImagePromptDialog>

      <!-- Previous version list of prompt -->
      <VersionRelatedList :id="form._id !== undefined"  title="Prompt versions"></VersionRelatedList>

  </el-main>
  </template>
  
  <script>
  const _ = require("lodash");
  import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
  import TestTextPromptDialog from "@/idp/components/TestTextPromptDialog.vue";
  import TestImagePromptDialog from "@/idp/components/TestImagePromptDialog.vue";
  import ConfirmModel from "@/components/ConfirmModel";
  import constants from "@/resources/Constants";
  import DocumentService from "@/idp/services/DocumentService";
  import PromptService from "@/idp/services/PromptService";
  export default {
      name: "PromptForm",
      components: {
        VersionRelatedList,
        ConfirmModel,
        TestImagePromptDialog,
        TestTextPromptDialog,
      },
      data() {
          return {
              endpoint: constants.PROMPT_ENDPOINT,
              saveClicked: false,
              showTestDialog: false,
              originalVariables: "",
              form: {
                name: "",
                model: "",
                type: "",
                active: "",
                llm_type: "",
                max_tokens: 16,
                temperature: 0,
                user_prompt: "",
                system_prompt: "",
                guidelines_prompt: "",
                variable_names: "",
                multi_images: false
              },
              modelOptions: [],
              Details: [ {label: "High", value: "high"}, {label: "Low", value: "low"} ],
              llmTypes: constants.DOCEX.LLM_TYPES,
              promptTypes: [
                {
                    value: "image",
                    label: "Image"
                },
                {
                    value: "text",
                    label: "Text"
                }
              ],
              cacheDataModal: {
                cachedForm: {},
                isFormEdited: false,
                isInitialized: false,
              },
              formRules: {
                label: [
                    {
                        required: true,
                        message: "Please provide label name",
                        trigger: "blur"
                    }
                ],
                name: [
                    {
                        required: true,
                        message: "Please provide prompt name",
                        trigger: "blur",
                    },
                ],
                label: [
                    {
                        required: true,
                        message: "Please provide label for the prompt.",
                        trigger: "blur"
                    }
                ],
                description: [
                    {
                        required: true,
                        message: "Please provide description for the prompt."
                    }
                ],
                model: [
                    {
                        required: true,
                        message: "Please select mdoel",
                        trigger: "blur",
                    },
                ],
                user_prompt: [
                    {
                        required: true,
                        message: "Please enter user prompt",
                        trigger: "blur",
                    },
                ],
                assistant_prompt: [
                    {
                        required: true,
                        message: "Please enter assistant prompt",
                        trigger: "blur",
                    },
                ],
                system_prompt: [
                    {
                        required: true,
                        message: "Please enter system prompt",
                        trigger: "blur",
                    },
                ],
                guidelines_prompt: [
                    {
                        required: true,
                        message: "Please enter guidelines prompt",
                        trigger: "blur",
                    },
                ],
                type: [
                {
                    required : true,
                    message : "Please select type of prompt",
                    trigger: "blur"
                }
                ],
                variable_names: [
                    {
                        validator: (rule, value, callback) => {
                            if (this.form.type === 'text' && !value) {
                                callback(new Error('Please enter variable names'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur',
                    },
                ],
                temperature: [
                    {
                        validator: (rule, value, callback) => {
                            const isImageType = this.form.type === 'image';
                            const isNumber = typeof value === 'number';
                            const isValidRange = isNumber && value >= 0 && value <= 1;

                            if (isImageType && !isValidRange) {
                                callback(new Error('Please enter a temperature between 0 and 1'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'blur',
                    },
                ],
              },
          };
      },
      computed: {
        imageTypePrompt(){
            return this.form.type === "image";
        },
        textTypePrompt(){
            return this.form.type === "text";
        },
      },
      watch: {
          form: {
              handler(newVal, oldVal) {
                  if (this.cacheDataModal.isInitialized) {
                      this.cacheDataModal.isFormEdited = ( !_.isEqual(this.cacheDataModal.cachedForm, this.form) );
                  }
              },
              deep: true,
          },
      },
      async beforeMount() {
            this.$store.commit("setDisplayIdpTree",false);
            this.$store.commit("setDisplayIdpNavbar",true);

            const recordId = this.$route.query.id;
            const clonePrompt = this.$route.query.clone;

            await this.init(recordId, clonePrompt);
        },
      methods: {
          handleLabelInput() {
            if (this.form._id) {
                return;
            }
            let name = (this.form["label"] || "").trim().replace(/\s+/g, "_");
            name = name ? `${name.toLowerCase()}` : "";
            this.$set(this.form, "name", name);
            if (name) {
                this.$refs["form"].clearValidate(["name"]);
            }
        },
        onPromptTypeChange(promptType) {
            this.form.model = "";
            if (promptType == "text") {
                this.modelOptions = [
                    { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" }
                ]
            }
            else {
                this.modelOptions = [];
            }
        },
        onLLMTypeChange(llmType) {
            this.form.model = "";
            if (!llmType) {
                this.modelOptions = [];
            }
            this.modelOptions = constants.DOCEX.LLM_MODEL_MAP[llmType];
        },
        onBack() {
			this.$router.push("/idp/prompt-list");
		},
        clonePrompt(promptRecord) {
            const clonedPrompt = { ...promptRecord };
            const propertiesToRemove = [
                "_id",
                "created_at",
                "created_by",
                "updated_at",
                "updated_by",
                "updatedAt",
                "createdAt",
                "name",
                "label",
            ];
            propertiesToRemove.forEach(property => {
                if (clonedPrompt.hasOwnProperty(property)) {
                    delete clonedPrompt[property];
                }
            });

            return clonedPrompt;
        },
        async init(recordId, clonePrompt) {
            try {
                if (!recordId) {
                    return;
                }
                let promptRecord = await PromptService.findPromptbyId(recordId);
                if (clonePrompt == "true") {
                    promptRecord = this.clonePrompt(promptRecord);
                }
                if (promptRecord) {
                    this.form = Object.assign({}, this.form, promptRecord);
                    const promptType = _.get(this.form, "type");

                    // Set model options according to prompt type and llm type
                    if (promptType === "text") {
                        this.modelOptions = [
                            { label: "GPT-3.5 Turbo", value: "gpt-3.5-turbo" }
                        ]
                    }
                    else {
                        const llmType = _.get(this.form, "llm_type");
                        this.modelOptions = llmType ? constants.DOCEX.LLM_MODEL_MAP[llmType] : [];
                    }
                    this.originalVariables = this.form.variable_names;
                } else {
                    this.notifyError("Error while fetching prompt data");
                }
            } catch (error) {
                console.log(error);
                this.notifyError("Error while fetching prompt");
            }
		},
        /**
         * @Puropse : To format variables names into array
         * @Usage : We format comma seperated variable names into each string and push those strings in one array
         */
        formatVariableNamesIfString() {
            if(_.isString(this.originalVariables))
            {
                const formatted_variable_names = this.originalVariables.split(",").map(value => value.trim()).filter((value) => value !== "" && value.length>0);
                this.originalVariables = formatted_variable_names;
            }
        },
        async save() {
            this.saveClicked = true
            this.formatVariableNamesIfString();
            let valid = await this.$refs.form.validate().catch((error) => {});
            if (!valid) {
                this.saveClicked = false
                return;
            }

            try {
                const response = await PromptService.upsertPrompt(this.form)
                if (response) {
                    this.cacheDataModal.isFormEdited = false;
                    this.notifySuccess("Prompt saved successfully");
                    this.$router.push({
                        path: "/idp/prompt-list",
                    });
                } else {
                    this.isFormValid = false;
                    this.notifyError("Error while saving prompt data");
                }
            } catch (error) {
                console.log(error);
                this.notifyError("Error saving prompt");
            }
        },
        handleTestPromptClick(){
            this.formatVariableNamesIfString();
            this.showTestDialog = true;
        }
    },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
    .variable-name-label {
        display: flex;
    }
    .prompt-form-max-tokens input::-webkit-outer-spin-button,
    .prompt-form-max-tokens input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
  