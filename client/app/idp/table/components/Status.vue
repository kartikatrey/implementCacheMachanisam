<template>
  <div class="status-icon-container" v-if="isStatusWrapperDisabled">
    <div v-if="checkInProgress">
      <el-tooltip class="item" effect="light" :content="content" placement="top">
        <i class="el-icon-loading"></i>
      </el-tooltip>
    </div>

    <div v-if="checkSuccess" class="success-color">
      <span class="mdi mdi-check-circle-outline success-icon"></span>
    </div>

    <div v-if="checkFailed" class="error-color">
      <el-tooltip class="item" effect="light" :content="content" placement="top">
                <span class="mdi mdi-close-circle fail-icon"></span>
      </el-tooltip>
      <a v-if="isRetry" @click.prevent="handleRetry($event)" v-bind:class="[is_disable ? 'anchor-disabled' : '']">Retry</a>
    </div>

    <div v-if="checkWarning">
      <span class="mdi mdi-alert warning-icon"></span>
      <!-- <a @click.prevent="handleClick(options.detailsEvent)">Details</a> -->
    </div>
  </div>
</template>

<script>
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import DocumentService from "@/doc-ex/services/DocumentService";
import _ from "lodash";

export default {
  name: "Status",
  props: ["data", "options"],
  watch: {
    "data.row.state": {
      handler: function (newVal, oldval) {
        // if (newVal != oldval) {
           this.value = newVal && newVal.replace('_deleted', '');
           let content = this.checkFailed ? (_.get(this.data.row, 'publish_failure_reason') || _.get(this.data.row, 'extraction_failure_reason') || newVal) : newVal
           this.content = (content == 'Publish started') ? 'Publish in progress' : content
           this.disableLink();
          //}
      },
      deep: true,
      immediate: true
    },
  },
  data() {
    return { columnName: null, row: null, value: "",content:"", is_disable:false};
  },
  computed: {
    /**
     * Purpose: This computed property determines if the status wrapper column should be disabled for "ap_contributor."
     * It returns true if the user has multiple roles or a different role, and false if the user is only an "ap_contributor."
     */
    isStatusWrapperDisabled(){
      const userRoles = _.get(this.$store.getters.user, 'roles', [])
      return userRoles.length !== 1 || userRoles[0] !== Constants.DOCEX.ROLES_MAP.AP_CONTRIBUTOR
    },
    checkInProgress() {
      return [
        Constants.DOCEX.STATE_UPLOADED.REQUESTED,
        Constants.DOCEX.STATE_UPLOADED.PENDING,
        Constants.DOCEX.STATE_UPLOADED.QUEUED,
        Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS,
        Constants.DOCEX.STATE_UPLOADED.EXTRACTED,
        Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS,                
        Constants.DOCEX.STATE_PUBLISHED.PUBLISH_STARTED  
      ].includes(this.value);
    },
    checkSuccess() {
      return this.value == Constants.DOCEX.STATE_UPLOADED.SUCCESS;
    },
    checkFailed() {
      return ((this.value == Constants.DOCEX.STATE_UPLOADED.FAILED) && (this.data.row.stage != Constants.DOCEX.STAGE.DUPLICATE))  ;
    },
    isRetry(){
      return ((this.value == Constants.DOCEX.STATE_UPLOADED.FAILED) && !_.get(this.data.row, 'publish_failure_reason') && (this.data.row.stage == Constants.DOCEX. STAGE.UPLOADED))  ;
    },
    checkWarning() {
      return ![
        Constants.DOCEX.STATE_UPLOADED.REQUESTED,
        Constants.DOCEX.STATE_UPLOADED.PENDING,
        Constants.DOCEX.STATE_UPLOADED.QUEUED,
        Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS,
        Constants.DOCEX.STATE_UPLOADED.EXTRACTED,
        Constants.DOCEX.STATE_UPLOADED.SUCCESS,
        Constants.DOCEX.STATE_UPLOADED.FAILED,
        Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS,
        Constants.DOCEX.STATE_PUBLISHED.PUBLISH_STARTED     
      ].includes(this.value);
    },
  },
  methods: {
    async handleRetry(eventName) {
      EventBus.$emit(this.options.eventName, this.row);
    },
     disableLink(){
      let result=false;
      if(_.has(this.options, 'disableCheckKey')){
         for(const key of this.options.disableCheckKey){
        result=this.options.disableValues[key] &&
        this.options.disableValues[key].includes(
          this.data.row[key]
        )
        if(result){
          break;
        }
      }
      }       
      this.is_disable=result
    },
  },
  beforeMount() {
    this.columnName =
     this.data && this.data["column"] && this.data["column"]["property"];
    this.row = this.data && this.data["row"];
    this.value = this.row[this.columnName].replace('_deleted', '');
    this.disableLink()
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
@import "../../_idpVariables";

.anchor-disabled{
  pointer-events:none; 
    opacity:0.6;
}
.status-icon-container {
  span {
    padding: 2px 3px 5px 0px;
    font-size: var(--font-xl);
    vertical-align: middle;
  }

  .success-icon {
    color: var(--success);
    font-size: 1.4rem;
  }

  .fail-icon {
    min-width: max-content;
    color: var(--fail);
    font-size: 1.4rem;
  }

  .warning-icon {
    color: var(--warning);
    font-size: var(--font-base);
  }
  a {
    color: #2d3748 !important;
    font-size: var(--font-base);
  }
  .error-color{
    min-width: max-content;
  }
}
</style>
