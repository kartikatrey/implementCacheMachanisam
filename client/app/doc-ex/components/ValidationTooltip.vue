<template>
<div class="validation-wrapper ">
    <el-tooltip v-if="errorMessages.length>0" placement="top">
        <ul style="list-style-type:none;padding-left: 0px;margin: 5px;" v-for="msg in errorMessages" slot="content">
            <li>
                {{msg.message}}
            </li>
        </ul>
        <i class="el-icon-warning error-info"></i>
    </el-tooltip>
    <el-tooltip v-if="warningMessages.length>0" placement="top">
        <ul style="list-style-type:none;padding-left: 0px;margin: 5px;" v-for="msg in warningMessages" slot="content">
            <li>
                {{msg.message}}
            </li>
        </ul>
        <i class="mdi mdi-alert-circle-outline warning-info"></i>
    </el-tooltip>
</div>
</template>

<script>
import moment from 'moment'
import EventBus from "@/EventBus";
import Constants from "@/resources/Constants";
import lodash from 'lodash'

export default {
    name: 'ValidationTooltip',
    props: ["validationMsgs"],
    computed: {
        errorMessages() {
            let errorMsgs = lodash.filter(lodash.cloneDeep(this.validationMsgs), (message) => {
                return message.message_type == "ERROR"
            })
            return errorMsgs;

        },
        warningMessages() {
            let warningMsgs = lodash.filter(lodash.cloneDeep(this.validationMsgs), (message) => {
                return message.message_type == "WARNING"
            })
            return warningMsgs;
        }
    },
    data() {
        return {};
    }
};
</script>

<style lang="scss">
@import "../../idp/_idpVariables";
@import "../../idp/_idpGlobal";
.validation-wrapper {
    display: inline;
    margin-left: .4rem;;
        i {
           vertical-align: -webkit-baseline-middle;
        }
}
.error-info {
    color: #d33d3d;
}
.warning-info {
    color: var(--yellow-04) !important;
}
</style>
