<template>
<span>
    <el-dropdown-item v-if="type=='dropdown'" :disabled="refreshInProgress" :command="refreshRecord">
        <span class="mdi mdi-refresh action-btn"></span>
        refresh
    </el-dropdown-item>
    <el-button v-else :cid="'table-action-refresh-' + propData.index" :disabled="refreshInProgress" v-on:click="refreshRecord"><span class="mdi mdi-refresh action-btn"></span></el-button>
</span>
</template>

<script>
import TableAPIService from "@/services/TableAPIService";
import EventBus from "@/EventBus";
export default {
    name: "RefreshRecordButton",
    components: {},
    props: ["propData", 'parameters','type'],
    data() {
        return {
            refreshInProgress: false,
            refreshOptions: this.propData.column.refreshOptions || {},
        };
    },
    methods: {

        async refreshRecord() {
         
            let response = await this.getRecord(this.refreshOptions.endpoint, {
                _id: this.propData.row["_id"],
            });
            EventBus.$emit("updateTable" + this.parameters.event_name, {
                updateProperty: this.refreshOptions.updateProperty,
                response,
                index: this.propData.index,
            });
        },
        getRecord(endpoint, query) {
            EventBus.$emit("tableLoader", {
                loading: true
            });
            return new Promise((resolve, reject) => {
                let tableApiService = new TableAPIService();
                tableApiService.addSelectColumns(
                    this.refreshOptions.updateProperty || []
                );
                tableApiService.addQuery(query);
                tableApiService.findOne(endpoint, (error, response) => {
                    EventBus.$emit("tableLoader", {
                        loading: false
                    });
                    if (error) {
                        reject(error);
                        return;
                    }
                    let responseData = _.isArray(response) ? response[0] : response;
                    resolve(responseData);
                });
            });
        }
    },
};
</script>

<style lang="scss">
</style>
