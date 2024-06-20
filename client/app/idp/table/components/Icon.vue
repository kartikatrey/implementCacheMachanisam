<template>
  <div class="idp-icon-container" :class="iconData && iconData.iconColorClass">
        <el-tooltip class="item" effect="light" :disabled="!options.tooltipLabel" :content="options.tooltipLabel" placement="top">
            <img v-if="customIcon" class="custom-icon" :src="getImgUrl(icon)" v-on:click="emitAction()">
            <el-button autofocus
                v-if="!customIcon"
                class="mdi"
                size="mini"
                :class="iconData && iconData.iconClass"
                :cid="'icon-' + iconData.iconClass"
                :disabled="checkDisabled()"
                @click="emitAction">
            </el-button>
        </el-tooltip>
  </div>
</template>

<script>

import EventBus from "@/EventBus";

export default {
    name: "Icon",
    props: ["data", "options"],
    data() {
        return {
            icon: "",
            customIcon: false,
            columnName: null
        };
    },
    computed: {
        iconData() {
            const row = this.data && this.data["row"];
            let iconData = { iconClass: ' mdi-close-circle fail-icon', iconColorClass: ' error-color ' };
            if(this.options && this.options.customIcon){
                this.customIcon = true;
                this.icon = this.options.icon;
                return iconData;
            }
            if (this.options.iconClass && this.options.iconColorClass) {
                iconData.iconClass = this.options.iconClass;
                iconData.iconColorClass = ' success-color ';
                return iconData;
            }
            if (this.options.successValues.includes(row[this.columnName])) {
                iconData.iconClass = 'mdi-check-circle-outline success-icon';
                iconData.iconColorClass = ' success-color '
                return iconData;
            }
            return iconData;
        }
    },
    methods: {
        getImgUrl(icon){
            return require('../../../assets/images/icons/' + icon);
        },
        checkDisabled() {
            let disable = false;
            if (!this.options.isWfIcon){
                return disable;
            }
            const document = this.data && this.data["row"];
            if (!document || !document.workflow_instance_id) {
                disable = true;
            }
            return disable;
        },

        async emitAction() {
            this.options.eventName && EventBus.$emit(this.options.eventName, this.data.row);
        },
    },
    beforeMount() {
        this.columnName = this.data && this.data["column"] && this.data["column"]["property"];
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
@import "../../_idpVariables";

.idp-icon-container {
  text-align: center;
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
    color: var(--fail);
    font-size: 1.4rem;
  }

  .warning-icon {
    color: var(--warning);
    font-size: var(--font-base);
  }
}

.custom-icon {
    height: 1.4rem;
    margin-left: 0.4rem;
}

.custom-icon:hover {
    filter: opacity(0.5) drop-shadow(0 0 0 blue);;
}

</style>
