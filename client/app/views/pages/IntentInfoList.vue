<template>
<el-main>
		<h1 class="kp-page-title">{{pageTitle}}</h1>
       
        <div class="table-wrap">
            <data-table :parameters="tableParams" @refreshCount="onTableUpdate" ref="datatable"></data-table>
        </div>
   
</el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
export default {
    name: "IntentInfoList",
    components: {
        DataTable
    },
    data() {
        return {
            activeMenuCount: 0,
            endpoint: constants.MENU_ENDPOINT,
            tableParams: {
                apiName: `/portal/api/table/intent_info`,
                queryParam: {
                    active: true
                },
                tableName: "intent_info",
                enableExport:true,
                isRestify: true,
                limit: 10,
                
       			addButtonConfig:{path:"/intent-info-form",name:'Add intent info'},
            },
            pageTitle:"Intent info"
        };
    },
    methods: {
        fetchActiveCount() {
            CommonService.fetchActiveCount(this.endpoint)
                .then(activeMenuCount => {
                    this.activeMenuCount = activeMenuCount;
                })
                .catch(error => {
                    this.notifyError("Error while fetching active menu count!!");
                });
        },
        onTableUpdate() {
            this.fetchActiveCount();
        }
    },
    beforeMount() {
        this.fetchActiveCount();
    }
};
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.service-config-container {
    .el-select {
        display: block;
    }

    .btn-save {
        text-transform: uppercase;
        font-weight: 700;
        display: block;
        margin-left: 0;
    }

    .el-input__suffix {
        top: 20px;
    }

    .el-form-item__label {
        font-weight: 700;
        text-transform: uppercase;
        font-size: $font-size-14;
    }

    .sub-head {
        font-weight: bold;
        text-transform: uppercase;
        font-size: $font-size-14;
    }

    .code-area-container {
        background: #e4e7ed;
        padding: 25px;
        min-height: 300px;
        margin-bottom: 20px;
    }

    .enter-code-indicator {
        font-weight: bold;
        text-transform: uppercase;
        font-size: $font-size-28;
        opacity: 0.5;
    }

    // Tag Filed mapping
    .el-tabs__content,
    .el-tabs__header {
        padding: 15px;
    }

    .object-container {
        background: $color-white;
        border-radius: 5px;
        margin-bottom: 10px;
        overflow: hidden;

        .btn-addtag {
            margin-bottom: 20px;
        }

        .obj-name {
            background: #e4e7ed;
            padding: 10px 16px;
            margin: 0;
            font-weight: bold;
            text-transform: uppercase;
            font-size: $font-size-14;
        }

        .el-button--text {
            font-weight: bold;
        }

        .object-body {
            padding: 16px;

            .tagname-container {
                border-bottom: 1px solid #dcdfe6;
                padding: 10px 0;
                margin-bottom: 10px;

                .el-input {
                    width: auto;
                    margin-right: 20px;
                }

                .tagname-code-area-container {
                    // background: #e4e7ed;
                    padding: 15px;
                    min-height: 100px;
                    vertical-align: top;
                    width: 55%;
                    display: inline-block;
                    margin-left: 20px;

                    .enter-code-indicator {
                        opacity: 0.5;
                    }
                }
            }
        }
    }

    // Tag Filed mapping

    .webchat-chekbox {
        font-weight: 700;
        text-transform: uppercase;
        font-size: $font-size-14;
        margin-bottom: 25px;
        line-height: 18px;
    }
}
</style>
