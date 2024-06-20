<template>
    <el-main class="kp-main">
		<div class="table-wrap">
            <data-table :parameters="tableParams" ref="datatable" :columnTemplate="columnTemplate"></data-table>
        </div>
    </el-main>
    </template>
    
    <script>
    import DataTable from "@/components/DataTable.vue";
    import CommonService from "@/services/CommonService";
    import Constants from "@/resources/Constants";
    export default {
        name: "BusinessRuleFieldMapList",
        components: {
            DataTable
        },
        data() {
            return {
                tableParams: {
                    apiName: `/portal/api/table/de_business_rule_field_map`,
                    queryParam: {
                        active: true
                    },
                    tableName: "business_rule_field_map",
                    enableExport:true,
                    isRestify: true,
                    limit: 10,
                    isRegxSearch:true,
				    initialSort: "-created_at",
                    pageTitle:"Business Rule Field Map"
                },
                deFields:[]
            };
        },
        methods: {
            // In Database Associated field's Id is saved, but while displaying record on list view, 
            // we want to display the label of the field, so here mapping labels with corresponding Ids
            columnTemplate(props) {
                let template = "";
                if(props.row.de_field_id){
                    let deField = (this.deFields).find(obj => obj._id === props.row.de_field_id);
                    if(deField && deField.label){
                        template=deField.label
                    }
                }else{
                    template="Document"
                }
                return template;
            }
        },
        async beforeMount() {
            // Fetching field records from de_field_data to map field label with associated field's Id
            this.deFields = await CommonService.fetchRecord(Constants.DE_FIELD_ENDPOINT, {});
        }
    };
    </script>