<template>
    <section>
        <div class="dialog-container testConnectionDialogContainer">
            <el-dialog width="60%" :visible.sync="isDialogVisible" :close-on-click-modal="false" class="TestConnectionDialog">
                <span slot="title" class="dialog-title">
                    Connection Logs
                </span>

                <span>
                    <el-container style="height: 500px; border: 1px solid #eee;">
                        <el-main> 
                            <div>
                                <div v-for="(testConnectionLog, index) in testConnectionLogs" style="margin-bottom: 3px; margin-top: 3px">
                                    <el-row type="flex" class="row-bg" justify="start" align="top">
                                        <div style="white-space:pre">{{testConnectionLogs[index].time}}:    </div>
                                        <!-- check if data present and show expand option -->

                                        <div v-if="!testConnectionLogs[index].hasData">
                                            <el-tag :type="testConnectionLogs[index].type" size="mini">
                                                {{ testConnectionLogs[index].message }}
                                            </el-tag>
                                        </div>

                                        <el-col v-if="testConnectionLogs[index].hasData">
                                            <el-collapse size="small">
                                                <el-collapse-item size="small" style="box-shadow: unset">
                                                    <template slot="title">
                                                        <el-tag :type="testConnectionLogs[index].type" size="mini">
                                                            {{ testConnectionLogs[index].message }}
                                                        </el-tag>
                                                        <div style="font-size: 12px; white-space: pre;" plain disabled>  <i>  click here for more information</i></div>
                                                    </template>
                                                    <div>
                                                        <pre style="overflow-wrap: break-word;word-wrap: break-word;white-space: pre-wrap;max-width: inherit;">{{ JSON.stringify(testConnectionLogs[index].data, null, 4) }}</pre>
                                                    </div>
                                                </el-collapse-item>
                                            </el-collapse>
                                        </el-col>
                                    </el-row>
                                    <!-- Insert the loader between logs at the desired index -->
                                    <div v-if="index == loaderIndex && logLoader">
                                        <el-progress :percentage="uploadProgress" status="active"></el-progress>
                                    </div>
                                </div>
                            </div>
                        </el-main>
                    </el-container>
                </span>

                <span slot="footer" class="dialog-footer">
                    <div> </div>
                    <div class="button-container">
                        <el-button size="small" @click="onCancelClick" class="kp-btn-form-outline">Cancel</el-button>
                        <el-button size="small" class="btn-copy" type="primary" @click="onCopyToClipboardClick"
                            icon="mdi mdi-content-copy"> Copy to clipboard</el-button>
                    </div>
                </span>
            </el-dialog>
        </div>
    </section>
</template>

<script>
import Constants from "@/resources/Constants";
import $ from "jquery";
import moment from "moment";
import _ from 'lodash';

export default {
    name: "ConnectionLogsDialog",
    props: ['isDialogVisible', "logLoader", "uploadProgress", "loaderIndex"],

    data() {
        return {
            testConnectionLogs: [],
            testConnectionLogsClipboard: ""
        }
    },

    sockets: {
        [Constants.SOCKET_EVENTS.ADD_CONNECTION_LOG]: function (message) {
            let messageObject = JSON.parse(message);
            messageObject.hasData = !_.isEmpty(messageObject.data);
            this.testConnectionLogs.push(messageObject);
            this.testConnectionLogsClipboard += `${messageObject.time}:   ${messageObject.message}\n`;
            if (messageObject.hasData)
                this.testConnectionLogsClipboard += `${JSON.stringify(messageObject.data, null, 4)}\n`;
        }
    },

    methods: {

        onCancelClick() {
            // clear logs
            this.testConnectionLogsClipboard = "";
            this.testConnectionLogs = [];
            this.$emit('onCancelClick');
        },

        onCopyToClipboardClick() {
            let textArea = document.createElement("textarea");
            textArea.textContent = this.testConnectionLogsClipboard;
            document.body.append(textArea);
            textArea.select();
            document.execCommand("copy");
            this.notifySuccess("Copied to clipboard");
        },

        /**
         * Adds a log entry to the connection logs.
         * @param {Object} messageObj - The log message object.
         */
        addLog(messageObj) {
            if (_.isEmpty(messageObj)) {
                return;
            }

            // Set a default log type if not provided
            if (!messageObj.type) {
                messageObj.type = 'info';
            }

            // Add a formatted time to the log message object
            messageObj.time = moment().format('YYYY-MM-DD HH:mm:ss');

            this.testConnectionLogs.push(messageObj);
            this.testConnectionLogsClipboard += `${messageObj.time}:   ${messageObj.message}\n`;
        }
    }
};
</script>

<style lang="scss">


.testConnectionDialogContainer {
    .TestConnectionDialog {
        .el-dialog {
            margin-left: auto !important;
        }
    }

    .el-collapse-item__header {
        box-shadow: none !important;
        font-weight: 400 !important;
        border-bottom: unset !important;
        font-size: smaller !important;
        height: 20px !important;
        margin-bottom: 2px !important;
        padding-left: 0px !important;
        color: #606266 !important;
    }

    .el-collapse-item__arrow {
        font-size: smaller !important;
        margin: 5px !important;
        margin-bottom: 1px !important;
    }
}
</style>