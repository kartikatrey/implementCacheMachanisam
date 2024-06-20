<template>
    <div class="idp-icon-container">
        <el-tooltip class="item" effect="light" :content="propData.column.viewOptions.tooltipLabel" placement="top">
            <el-button class="mdi" size="mini" :class="iconStyleObj && iconStyleObj.iconClass" :cid="'icon-' + iconStyleObj.iconClass"
                @click="emitAction">
            </el-button>
        </el-tooltip>
    </div>
</template>
  
<script>
import EventBus from "@/EventBus";
export default {
    name: "ViewIcon",
    props: ["propData"],
    data() {
        return {
            iconStyleObj: {}
        }
    },
    methods: {
        async emitAction() {
            if (this.propData.column.viewOptions.eventName) {
                EventBus.$emit(this.propData.column.viewOptions.eventName, this.propData.row);
            }
        }
    },
    beforeMount() {
        const iconStyleObj = {};
        if (this.propData.column.viewOptions.iconClass && this.propData.column.viewOptions.iconColorClass) {
            iconStyleObj.iconClass = this.propData.column.viewOptions.iconClass;
            iconStyleObj.iconColorClass = ' success-color ';
        }
        this.iconStyleObj = iconStyleObj
    }
};
</script>

<style lang="scss"></style> 