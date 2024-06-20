<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
        <div class="table-wrap">
            <data-table :parameters="tableParams" :columnTemplate="columnTemplate" componentName="ApproveRejectButtons" @refreshCount="refreshCount" ref="customer"></data-table>
        </div>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import TableAPIService from "../../services/TableAPIService";
import AjaxService from "../../services/AjaxService";
let tableApiService = new TableAPIService();
import EventBus from "@/EventBus";

import {
    _
} from "vue-underscore";
export default {
    name: "Invoice",
    components: {
        DataTable
    },
    data() {
        return {
            allCustomers: 0,
            pendingActivations: 0,
            tableParams: {
                apiName: `/portal/api/table/cp_user`,
                queryParam: {},
                tableName: "user",
                enableExport: true,
                initialSort: "-createdAt",
                isRestify: true,
                limit: 10,
                headerWidget:[],	
                enableExport:true,
                addButtonConfig:{path:"/cp-user-form",name:'Add user'},	
            },
            pageTitle:"Portal users"
        };
    },
    methods: {

        columnTemplate(props) {
            var htmlTemplate = "";
            if (props.row["active"]) {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-active">Active</sup></div>`;
            } else {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-pending">Pending</sup></div>`;
            }
            return htmlTemplate;
        },
        sendActivationEmail(email, recordId) {
            let url = "/portal/api/user-email";
            let userData = {
                user_email: email,
                record_id: recordId
            };
            AjaxService.postJson(url, userData, (error, res) => {
                if (res.data.data.status) {
                    this.$notify({
                        title: "Success",
                        message: res.data.data.message,
                        type: "success"
                    });
                } else {
                    this.$notify.error({
                        title: "Error",
                        message: res.data.data.message
                    });
                }
            });
        },
        refreshCount() {
            this.getCount();
        },
        getCount() {
            AjaxService.getJson("/portal/api/user-detail", {}, (error, res) => {
                this.allUsers = res.data.response[0].all_customers;
                this.blockedUsers = res.data.response[0].pending_activations;
                this.activeUsers = res.data.response[0].active_users;
            });

            this.tableParams.headerWidget=[
				{
					label:"All users",
					value:this.allUsers
                },
                {
					label:"Active",
					value:this.activeUsers
				},
				{
					label:"Blocked",
					value:this.blockedUsers
				},
				
			]

        },

        send(payload) {
            let record = payload.row;
            this.$confirm(
                    `Are you sure you want to activate ${record.email}?`,
                    "Confirmation", {
                        confirmButtonText: "Confirm",
                        cancelButtonText: "Cancel",
                        type: "warning"
                    }
                )
                .then(() => {
                    let url = "/portal/api/table/cp_user";
                    let userData = {
                        approved: true
                    };
                    tableApiService.findByIdAndUpdate(
                        url,
                        record._id,
                        userData,
                        (error, response) => {
                            if (error) {
                                this.$notify.error({
                                    title: "Error",
                                    message: `Error while activating user ${record.full_name}`
                                });
                                return
                            }
                            if (_.has(response.data, "id")) {
                                //this.$refs["customer"].refreshTable();
                                EventBus.$emit('refreshTable');
                                this.sendActivationEmail(record.email, record._id);
                            } else {

                            }
                        }
                    );
                })
                .catch(() => {});
        },

        sendActivationEmail(email, recordId) {
            let url = "/portal/api/user-email";
            let userData = {
                user_email: email,
                record_id: recordId
            };
            AjaxService.postJson(url, userData, (error, res) => {
                if (res.data.data.status) {
                    this.$notify({
                        title: "Success",
                        message: res.data.data.message,
                        type: "success"
                    });
                } else {
                    this.$notify.error({
                        title: "Error",
                        message: res.data.data.message
                    });
                }
            });
        }
    },
    beforeMount() {
         this.getCount()
        EventBus.$on('approveRequest', (payload) => {
            this.send(payload)
        })
       
    },

    beforeDestroy() {
        EventBus.$off('approveRequest')
    }
}
</script>

<style lang="scss">
@import "../../assets/scss/_variables";

.badge-active {
    background-color: white;
    border-radius: 10px;
    color: rgba(66, 240, 153, 0.7);
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid rgba(66, 240, 153, 0.7);
    width: 45px;
}

.badge-pending {
    background-color: white;
    border-radius: 10px;
    color: rgba(242, 205, 91, 1);
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid rgba(242, 205, 91, 0.7);
    width: 45px;
}
</style>
