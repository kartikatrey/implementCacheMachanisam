<template>
  <div v-loading="loading">
    <vue-query-builder
      v-if="isRulesLoaded"
      :rules="rules"
      @blur="onBlur"
      v-model="query"
      :labels="labels"
    ></vue-query-builder>
  </div>
</template>
<script>
import Constants from "@/resources/Constants";
import FieldService from "@/idp/services/FieldService";
import VueQueryBuilder from "vue-query-builder";
import ErrorCodeService from "@/idp/services/ErrorCodeService";

export default {
  name: "QueryBuilder",
  //dataToShow: ["fieldsData", "stageData", "stateData", "fileTypeData", "whoColumnsData"]
  props: [
    "query",
    "documentType",
    "documentSubtype",
    "index",
    "dataToShow",
    "additionalFilter",
    "labels",
    "listViewColumns",
    "additionalFields",
    "additionalOperators"
  ],
  components: {
    VueQueryBuilder,
  },
  watch: {
    query: {
      handler(newVal, oldVal) {
        if (!newVal || newVal == oldVal) {
          return;
        }
        this.changeInputTextPlaceholder();
        this.$emit("onQueryChange", { val: newVal, index: this.index });
      },
      immediate: true,
      deep: true,
    },
    documentType: {
      handler(newVal, oldVal) {
        if (!newVal || newVal == oldVal) {
          return;
        }
        try {
          this.isRulesLoaded = false;
          this.prepareRulesList();
        } catch (error) {
          console.error("Error ", error);
        }
      },
      immediate: true,
      deep: true,
    },
    documentSubtype: {
      handler: function (newVal, oldval) {
        if (newVal) {
          this.isRulesLoaded = false;
          this.prepareRulesList();
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      loading: false,
      isRulesLoaded: false,
      rules: [],
      fieldDataTypeMapping: {
        string: "text",
        date: "date",
        currency: "currency",
        dropdown: "text",
      },
    };
  },
  methods: {
    onBlur() {
      this.$emit("blur");
    },

    /**
     * Change input text placeholder based on selected option value
     */
    changeInputTextPlaceholder() {
        // Wait for the next DOM update cycle before executing the code
        this.$nextTick(() => {
            try {
                // Placeholder for begins with (range)
                const beginsRangePlaceholder = "eg. A-D, T, Y-Z OR 0-3, 7-9";
                // Set placeholder for selects with option value 'begins with (range)'
                $("select option[value='begins with (range)']:selected").parent("select").next("input[type='text']").attr("placeholder", beginsRangePlaceholder);
                
                // Placeholder for begins with (in)
                const beginsInPlaceholder = "eg. A, B, C OR 0, 1, 2";
                // Set placeholder for selects with option value 'begins with (in)'
                $("select option[value='begins with (in)']:selected").parent("select").next("input[type='text']").attr("placeholder", beginsInPlaceholder);
            } catch(error) {
                console.log(error);
            }
        });
    },

    /**
     * Add additional filter parameters to the field parameters.
     * @param {object} fieldParams - The original field parameters.
     * @returns {object} - The updated field parameters with additional filter parameters added.
     */
    addAdditionalFilterToFieldParams(fieldParams) {
        // Check if additionalFilter exists
        if (!this.additionalFilter) {
            return fieldParams; // Return original fieldParams if additionalFilter is not present
        }

        // Extract additionalFieldParams from additionalFilter
        const additionalFieldParams = _.get(this.additionalFilter, "fields");

        // Merge additionalFieldParams into fieldParams
        fieldParams = { ...fieldParams, ...additionalFieldParams };

        return fieldParams;
    },

    async prepareFieldsData() {
        const rules = [];
        let fieldListParams = {
            field_type: "header",
            document_type: this.documentType,
            document_subtype: this.document_subtype
        };
        fieldListParams = this.addAdditionalFilterToFieldParams(fieldListParams);

        const fieldsProjection = ["name", "label", "type", "field_type"];
        const fieldsListData = await FieldService.getFieldsList(fieldListParams, fieldsProjection).catch((err) => {
            console.log("Error encountered while getting Fields list: ", err);
            return false;
        });

        let textOperators = Constants.JSON_QUERY_OPERATORS["TEXT"] || [];
        let currencyOperators = Constants.JSON_QUERY_OPERATORS["CURRENCY"] || [];

        if (!_.isEmpty(this.additionalOperators)) {
            const additionalTextOps = _.get(this.additionalOperators, "TEXT", []);
            const additionalCurrencyOps = _.get(this.additionalOperators, "CURRENCY", []);
            textOperators = textOperators.concat(additionalTextOps);
            currencyOperators = currencyOperators.concat(additionalCurrencyOps);
        }

        _.map(fieldsListData, (fieldData) => {
            const type = this.fieldDataTypeMapping[fieldData.type] || "text";
            const ruleObj = {
                type: _.includes(["date", "currency"], type) ? "custom" : type,
                id: this.getFieldId(fieldData),
                label: this.getFieldLabel(fieldData)
            };
            if (type === "text") {
                ruleObj["inputType"] = "text";
                ruleObj["operators"] = textOperators;
            }
            type == "date" &&
            ((ruleObj["inputType"] = "date"),
            (ruleObj["operators"] = [
                "is before",
                "is after",
                "is not empty",
                "is empty",
                // "is equals",
                // "is same or before",
                // "is same or after",
                // "is before current",
                // "is after current",
            ]));


            if (type === "currency") {
                ruleObj["inputType"] = "number";
                ruleObj["operators"] = currencyOperators;
            }
            rules.push(ruleObj);
        });
      return _.sortBy(rules, "label");
    },

    getFieldId(fieldData) {
        return _.get(fieldData, "field_type") === "table" ? `line_${_.get(fieldData, "name")}` : _.get(fieldData, "name");
    },

    getFieldLabel(fieldData) {
        const fieldName = _.get(fieldData, "name");
        
        // Do not add (Line) keyword for line po number field
        if (_.get(fieldData, "field_type") === "table" && fieldName !== "line_po_number") {
            return `${_.get(fieldData, "label")} (Line)`;
        }
        return _.get(fieldData, "label");
    },

    prepareStageData() {
        return {
            type: "select",
            inputType: "select",
            operators: ["equals", "does not equal"],
            id: "stage",
            label: "Stage",
            choices: _.sortBy(Constants.DOCEX.ALL_LIST_STAGES, "label"),
        }
    },

    prepareAssignmentData() {
        return [{
            type: "select",
            inputType: "select",
            operators: ["equals"],
            id: "assigned_user",
            label: "Assigned User",
            choices: [
              {
                label:"Logged In User",
                value:"$loggedInUser",
              }
            ],
        },
        {
            type: "select",
            inputType: "select",
            operators: ["contains"],
            id: "assigned_group",
            label: "Assigned Group",
            choices: [
              {
                label:"Logged In User Group",
                value:"$loggedInUserGroup",
              }
            ],
        }
      ]
    },

    prepareStateData() {
      let statelist = {
        ...Constants.DOCEX.STATE_UPLOADED,
        ...Constants.DOCEX.STATE_PUBLISHED,
        ...Constants.DOCEX.APPROVAL_STATUS,
      };
      let stateListData = Object.entries(statelist).map(([key, value]) => ({
        value: value,
        label: key,
      }));
      let stateData = {
        type: "select",
        inputType: "select",
        operators: ["equals", "does not equal"],
        id: "state",
        label: "State",
        choices: stateListData
      }
      return stateData;
    },

    prepareFileTypeData() {
        return {
            type: "select",
            inputType: "select",
            operators: ["equals", "does not equal"],
            id: "file_type",
            label: "File type",
            choices: Constants.DOCEX.ALL_FILE_TYPES
        }
    },

    prepareWhoColumnData() {
        const rules = [];
        const whoColumns = [
            {key: "created_at", label: "Uploaded Date", field_type: "date"},
            {key: "updated_at", label: "Updated Date", field_type: "date"},
            {key: "published_at", label: "Published Date", field_type: "date"},
            {key: "created_by", label: "Uploaded By", field_type: "text"},
            {key: "updated_by", label: "Updated By", field_type: "text"}
        ];

        for (const whoColumn of whoColumns) {
            const type = whoColumn.field_type;
            let operators = Constants.JSON_QUERY_OPERATORS[type.toUpperCase()];

            // These operators should not be visible in operators dropdown for who columns data.
            const unwantedOperators = [
                "is equals",
                "partial match",
                "is same or before",
                "is same or after",
                "is before current",
                "is after current"
            ]
            operators = operators.filter(operator => !unwantedOperators.includes(operator));

            // Add additional operators if any present in props
            if (!_.isEmpty(this.additionalOperators)) {
                const additionalTextOps = _.get(this.additionalOperators, type.toUpperCase(), []);
                operators = operators.concat(additionalTextOps);
            }

            const rule = {
                type: type,
                inputType: type,
                operators: operators,
                id: whoColumn.key,
                label: whoColumn.label
            }
            rules.push(rule);
        }
        return rules;
    },

    async prepareErrorCodeData() {
      const errorCodes = await ErrorCodeService.get();
      const errorMap = errorCodes.map(error => ({
        label: error.code,
        value: error.code
      }));
      return {
        type: "select",
        inputType: "select",
        operators: ["contains", "does not contain"],
        id: "error_codes",
        label: "Error Code",
        choices: errorMap
      }
    },

    prepareMessagesData(){
      return{
        type: "select",
        inputType: "text",
        operators: ["contains", "does not contain"],
        id: "messages",
        label: "Messages",
        choices: [{
          label: "Messages"
        }],
      }
    },

    /**
     * Adds list view columns to existing rules if they are not already present.
     * @param {Array} existingRules - Array of existing rules.
     * @returns {Array} - Array of rules after adding list view columns.
     * Note - This method is used in case of Advance search
     */
    addListViewColumns(existingRules) {
        const rules = [];
        // Define fields to exclude from list view columns
        const fieldsToExclude = [
			"state",
			"view",
			"is_link_verified",
			"file_icon",
			"messages",
            "po_number",
			"assigned_user_name",
			"assigned_group_name"
		];

        for (const column of this.listViewColumns) {
            const fieldName = _.get(column, "name");

            if (fieldsToExclude.includes(fieldName)) {
                continue;
            }

            // Check if rule already exists for column
            const isRuleAlreadyPresent = existingRules.some(rule => rule.id === fieldName);
            if (isRuleAlreadyPresent) {
                continue;
            }

            // Check if column has a label
            if (!_.get(column, "label")) {
                continue;
            }

            // Determine column type and operators
            const type = _.get(column, "type", "text");
            let operators = Constants.JSON_QUERY_OPERATORS[type.toUpperCase()] || [];

            // Add additional operators if any present in props
            if (!_.isEmpty(this.additionalOperators)) {
                const additionalTextOps = _.get(this.additionalOperators, type.toUpperCase(), []);
                operators = operators.concat(additionalTextOps);
            }

            // Create rule object
            const rule = {
                type: type,
                inputType: type,
                operators: operators,
                id: fieldName,
                label: _.get(column, "label")
            };

            rules.push(rule);
        }

        return rules;
    },

    addAdditionalFields() {
        return this.additionalFields || [];
    },

    async prepareRulesList() {
        if (this.dataToShow.includes("fieldsData") && !this.documentType) {
            this.isRulesLoaded = true;
            return;
        }
        this.loading = true;
        let rules = [];
        const stageData = this.dataToShow.includes("stageData") ? this.prepareStageData(): [];
        rules = stageData && rules.concat(stageData)
        const stateData = this.dataToShow.includes("stateData") ? this.prepareStateData() : [];
        rules = stateData && rules.concat(stateData)
        const fileTypeData = this.dataToShow.includes("fileTypeData") ? this.prepareFileTypeData() : [];
        rules = fileTypeData && rules.concat(fileTypeData)
        const fieldsdata = this.dataToShow.includes("fieldsData") ? await this.prepareFieldsData() : [];
        rules = fieldsdata && rules.concat(fieldsdata)
        const messages = this.dataToShow.includes("messages") ? this.prepareMessagesData() : [];
        rules = messages && rules.concat(messages)
        const errorCode = this.dataToShow.includes("errorCode") ? await this.prepareErrorCodeData() : [];
        rules = errorCode && rules.concat(errorCode)
        const whoColumnData = this.dataToShow.includes("whoColumnsData") ? this.prepareWhoColumnData() : [];
        rules = whoColumnData && rules.concat(whoColumnData);
        const assignmentData = this.dataToShow.includes("assignmentData") ? await this.prepareAssignmentData() : [];
        rules = assignmentData && rules.concat(assignmentData);
        // In case of Advance search we add the list view column in rules
        const listViewColumns = !_.isEmpty(this.listViewColumns) ? this.addListViewColumns(rules) : [];
        rules = listViewColumns && rules.concat(listViewColumns);

        // Add additional fields if present in props
        const additionalFields = !_.isEmpty(this.additionalFields) ? this.addAdditionalFields() : [];
        rules = additionalFields && rules.concat(additionalFields);

        // Sort fields alphabetically
        rules = _.sortBy(rules, "label");

        // Remove duplicate field from rules
        rules = _.uniqBy(rules, 'id');

        // Adding default 1st rule as Select Field
        // As vue-query-builder does not have any placeholder for fields dropdown
        rules.unshift({type: "text", id: "select_field", label: "Select Field"});

        this.rules = rules;
        this.isRulesLoaded = true;
        this.loading = false;
        return true;
    },

    async init() {
      try {
        await this.prepareRulesList();
      } catch (error) {
        console.error("Error ", error);
      }
    },
  },
  beforeMount() {
    this.init();
  }
};
</script>

<style lang="scss">
@import "../_idpGlobal";
</style>
