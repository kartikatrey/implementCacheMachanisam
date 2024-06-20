<template>

<div class="history-container comment-container" v-loading="loading" :id="'document-auditHistory-window-'+docId">
    <div class="history-wrapper" v-for="(auditHistoryObj, key) in auditHistory" :key="key">
        <div class="header">
            <div class="field-name">  {{auditHistoryObj.field_label}}</div>
            <div class="edited-time"><span class="user-name"> {{auditHistoryObj.updated_by}} </span> <span>at {{auditHistoryObj.updated_at | formatDate}}</span></div>
        </div>
        <div class="value-container">
            <div class="old-value value-warpper">
                <i class="mdi mdi-check-circle"></i>
                <div class="field-value"> 
                    <span class="status">Old value</span>
                 
                    <el-tooltip :content="auditHistoryObj.field_old_value" placement="bottom" effect="light">
                        <span class="value"> {{auditHistoryObj.field_old_value}} </span>
                    </el-tooltip>
                </div>
            </div> 
            <div class="value-arrow"> <i class="mdi mdi-chevron-right"></i></div>
            <div class="new-value value-warpper">
                <i class="mdi mdi-check-circle"></i>
                <div class="field-value"> 
                    <span class="status">Updated</span>
                    <el-tooltip :content="auditHistoryObj.field_new_value" placement="bottom" effect="light">
                        <span class="value">   {{auditHistoryObj.field_new_value}} </span>
                    </el-tooltip>
                </div>
            </div> 
        </div>
  </div>
</div>
</template>

<script>
import IdpSheetService from "@/idp/services/excel/IdpSheetService";
import _ from "lodash";
import moment from 'moment';

export default {
    name: "ExcelHistory",
    props: ["docId", "fieldId", "docType"],
    filters: {
        formatDate: function (value) {
            if (value) {
                return moment(String(value)).format('MM/DD/YYYY hh:mm')
            }
        }
    },
     watch: {
        //BLOCK 1
        docId: {
            handler: function (newVal, oldVal) {
                // if docId not present (!newVal) for selected cell or row, return
                // if docId is not changed (newVal == oldVal), return
                // if docId is not changed (newVal == oldVal) but fieldId of cell is changed, fetchAuditHistory from BLOCK 2
                // if both docId and fieldId are changed, fetchAuditHistory only once, hence check for this.loading
                if (!newVal || newVal == oldVal || this.loading) {
                    return;
                }
                this.fetchAuditHistory();
            },
            immediate: true,
            deep: true,
        },
        //BLOCK 2
        fieldId: {
            handler: function (newVal, oldVal) {
                // if docId not present (!this.docId) for selected cell or row, return
                // if fieldId is not changed (newVal == oldVal), return
                // if fieldId is not changed (newVal == oldVal) but docId of cell is changed, fetchAuditHistory from BLOCK 1
                // if both docId and fieldId are changed, fetchAuditHistory only once, hence check for this.loading
                if (!this.docId || newVal == oldVal || this.loading) {
                    return;
                }
                this.fetchAuditHistory();
            },
            immediate: true,
            deep: true,
        }
    },
    data() {
        return {
            loading:false,            
            auditHistory: []
        };
    },
    methods: {  
        async fetchAuditHistory() {
            this.loading = true;
            this.auditHistory = await IdpSheetService.getExcelAuditHistory({"document_id": this.docId, "field_id": this.fieldId, "doc_type": this.docType});
            this.loading = false;
        }
    }
};
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal.scss";

.history-container {
    padding: 1.5rem;
    overflow: auto;
        &::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px var(--dark-06);
            background-color: var(--white);
        }

        &::-webkit-scrollbar {
            width: 6px;
            background-color: var(--white);
        }

        &::-webkit-scrollbar-thumb {
            background-color: var(--dark-05);
        }
    .history-wrapper {
        background: var(--white);
        border-radius: var(--radius-sm);
        margin-bottom: .35rem;
        padding: .6rem;
    }
    .header {
        padding: 0.2rem 0.5rem;
        display: flex;
        justify-content: flex-end;
        margin-bottom: .2rem;
            .field-name {
                color: var(--dark-02);
                font-size: var(--font-base);
                font-weight: 500;
                 white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: auto;
            }
            .user-name {
                font-weight: 350;
                color: var(--dark-05);
                font-size: var(--font-sm);
            }
            .edited-time {
                font-size: var(--font-sm);
                color: var(--dark-03);
                font-weight: 400;
                 white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
    }
    .value-container {
        display: flex;
        align-items: center;
           
            .value-arrow {
                margin: 0;
                font-size: 1.5rem;
                color: var(--dark-04);
            }
            .value-warpper.new-value {
                 background: var(--brand-09-7);
                 border: 1px solid var(--brand-08);
                    .field-value {
                            .status {
                                color:var(--brand-06);
                                font-weight: 500;
                            }
                            .value {
                                color: var(--brand-05);
                            }
                    }
                    i {
                        color:var(--brand-05);
                    }
            } // new value
            .value-warpper {
                display: flex;
                width: 45%;
                flex: 50%;
                background: var(--dark-09);
                padding: .2rem;
                align-items: end;
                border-radius: var(--radius-sm);
                    i {
                        font-size: 1.5rem;
                        color:var(--dark-06);
                        margin: 0 .5rem 0 .5rem;
                    }
                    .field-value {
                        width: 98%;
                            .status {
                                display: inline-block;
                                font-size: var(--font-xs); 
                                color:var(--dark-05);
                                
                            }
                            .value {
                                font-size: var(--font-lg);
                                font-weight: 450;
                                color: var(--dark-04);
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                width: 70%;
                                display: block;
                            }
                    }
            }
    }
} // history container

</style>
