<template>
  <div class="validation-wrapper">
    <el-tooltip
      placement="bottom"
      popper-class="validation-tooltip"
    >
      <ul
        style="list-style-type:none;padding-left: 0px;margin: 5px;"
        v-for="msg in errorMessages"
        slot="content"
      >
        <li>
          {{msg.message}}
        </li>
      </ul>
      <i class="error-info mdi mdi-information-outline"></i>
    </el-tooltip>
  </div>
</template>

<script>
import moment from "moment";
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import lodash from "lodash";

export default {
  name: "IdpValidationMessage",
  props: ["validationMsgs"],
  computed: {
    errorMessages() {
      let errorMsgs = lodash.filter(
        lodash.cloneDeep(this.validationMsgs),
        (message) => {
          return message.message_type == "ERROR";
        }
      );
      return errorMsgs;
    },
    warningMessages() {
      let warningMsgs = lodash.filter(
        lodash.cloneDeep(this.validationMsgs),
        (message) => {
          return message.message_type == "WARNING";
        }
      );
      return warningMsgs;
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss">
/*.el-tooltip__popper{
        background: #FED7D7 !important;
        border: 2px solid #9B2C2C !important;
        color:rgba(26,32,44,1) !important;
    }
    .popper__arrow::after{
        border-bottom-color:#9B2C2C !important;
    }
    .error-info {
        color:#C53030
    }*/
.validation-tooltip {
  background: #fed7d7 !important;
  border: 2px solid #9b2c2c !important;
  color: rgba(26, 32, 44, 1) !important;
  .popper__arrow{
       border-bottom-color:transparent !important;
  }
  .popper__arrow::after {
    border-bottom-color: #9b2c2c !important;
  }
  .error-info {
    color: #c53030;
  }
}
</style>
