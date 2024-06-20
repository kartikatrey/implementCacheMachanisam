<template>
    <div class="excel-status-icon-container">
        <span v-tooltip.top="{ content: createHtmlTooltipContent, loadingContent: 'Loading...', classes: ['excel-tooltip'] }">
            <i v-if="inProgressStates.includes(statusResult.state)" class="el-icon-loading"></i>
            <i v-else-if="statusResult.state == 'Success'" class="mdi mdi-check-circle-outline success-icon"></i>
            <i v-else-if="statusResult.state == 'Failed'" class="mdi mdi-close-circle fail-icon"></i>
            <i v-else-if="statusResult.state == 'Success_deleted'" class="mdi mdi-check-circle-outline success-icon"></i>
            <i v-else-if="statusResult.state == 'Failed_deleted'" class="mdi mdi-close-circle fail-icon"></i>
            <i v-else class="el-icon-loading"></i>
        </span>
    </div>
</template>
  
<script>
import IdpSheetService from "@/idp/services/excel/IdpSheetService";
import Constants from "@/resources/Constants";
import _ from "lodash";
export default {
    name: "ExcelStatus",
    props: [
        "documentId",
        "document"
    ],
    data() {
        return {
            statusResult: {},
            inProgressStates:[  Constants.DOCEX.STATE_UPLOADED.IN_PROGRESS,
                                Constants.DOCEX.STATE_PUBLISHED.PUBLISH_IN_PROGRESS,
                                Constants.DOCEX.STATE_UPLOADED.REQUESTED
                            ]
        };
    },
    sockets: {
        connect: function () { },
        disconnect: function () { },
        [Constants.SOCKET_EVENTS.EXCEL_VIEWER.EXCEL_VIEWER_ON_STATUS_UPDATE]: function (excelStatusData) {
            if(excelStatusData && excelStatusData.parentDocumentId == this.documentId){
                this.statusResult = excelStatusData.actionData;
            }
        }
    }, 
    watch: {  
        document: {
            handler: async function(newVal, oldVal) {
                if(newVal){
                    this.statusResult = {"state" :  newVal && newVal.state.replace('_deleted', '')};
                }
            },
            deep: true,
            immediate:true
        }
    },
    methods: {
        async createHtmlTooltipContent() {
            let statusRes = await IdpSheetService.getExcelStatus(this.documentId)
            //update only key which are in use, complete object is reactive causing reloading of DOM
            this.statusResult.state = statusRes.state;
            let htmlTooltipContent = `<div class="excel-status"><header>${statusRes.title}</header><ul>`;
            const data = statusRes["data"] ;
            for (const key in data) {
                if (key) {
                    htmlTooltipContent = htmlTooltipContent + `<li>${key} <span>${data[key]}</span></li>`;
                } 
            }
            htmlTooltipContent = htmlTooltipContent + "</ul></div>";
            if(typeof(statusRes.title) === "undefined")
                return ""    
            return htmlTooltipContent
        },
        async init(){
            //Initialize stage with the document stage from props
            this.statusResult = {state: this.document.state};
        }
    },
    beforeMount() {
        this.init();
    },
};
</script>

<style lang="scss" >
@import "../../_idpVariables.scss";
.excel-tooltip {
    display: block !important;
    z-index: 10000;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;

    .tooltip-inner {
        color: var(--dark-02);
        background: var(--white);
        border-radius: .4rem;
        padding: 14px 18px;
    }

    .tooltip-arrow {
        width: 0;
        height: 0;
        border-style: solid;
        position: absolute;
        margin: 5px;
        border-color: var(--white);
        z-index: 1;
    }

    &[x-placement^="bottom"] {
        margin-top: 5px;

        .tooltip-arrow {
            border-width: 0 5px 5px 5px;
            border-left-color: transparent !important;
            border-right-color: transparent !important;
            border-top-color: transparent !important;
            top: -5px;
            left: calc(50% - 5px);
            margin-top: 0;
            margin-bottom: 0;
        }
    }

}

.excel-status {
    padding: .5rem;
    width: 180px;
    header {
        font-weight: 400;
        font-size: var(--font-lg);
        margin-bottom: 1rem;
        color: var(--dark-01);
    }

    ul {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
            display: flex;
            justify-content: flex-end;
            padding: .3rem 0;
            font-size: var(--font-base);
            color: var(--dark-02);

            span {
                margin-left: auto;
            }
        }
    }

}

.excel-status-icon-container {
    span {
        padding: 2px 3px 5px 0px;
        font-size: var(--font-xl);
        vertical-align: middle;
    }

    .success-icon {
        color: var(--green-04);
        font-size: 1.4rem;
    }

    .fail-icon {
        color: var(--red-04);
        font-size: 1.4rem;
        min-width: max-content;
    }
}
</style>
