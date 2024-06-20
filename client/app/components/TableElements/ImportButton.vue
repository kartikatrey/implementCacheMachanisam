<template>
    <span>
        <el-button :cid="'table-action-edit-' + propData.index" :disabled="disableButton" v-on:click="importRecord">
            <span class="action-btn" :class="icon"></span>
        </el-button>
    </span>
    </template>
    
    <script>
    
    export default {
        name: "ImportButton",
        props: ["propData", "type"],
        data() {
            return {
                label: "Import",
                icon: "mdi mdi-import"
            };
        },
        computed: {
      
            disableButton(){
                if(this.propData.column.importOptions.disableFunction){
                    return !this[this.propData.column.importOptions.disableFunction]();
                }
                return false;
            }
        },
        methods: {
            importRecord(){

            }
        },
        beforeMount(){
        this.label = this.propData.column.importOptions.label || this.label;
        this.icon = this.propData.column.importOptions.icon || this.icon;
    }
    };
</script>

<style lang="scss">
.button-style {
    font-size: 26px !important;
    padding: 0 !important;
}
</style>