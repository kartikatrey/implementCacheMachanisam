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
    name: "EditButton",
    props: ["propData", "type"],
    data() {
        return {
            label: "Edit",
            icon: "mdi mdi-pencil"
        };
    },
    computed: {
        enableEdit() {
            let enable = this.propData.column.editOptions.inlineEditable ?
                !this.propData.row.editable :
                true;
            return enable;
        },
        disableButton(){
            if(this.propData.column.editOptions.disableFunction){
                return !this[this.propData.column.editOptions.disableFunction]();
            }
            return false;
        }
    },
    methods: {
        editRecord() {
            if (this.propData.column.editOptions.inlineEditable) {
                EventBus.$emit('editRow', this.propData);
                return;
            }
            let record = this.propData.row;
            let column = this.propData.column;
            const id = record.id || record._id
            if(column.editOptions){
                this.$router.push(column.editOptions.routerPath + "?id=" + id+"&options="+JSON.stringify(column.editOptions));
            }
            else{
                this.$router.push(column.editOptions.routerPath + "?id=" + id);
            }
        }
    },

    beforeMount(){
        this.label = this.propData.column.editOptions.label || this.label;
        this.icon = this.propData.column.editOptions.icon || this.icon;
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
