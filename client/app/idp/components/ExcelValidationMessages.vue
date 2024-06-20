<template>
    <!-- <div> -->
    <div v-if="renderMsgs" class="validation-container comment-container" v-loading="loading" :id="'document-messages-window-'+parentDocId">
        <div v-if="noError" class="multiple-error-container">No error(s) found</div>
        <div v-else v-for="(docMsgGroup, docMsgkey) in docMessages" :key="docMsgkey" >
          <div v-if="Object.keys( docMsgGroup ).length > 0" class="multiple-error-container">
              <div class="validation-wrapper" v-for="(item, key) in docMsgGroup" :key="key" @click="highlightActiveCell(item)">
                <div class="message-list-wrap" v-if="item.message">
                  <div class="message-list" :key="key" v-html="wrapMsgInHtml(item)"></div>
                </div>
              </div>
          </div>
            <!-- <el-divider content-position="left" v-show="docMsgkey"></el-divider> -->
        </div>
    </div>
    <!-- </div> -->
</template>

  <script>
  import IdpSheetService from "@/idp/services/excel/IdpSheetService";
  import _ from "lodash";
  import Constants from "@/resources/Constants";

  export default {
      name: "ExcelValidationMessages",
      props: ["parentDocId", "docId", "docType", "fieldNameToLabelMap", "isExcelForm"],
      data() {
          return {
              loading:false,
              docMessages: {},
              noError:false,
              renderMsgs:true,
              isConnected: false,

          };
      },
      watch: {

    },
      sockets: {
        connect: function () { },
        disconnect: function () { },
        //Groups all the validation messages for all children based on document_id, for current parent document.
        [Constants.SOCKET_EVENTS.EXCEL_VIEWER.EXCEL_VIEWER_VALIDATION_MESSAGES]: function (data) {
            if(data.parentDocumentId == this.parentDocId){
              this.processValidationMessage(data.actionData)
            }
        },
      },
      methods: {
        // Get html string based on msg type
          wrapMsgInHtml(msg){
            const message = msg.pkey ? `${msg.pkey} : ${msg.message}` : `${msg.message}`;
            const messageTypeHtmlMap = {
                "ERROR":'<div class="document-error-message"><i class="mdi mdi-alert-circle error-info-icon"></i><span>'+ message + '</span> </div>',
                "WARNING":'<div class="document-error-message"><i class="mdi mdi-alert-circle warning-info"></i><span class="document-warning-message">' + message + '</span> </div>',
                "INFO":'<i class="mdi mdi-information information-icon"></i>' + message ,
                "FRAUD":'<div class="document-error-message"><i class="mdi mdi-alert warning-info"></i><span class="document-warning-message">'  + message + '</span> </div>',
                "SUCCESS":'<div class="document-error-message"><i class="mdi mdi mdi-checkbox-marked-circle success-icon"></i><span class="document-success-message">'  + message + '</span> </div>'
            }
            return  messageTypeHtmlMap[msg.message_type];
        },

        /**
         * Sets sheet-wise validation messages for a specific sheet index to Error tab.
         * @param {number} sheetIndex - The index of the sheet for which to fetch validation messages.
         */
        async setSheetValidationMessages(sheetIndex,docId) {
            this.docMessages = {};
            this.noError = false;

            // Fetch validation messages for the given sheet index.
            // As we want error msgs for all the records, there for sending document_id as null
            const params = {
                document_id: docId,
                sheet_index: sheetIndex
            }
            await this.setValidationMessages(params);
        },

        /**
         * Sets validation messages for a specific document and sheet index to Error tab.
         * If 'docId' is and 'sheetIndex' not provided, it fetches validation messages for the entire workbook (all sheets).
         * @param {string} params - Params contains the ID of the document and The index of the sheet for which to fetch validation messages (default: {})
         * @returns - Array of validation messages.
         */
        async setValidationMessages(params = {}) {
          if (this.isExcelForm) {
            params.document_id = this.docId;
          }
            const docId = params.document_id;
            let sheetIndex = params.sheet_index || -1;

            // If 'sheetIndex' is not provided or less than 0, set it to the index of the current sheet.
            // In case of refresh or first time loading the excel viewer, we should show validation msgs only for active sheet
            // In case of changing sheets from viewer we will send the sheetIndex
            if (!(sheetIndex >= 0)) {
                sheetIndex = window.luckysheet.sheetmanage.getCurSheet();
            }

            // Prepare the payload for the API request to fetch validation messages.
            const payload = {
                document_id: docId,
                document_type: this.docType,
                parent_document_id: this.parentDocId,
                sheet_index: sheetIndex,
            };

            // Fetch validation messages using the 'IdpSheetService.getExcelValidationMsgs' method.
            const response = await IdpSheetService.getExcelValidationMsgs(payload);
            if (response.status) {
                // Get messages from server response
                let messages = response.data;

                // If 'docId' is not provided, load validation messages by document IDs in the workbook.
                // Otherwise, load validation messages only for the provided 'docId'.
                let docIds = docId ? [docId] : this.getDocIdsFromMessages(messages);
                this.loadGroupedValidationMsgsByDocIds(messages, docIds);
            }
        },

        processValidationMessage(messages){
          const docIds = this.getDocIdsFromMessages(messages)
          this.loadGroupedValidationMsgsByDocIds(messages, docIds)
          return messages;
        },
        getDocIdsFromMessages(response){
          return _.filter(_.uniq(_.map(response, "doc_id")),(docId)=> {return docId!=null});
        },
        /**
         * load all validation messages based on document_id to show messages document wise on Error tab.
         * @param {*} validationMsgs
         * @param {*} docIds
         */
        loadGroupedValidationMsgsByDocIds(validationMsgs, docIds) {
          this.renderMsgs = false;
          for (const doc_id of docIds) {
            this.docMessages[doc_id] = _.filter(validationMsgs,(msg)=>{
                if(msg.doc_id==doc_id){
                    if(msg.message){
                        return msg
                    }
                }
              });
          }
          //Check if validation messages are empty, if empty then show "no error found" message
          let counter = 0;
          for (const msgkey in this.docMessages) {
            if (_.isEmpty(this.docMessages[msgkey]) || !this.docMessages[msgkey][0]["message"]) { // check if message key exists in this.docMessages[documentId]
                counter++;
            }
          }
          if (counter == Object.keys(this.docMessages).length) {
            this.noError = true;
          }
          else {
            this.noError = false;
          }
          //Render updates at UI
          this.$nextTick(() => {
            this.renderMsgs = true;
          });
        },
        // Navigate to cell on click on message
        highlightActiveCell(msg){
          window.luckysheet.setRangeShow([{row:[msg.r],column:[msg.c]}])
          window.luckysheet.scroll({targetRow:msg.r,targetColumn:msg.c})
        }
      },
      async mounted() {
        this.loading = true;
        await this.setValidationMessages();
        this.loading = false;
      }
  };
  </script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal.scss";

.field-container .el-tabs__content {
    overflow: hidden !important;
}
.el-loading-mask {
    background: transparent !important;
}
.comment-container.validation-container {
      padding: var(--space-lg);
      overflow: auto;
      height: 89%;
      .document-success-message,.document-error-message,.document-success-message{
          text-decoration: underline;
          display: inline-block;
          &:hover {
              text-decoration: none;
          }
      }
      .multiple-error-container {
            background: var(--white);
            padding: var(--space-base);
            margin:0 0 .7rem 0;
            border-radius: var(--radius-base);


            .validation-wrapper {
              //  background: red;
              .message-list-wrap {
                margin-bottom: .3rem;
                .message-list {
                    padding: 0.1rem 0;
                    font-size: var(--font-sm-5);
                    //  text-decoration: underline;
                    //     &:hover {
                    //         text-decoration: none;
                    //     }
                  cursor: pointer;
                      &:hover {
                        background: var(--dark-09);
                      }
                }
                .message-list:last-child {
                    border-bottom: 0;
                }
              }
          }
      }

    .validation-wrapper {
        display: block;
            .header {
                color: var(--dark-02);
                font-size: var(--font-base);
                margin: 0 0 .3rem 0;
                font-weight: 500;
                    .circle {
                        width: 5px;
                        height: 5px;
                        background: var(--white);
                        display: inline-block;
                        border-radius: var(--radius-round);
                        vertical-align: top;
                        margin: .7rem 0.45rem 0 0.25rem;
                    }
            }
            .document-error-message {
                display: flex;
                // font-size: .95rem;
                i {
                    margin-right: .5rem;
                    display: inline-block;
                    vertical-align: baseline;
                }
            }
    } // validation wrapper
}
// comment container
</style>
