<template>
<span>
    <el-dropdown-item :disabled="disableButton" :cid="'table-action-dropdown-edit-' + propData.index" v-if="type=='dropdown'" :command="editRecord">
        <span class="action-btn dropdown-btn" :class="icon"></span>{{label}}
    </el-dropdown-item>
    <el-button v-else :cid="'table-action-edit-' + propData.index" :disabled="disableButton" v-on:click="editRecord">
        <span class="action-btn" :class="icon"></span>
    </el-button>
</span>
</template>

<script>
import EventBus from "@/EventBus";

export default {
    name: "CloneButton",
    props: ["propData", "type"],
    data() {
        return {
            label: "Clone",
            icon: "mdi mdi-content-copy"
        };
    },
   
    methods: {
        editRecord() {
            if (this.propData.column.cloneOptions.inlineEditable) {
                EventBus.$emit('editRow', this.propData);
                return;
            }
            let record = this.propData.row;
            let column = this.propData.column;
            const id = record.id || record._id
            const routerPath = column.cloneOptions.routerPath;
            const queryString = `${routerPath}?id=${id}&clone=true`;
            this.$router.push(queryString);
        }
    },

    beforeMount(){
        this.label = this.propData.column.cloneOptions.label || this.label;
        this.icon = this.propData.column.cloneOptions.icon || this.icon;
    }
};
</script>

<style lang="scss">
.button-style {
    font-size: 26px !important;
    padding: 0 !important;
}

.edit-delete-button-container {
    .el-button {
        padding: 12px;
        border: 0;
    }
}
</style>
