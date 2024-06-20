<template>
<div>
    <div v-if="!isAdmin" class="grid-content bg-purple registered-container">

        <div class="top-left-values">
            <div :class="isAdmin ? 'dashboard-section-label-admin' : 'dashboard-section-label'">
                Users
            </div>
            <div class="users-count"> <span v-bind:style="{color:'#004c97'}" class="counter"> {{activeUsers}}</span>/{{allowedUsers}}</div>
        </div>
        <div class="progress-bar">
            <el-progress :status="myComputedWidth.status" :show-text="false" :stroke-width="30" :percentage="myComputedWidth.registeredUserPercentage"></el-progress>
        </div>
    </div>


    <div v-else class="grid-content bg-purple system-count-container">
    <div class="dashboard-section-label" style="
    margin-bottom: 0px;
">
        Users
    </div>
    <div class="system-counter counter" style="
    margin-top: 2px;
">
        {{activeUsers}}
    </div>
</div>

</div>
</template>

<script>
import AjaxService from "../../services/AjaxService";

export default {
    name: "UserCount",
    props: ["isAdmin"],
    data() {
        return {
            allowedUsers: '',
            activeUsers: '',
            remainingCount: '',
            status: ''
        }
    },
    methods: {
        getUserCount() {

            AjaxService.getJson("/portal/api/user-status", null, (error, res) => {

                if (res) {
                    this.allowedUsers = res.data.totalRecord;
                    this.activeUsers = res.data.activeCount;

                } else {
                    console.log("error occured");
                }
            });
        }
    },
    computed: {
        myComputedWidth() {
            let status = "success";
            this.remainingCount = this.allowedUsers - this.activeUsers
            if (this.activeUsers > this.allowedUsers) {
                status = "exception";
            }
            let resisterUserPercentage = Math.round((this.activeUsers / this.allowedUsers) * 100)
            return {
                registeredUserPercentage: resisterUserPercentage ? resisterUserPercentage : 0,
                remaining: Math.round((this.remainingCount / this.allowedUsers) * 100),
                status
            };
        }
    },

    beforeMount() {

        this.getUserCount();
    }

}
</script>

<style lang="scss">


.system-counter {
    color: #004c97 !important
}

.system-count-container {
    min-height: 104px ;
    margin-top: 0px !important;
}

.systems-count-container {
    .dashboard-section-label {
        margin-bottom: -10px !important;
        padding-bottom: 0px !important;

        margin-bottom: 0px !important;

    }
}
.registered-container {
    .dashboard-section-label-admin {
        font-weight: 700;
        padding-top: 8px;
        text-align: center;
    }

    .admin-counter {
        font-size: 50px;
        font-weight: bold;
        margin-top: 10px;
        color: #004c97;

    }

    .admin-count-wrap {
        text-align: center
    }

}

.el-progress-bar__inner {
    border-radius: 0 !important;
}

.progress-bar {
    padding-left: 18px;
    padding-right: 18px;
    box-sizing: border-box;
    // position: absolute;
    // bottom: 40px;
    width: 100%;

    .el-progress-bar__outer {
        border-radius: 5px;
        background: #fff;
        border: .5px solid #A5B4C3;
    }
}

.el-progress.is-success .el-progress-bar__inner {
    background-color: #A1DD70;
}
</style>
