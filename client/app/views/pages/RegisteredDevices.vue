<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
    <div class="table-wrap">
        <DataTable :parameters="requiredParam" componentName="ActiveInactiveButtons" :columnTemplate="columnTemplate" @refreshCount="refreshCount"></DataTable>
    </div>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import AjaxService from "@public/services/AjaxService";

export default {
    name: "RegisteredDevices",
    components: {
        DataTable
    },
    data() {
        return {
            allUsers: 0,
            active: 0,
            inactive: 0,
            blocked: 0,
            requiredParam: {
                apiName: "/portal/api/table/register_device", //add your API url here
                showPaginationOptions: true, // to show/hide pagination option
                tableName: "register_device", // it is use to get headers of table from tableHeaderConfig.js
                isRestify: true,
                queryParam: {
                    // active: true 
                },
                enableExport: true,
                initialSort: "-created_on",
                limit: 10, // to limit the number of records to be fetched
                headerWidget: [],
                enableExport: true,
            },
            pageTitle: "App users"
        };
    },
    methods: {
        columnTemplate(props) {
            var htmlTemplate = "";
            if (props.row["status"] == "Active") {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-active">Active</sup></div>`;
            } else if (props.row["status"] == "Blocked") {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-blocked">Blocked</sup></div>`;
            } else {
                htmlTemplate = `<div data-v-c0ac797e="" class="el-badge mark"><sup class="badge-inactive">Inactive</sup></div>`;
            }
            return htmlTemplate;
        },

        refreshCount() {
            this.getCount();
        },
        getCount() {
            AjaxService.getJson("/portal/api/reg-device-detail", {}, (error, res) => {
                this.allUsers = res.data.response[0].all_users;
                this.active = res.data.response[0].active;
                this.inactive = res.data.response[0].inactive;
                this.blocked = res.data.response[0].blocked;
            });

            this.requiredParam.headerWidget = [{
                    label: "All users",
                    value: this.allUsers
                },
                {
                    label: "Active",
                    value: this.active
                },
                {
                    label: "Inactive",
                    value: this.inactive
                },
                {
                    label: "Blocked",
                    value: this.blocked
                }
            ]

        }
    },
    beforeMount() {
        this.getCount()
    }
};
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

.badge-blocked {
    background-color: white;
    border-radius: 10px;
    color: red;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid red;
    width: 45px;
}

.badge-inactive {
    background-color: white;
    border-radius: 10px;
    color: orange;
    display: inline-block;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    text-align: center;
    white-space: nowrap;
    border: 1px solid orange;
    width: 45px;
}
</style>
