<template>
  <div v-if="formConfig">
    <FormulateForm :schema="formConfig.schema"  v-model="formData" @input="handleFormInputChange"/>
  </div>
</template>

<script>
import DynamicFormService from '@/idp/services/DynamicFormService';
import _ from "lodash";

export default {
  props: {
    formId: String,
    formData: Object,
    globalProps: Object,
    fieldProps: Object,
    fieldMessageMap: Object,
    documentId: String,
    documentType: String
  },

  data() {
    return {
      formConfig: null,
    };
  },

  async mounted() {
    await this.init();
    const interval = setInterval(()=>{
      const groupKeys = Object.keys(_.get(this.formConfig, 'groups', {}));
      if (groupKeys.length > 0) {
        const existingGroupElement = document.getElementById(groupKeys[0] + "_label");
        if (existingGroupElement) {
          clearInterval(interval);
        }
      }
    
  },1000);
  },
  methods: {
    /**
     * Purpose : Check for duplicate sections in the group
     * Usage : If any group allow_duplicate key is false => then we didn't check for that group
     * @returns {Array} duplicate 
     * e.g [ 0, 1 ] If 0 & 1 are duplicates in the group
     */
    getDuplicateSections(groupName, groupData) {
      const duplicates = [];
      const groupConfig = this.formConfig.schema.filter( group => group.name === groupName )
      if(_.get(groupConfig[0], "allow_duplicate")){
        return ;
      }
      groupData.forEach((section, index) => {
        const isDuplicate = groupData.some((item, idx) =>
          !_.isEmpty(section) && index !== idx && _.isEqual(section, item)
        );

        if (isDuplicate) {
          duplicates.push(index);
        }
      });
      return duplicates;
    },
    /**
     * @Purpose : To check if any duplicate sections are present in the form
     * @Usage : 
     * Step 1. We get all the repeatable groups from the formData
     * Step 2. Then we checked is duplicate enable for that repeatable group
     * Step 3. If duplicate is not allowed then we find duplicated indexes in that group
     * Step 4. We create one map group with duplicate indexes array
     * Step 5. We add one error div in each index mapped with group of duplicate section
     */
    checkForDuplicateSections() {
      // Find repeatable section from the form Data
      const repeatableGroups = {};
      for (const key in this.formData) {
        if (this.formData[key].length > 1) {
          repeatableGroups[key] = this.formData[key];
        }
      }

      if(!Object.keys(repeatableGroups).length){
        return ;
      }

      const duplicatesIndexesByGroup = Object.entries(repeatableGroups)
        .map(([groupName, groupData]) => {
          const duplicatesIndexes = this.getDuplicateSections(groupName, groupData);
          return [groupName, duplicatesIndexes];
        })
        .filter(this.getGroupsWithMultipleItems) // Remove groups in which duplicates are not present
        .reduce(this.convertToObject, {}); // Convert array of array to key and values

      if(Object.keys(duplicatesIndexesByGroup).length){
        this.addDuplicateMessagesToGroups(duplicatesIndexesByGroup);
        return true;
      }
      return false; // Proceed to save the form
    },
    /**
     * @Purpose : Add message to each duplicate section in the form
     * @param {Object} { groupName : [ duplicate indexes array ] } 
     * @Usage : 
     * Step 1. Get parent div of each group
     * Step 2. Traverse indexes array againts group and add new div of error message to each section
     */
    addDuplicateMessagesToGroups(duplicateGroups) {
      for (const groupName in duplicateGroups) {
        const parentDiv = document.querySelector(`[aria-labelledby="${groupName}_label"]`);
        if (parentDiv) {
          const sections = parentDiv.querySelectorAll('.formulate-input-group-repeatable');
          const indexes = duplicateGroups[groupName];
          indexes.forEach(targetIndex => {
            if (targetIndex >= 0 && targetIndex < sections.length) {
              const existingDiv = sections[targetIndex].querySelector('.duplicate-section-msg');
              if (!existingDiv) {
                const newDiv = document.createElement('div');
                const spanElement = document.createElement('span');
                newDiv.className = 'duplicate-section-msg';
                spanElement.textContent = '* Duplicate section found!';
                newDiv.appendChild(spanElement);
                sections[targetIndex].prepend(newDiv) // add error div at 0th position
              }
            }
          });
        }
      }
    },
    getGroupsWithMultipleItems([_, indexes]) {
      return indexes && indexes.length > 1;
    },
    convertToObject(acc, [groupName, indexes]) {
      acc[groupName] = indexes;
      return acc;
    },
    async init() {
      try {
        let params = { globalProps: this.globalProps, documentId: this.documentId, documentType: this.documentType };
        // we have maintained "status" key along with formConfig so changed code to get formConfig only from response
        const configResponse= await DynamicFormService.getFormConfigById(this.formId, params);
        this.formConfig =configResponse.formConfig;
        this.$emit("formConfigChange", configResponse);

        // Call changeGroupStyle after the form is created
        this.$nextTick(this.changeGroupStyle);
      } catch (error) {
        console.error("Error fetching schema:", error);
      }
    },
    /**
     * changeGroupStyle()
     * * Purpose: To add the divider in between form groups 
     * Dynamic form has several different groups, to differentiate between groups added el-divider
     */
    changeGroupStyle() {
      const groups = _.get(this.formConfig, 'groups', {});
      if(_.isEmpty(groups)){
        return;
      }
      for (let groupKey in groups) {
        const existingGroupElement = document.getElementById(groupKey + "_label");
        if (existingGroupElement) {
          const groupHtmlElement = document.createElement("div");
          groupHtmlElement.className = "el-divider el-divider--horizontal";
          groupHtmlElement.innerHTML = `<div class="el-divider__text is-left">${groups[groupKey]}</div>`;
          existingGroupElement.parentNode.replaceChild(groupHtmlElement, existingGroupElement);
        }
      }

      // Change duplicate section button styling
      var repeatableSections = document.querySelectorAll('.formulate-input-group-add-more');
      repeatableSections.forEach(function(section) {
        var addButton = section.querySelector("button");
        addButton.classList.add("el-button", "el-button--primary");
      });
      /**
       * Purpose: Ensure at least one section remains in the repeatable group by hiding the delete button for the 0th index.
       * Usage: Retrieve all repeatable groups and remove the delete button for the 0th index in each repeatable section.
      */
      const repeatableDomGroups = document.querySelectorAll(".formulate-input-grouping")
      for(const group of repeatableDomGroups){
          const section = group.querySelector("div")
          const deleteBtn = section.querySelector("a")
          deleteBtn.style.display = "none"
      }
    },

    handleFormInputChange(formData) {
      // Triggered when any form data change. Useful to do any action on data change
      this.$emit("formDataChanged", formData);
    },

  },
};
</script>

<style lang="scss">
/* Styles as before */
</style>

<style lang="scss">
.form-title {
  margin: 1.25rem 0;
}
@media (min-width: 420px) {
  .double-wide {
    display: flex;
  }
  .double-wide .formulate-input {
    flex-grow: 1;
    width: calc(50% - .1em);
  }
  .double-wide .formulate-input:first-child {
    margin-right: .1em;
  }
  .double-wide .formulate-input:last-child {
    margin-left: .1em;
  }
}
.formulate-input[data-classification='text'] input:disabled {
  background-color: #f0f0f0;
  color: #999999;
  cursor: not-allowed;
}

a.formulate-input-group-repeatable-remove {
  width: 15px !important;
}

.error-help-text {
  color: red;
}

.warning-help-text {
  color: orange;
}

.success-help-text {
  color: green;
}

.formulate-input-group-repeatable .duplicate-section-msg{
  width: 100% !important;
  color: red;
  margin: 10px;
}
</style>