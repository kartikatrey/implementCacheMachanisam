<template>
  <div class="property-bottom-actions">
    
      <el-button
        :disabled="disableButtons"
        v-on:click="hidePropertyWindow"
        size="mini"
        cid="doc-setup-form-cancel"
        name="cancel"
      >
        Cancel</el-button
      >
   
      <el-button
        :disabled="disableButtons"
        size="mini"
        cid="doc-setup-form-save"
        type="primary"
        v-on:click="saveForm"
        name="save"
      >
        Ok</el-button
      >
    </div>
</template>

<script>
import EventBus from "@/EventBus";

export default {
  name: "PropertiesFooter",
  props: ["currentNode", "type","dialogFlowData", "form", "formRef", "loading"],
  data() {
    return {
      disableButtons : false 
    };
  },

  methods: {
    async saveForm() {
      this.disableButtons = true
      EventBus.$emit("CLOSE_ON_MASK_CLICK", false);

      // Validate form
      let isFormValid = await this.formRef["form"]
        .validate()
        .catch((error) => error);
      if (!isFormValid) {
          this.disableButtons = false;
          EventBus.$emit("CLOSE_ON_MASK_CLICK", true);
          return this.notifyError("Please resolve the error");
      }
      // Process component internal functions
      this.$emit("update:loading", true);
      let isPostProcessingSuccess = true;
      this.$parent.$parent.postProcessing &&
        (isPostProcessingSuccess = await this.$parent.$parent.postProcessing());
      this.$parent.postProcessing &&
        (isPostProcessingSuccess = await this.$parent.postProcessing());
      this.disableButtons = false
      EventBus.$emit("CLOSE_ON_MASK_CLICK", true);

      if (isPostProcessingSuccess) {
        // save form data to parent component
        if(this.currentNode){
          this.currentNode.data = this.form;
          this.dialogFlowData.workflow_data.nodes[this.currentNode.id].data =
            this.form;
          this.currentNode.update();
        }
        if(this.type == 'Begin'){
          this.dialogFlowData.name = this.form.name;
          this.dialogFlowData.workflow_type = this.form.workflow_type;
          this.dialogFlowData.workflow_version = this.form.workflow_version;
        }
        this.hidePropertyWindow();
      }
    },

    hidePropertyWindow() {
      EventBus.$emit("VISIBLE_SLIDEOUT", false);
      this.$emit("update:loading", false);
    },
  },
};
</script>
<style lang="scss" >
</style>
