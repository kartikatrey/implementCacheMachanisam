<template>
    <el-collapse v-model="activeNames" class="form-message-section">
        <el-collapse-item title="Messages" name="1" class="form-message-container">
            <div v-for="item in displayMessages" v-bind:key="item.message" class="validation-error form-error-container" v-html="item.message"></div>
        </el-collapse-item>
    </el-collapse>
</template>
  <script>
    import _ from "lodash";
    import MessageService from "../../services/MessageService"
    export default {
      name: "FormMessages",
      props: [ "messages" ],
      data() {
        return {
          activeNames: ['1'], //states which all collapsible items are active/open
          displayMessages: []
        };
      },
      methods: {
        prepareDisplayMessages(){
            let displayMessages = [];
            for(let message of this.messages){
                let messageType = _.get(message, 'message_type', '').toLowerCase();
                let messageContent = message.message;
                //This gets the formatted message based on message type with icon and styling class name
                //For error type, returns message with error icon
                //For warning type, returns message with warning icon
                message.message = MessageService.getMessageBasedOnType(messageType, messageContent);
                displayMessages.push(message);
            }
            this.displayMessages = displayMessages;
        }

      },
      mounted() {
        this.prepareDisplayMessages();
      },
    }
  </script>
  <style lang="scss">
  @import "../../_idpVariables";
  @import "../../_idpGlobal";
  
  .form-message-section { 
    border: 1px solid #cc2e2e; 
      .form-message-container {
        .el-collapse-item__header{
            background: #fff2f2;
            border-bottom: 1px solid #cc2e2e;
            font-weight: 600;
            height: 32px;
        }
        .el-collapse-item__wrap{
            background: #fff2f2;
            height: 100%;
            position: relative;
            overflow: auto;
            border-bottom: 1px solid #cc2e2e;
        }
          .validation-error {
              padding: 0 0 0 0;
              color: #cc2e2e;
              font-size: 13px;
  
              span {
                  border-radius: 100px;
                  padding: 2px 3px 5px 5px;
                  font-size: var(--font-base);
                  font-weight: bold;
                  vertical-align: middle;
              }
  
              .publish-fail-message-icon {
                  color: var(--yellow-02);
                  margin-right: 5px;
              }
  
              .publish-fail-message {
                  color: var(--yellow-02);
                  display: contents;
              }
          }
  
          .validation-error-for-publish-message {
              padding: 0 0 0 0;
              color: var(--dark-02);
              font-size: 13px;
  
              span {
                  border-radius: 100px;
                  padding: 2px 3px 5px 5px;
                  font-size: var(--font-base);
                  font-weight: bold;
                  vertical-align: middle;
              }
  
              .publish-fail-message-icon {
                  color: var(--yellow-02);
                  margin-right: 5px;
              }
  
              .publish-fail-message {
                  color: var(--yellow-02);
                  display: contents;
              }
          }
  
          ul {
              margin: auto;
              margin-left: 0.4rem;
          }
  
          .document-warning-message {
              display: contents;
              color: var(--yellow-04);
          }
            .document-success-message {
              display: contents;
              color: var(--green-04);
          }
          .success-icon{
               color: var(--green-04);
          }
      }
  }

  </style>
  