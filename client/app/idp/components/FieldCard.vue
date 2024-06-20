<template>
  <el-card
    v-if="isFieldVisible"
    class="box-card"
    @click.native="handleFocus()"
    v-bind:class="[
      (selectedField && selectedField.field_config.name == props.field_config.name) ? 'card-focus' : '',
    ]"
    :id="props.field_config.name"
  >
    <div slot="header" class="clearfix">
       <el-tooltip
            slot="reference"
            class="item"
            effect="light"
            :content= "showContent()"
            placement="top-start"
          >
      <span class="message">
                {{showLabel()}}
       
        <span v-if="showConfidenceScore" :class="getPercentageClass(props)">
          {{
            props["value"] !== null &&
            props["bounds_score"] &&
            !isNaN(props["bounds_score"])
              ? ` (${parseFloat("" + props["bounds_score"]).toFixed(2)}%)`
              : ""
          }}
        </span>
      </span>
       </el-tooltip>
      
      <!-- Show source icon and tooltip content -->
      <el-tooltip slot="reference" class="item" effect="light" :content= "showSrcIconContent()" placement="top-start">
        <span v-if="props.value" :class=getSourceIconClass()></span>
      </el-tooltip>
      
      <span
        class="mdi mdi-check-circle-outline icon-check"
        v-if="isValidationMsgsEmpty"
        style="color: green"
      ></span>
      <span
        v-if="hasErrorMessage"
        class="mdi mdi-alert-circle-outline icon-error"
      ></span>
      <span
        v-if="hasWarningMessage"
        class="mdi mdi-alert-circle-outline icon-warning"
      ></span>
    </div>
       <component
             class="form-control"
             v-bind:is="componentName"
             :props="props"
             :propData="propData"
             :isDocumentReadOnly="isDocumentReadOnly"
             :docxConfig="docxConfig"
        ></component>
      <span class="error-msg" v-if="hasErrorMessage">{{ errorMessage }}</span>
      <span class="warning-msg" v-if="hasWarningMessage">{{ warningMessage }}</span>
  </el-card>
</template>

<script>
import _ from "lodash";
import DatePicker from "@/idp/components/DatePicker.vue";
import Input from "@/idp/components/Input.vue";
import Dropdown from "@/idp/components/Dropdown.vue";
import MultiSelect from "@/idp/components/MultiSelect.vue";
import Checkbox from "@/idp/components/CheckBox.vue";
import Constants from "@/resources/Constants";
import { mapState } from "vuex";

export default {
  name: "FieldCard",
  props: [
    "props",
    "isDocumentReadOnly",
    "isFieldVisible",
  ],
  watch: {},
  data() {
    return {
      showConfidenceScore:false,
      validationMsgs : []
    };
  },
  inject:['getDocumentConfiguration'],
  watch: {},
  computed: {
      ...mapState("documentViewStore",{
            // selectedField: state => state.selectedField,
            propData: state =>state.propData,
            fieldData: state =>state.fieldData,
            docxConfig : state => state.docxConfig,
        }),
         selectedField(){
                          return this.$store.getters["documentViewStore/selectedField"];
            },
    componentName(){
      return Constants.DOCEX.FIELD_COMPONENT_MAPPING[this.props.field_config.type];
    },
    isValidationMsgsEmpty() {
      return this.validationMsgs.length === 0;
    },
    hasErrorMessage() {
      return (
        this.validationMsgs.length &&
        this.validationMsgs[0].message_type === 'ERROR'
      );
    },
    hasWarningMessage() {
      return (
        this.validationMsgs.length &&
        this.validationMsgs[0].message_type === 'WARNING'
      );
    },
    errorMessage() {
      return this.hasErrorMessage ? this.validationMsgs[0].message : '';
    },
    warningMessage() {
      return this.hasWarningMessage ? this.validationMsgs[0].message : '';
    },
  },
  methods: {
    getPercentageClass(props) {
      return (
        "percentage" +
        (props["value"] !== null &&
        props["bounds_score"] &&
        !isNaN(props["bounds_score"])
          ? (parseFloat("" + props["bounds_score"]) > 80 && " high") ||
            (parseFloat("" + props["bounds_score"]) > 60 && " medium") ||
            " low"
          : "")
      );
    },

    /**
     * To get the Icon according to the field source
     * Current field sources - document, email, br
     */
    getSourceIconClass() {
        const map = {
            br: "mdi mdi-book-cog-outline source-icon",
            email: "mdi mdi-email-outline source-icon",
            document: "mdi mdi-file-document-outline source-icon",
            llm: "mdi mdi-file-document-plus-outline source-icon"
        };
        const source = _.get(this.props, "source", "document");
        return map[source];
    },

    showLabel(){
      return this.props.field_config.label.length < 5 ? this.props.field_config.label : this.props.field_config.label.substr(0, 20)
    },

    showContent(){
      let value=""
      value=this.props.field_config.label
      let score= this.props["value"] !== null &&
            this.props["bounds_score"] &&
            !isNaN(this.props["bounds_score"])
              ? ` (${parseFloat("" + this.props["bounds_score"]).toFixed(2)}%)`
              : ""
      return `${value+" "+score}` 
    },

    /**
     * To get the tooltip content for source icon
     * Example - If the field is extracted from document
     * Content - Field Extracted From Document
     */
    showSrcIconContent() {
      // Get the field source
      let source = _.get(this.props, "source", "document");

      // Change display name of source key
      if (source == "br") { source = "BR" }
      if (source == "llm") { source = "LLM" }

      // Prepare tooltip content
      const content = `Field Extracted From ${_.startCase(source)}`;
      
      return content;
    },

    handleFocus() {
      // EventBus.$emit("update_selected_field", this.props);
        this.$store.commit("documentViewStore/setSelectedField",this.props)
    },
  },

  components: {
    DatePicker,
    Input,
    Dropdown,
    Checkbox,
    MultiSelect
  },
  created() {},
  mounted() {
    this.$set(this,'showConfidenceScore',_.get(this.getDocumentConfiguration(),'config.show_confidence_score',false))
  },
  beforeDestroy() {},
  beforeMount() { 
    this.validationMsgs = _.get(this.props, 'validationMsgs', []);
   },
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.block-container {
  clear: both;
  display: flex;
  padding: var(--space-sm) var(--space-base);
  .block-50:first-child {
    padding-right: var(--space-base);
  }
  .block-50 {
    width: 50%;
    // padding:0 var(--space-sm);
  }
  .block-100 {
    width: 100%;
  }
  .el-card.card-focus {
    background-color: rgba(90, 103, 216, 1) !important;
    .el-checkbox-group{
       background-color: var(--white) !important;
    }
    .message {
      color: var(--white);
      .percentage.high {
        color: var(--green-07);
      }
      .percentage.medium {
        color: var(--yellow-07);
      }
      .percentage.low {
        color: var(--red-07);
      }
    }
    .error-msg,
    .icon-error {
      color: var(--red-07);
    }
    .icon-check {
      color: var(--green-07) !important;
    }
    .icon-details {
      color: var(--brand-09) !important;
    }
    
    .el-input__inner {
      background: var(--white);
    }
  }
  .el-card {
    padding: var(--space-sm);
    box-sizing: border-box;
    position: relative;
    width: 100%;
    box-shadow: 0 2px 2px 0 var(--dark-06);
    border-radius: var(--radius-base);
    border: none;
    .message {
      .percentage.high {
        color: var(--green-03);
      }
      .percentage.medium {
        color: var(--yellow-03);
      }
      .percentage.low {
        color: var(--red-03);
      }
    }
    .el-card__header {
      border-bottom: none;
      padding: 0 0 var(--space-sm) 0;
      box-sizing: border-box;
      font-size: calc(var(--font-sm) + 0.07rem);
      color: var(--dark-01);
      white-space: nowrap;
      .message{
        clear: both;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 86%;
        overflow: hidden;
    }
    }
    .el-card__body {
      padding: 0;
    }
    .el-input {
      width: 100%;
    }
  }
} // block container

.icon-error {
  color: var(--red-05);
  position: absolute;
  right: 10px;
  font-size: var(--font-lg);
  top: 0;
}
.icon-warning {
  color: var(--yellow-05);
  position: absolute;
  right: 10px;
  font-size: var(--font-lg);
}
.icon-check {
  color: var(--green-05);
  position: absolute;
  right: 10px;
  font-size: var(--font-lg);
  top: 2px;
}
.source-icon {
  cursor: pointer;
  color: var(--dark-03);
  position: absolute;
  right: 26px;
  font-size: var(--font-lg);
  top: 2px;
}
.icon-details {
   color: var(--dark-04);
  position: absolute;
  right: 29px;
  font-size: var(--font-lg);
  top: 2px;
}
.error-msg {
  font-size: var(--font-xs);
  color: var(--red-05);
}
.warning-msg {
  font-size: var(--font-xs);
  color: var(--yellow-05);
}
</style>
