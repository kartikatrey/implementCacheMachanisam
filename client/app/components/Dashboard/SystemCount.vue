<template>
<div class="grid-content bg-purple" v-bind:class="{ 'system-count-container': isAdmin, 'system-counter-customer': !isAdmin }">
    <div class="dashboard-section-label" style="
    margin-bottom: 0px;
">
        Systems
    </div>
    <div class="system-counter counter" style="
    margin-top: 2px;
">
        {{sysCount}}
    </div>
</div>
</template>

<script>
import AjaxService from "../../services/AjaxService";

export default {
    name: "SystemCount",
    props: ["isAdmin", "count"],
    data() {
        return {
            sysCount: ''
        }
    },
    methods: {

        getSystemCount() {
            AjaxService.getJson("/portal/api/system-count", null, (error, res) => {
                if (res) {
                    this.sysCount = res.data.response

                } else {
                    console.log("error occured");
                }
            });
        }
    },
    beforeMount() {

        this.getSystemCount();
        return

    }
}
</script>

<style lang="scss">
.system-counter {
    color: #004c97 !important
}

.system-counter-customer{
 min-height: 135px !important
}

.system-count-container {
    min-height: 104px !important;
    margin-top: 0px !important;
}

.systems-count-container {
  

    .dashboard-section-label {
        margin-bottom: -10px !important;
        padding-bottom: 0px !important;

        margin-bottom: 0px !important;

    }
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.bg-purple-dark {
    background: #99a9bf;
}

.bg-purple {
    background: #ffffff;
}

.bg-oranges {
    background: #56F19A;
    color: #ffffff;
}

.bg-oranges-2 {
    background: #A1DD70;
    color: #ffffff;
}

.bg-oranges-3 {
    background: #97CF6A;
    color: #ffffff;
}

.bg-purple-light {
    background: #e5e9f2;
}

.grid-content {
    border-radius: 5px;
    min-height: 327px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
}

.grid-content-sub {
    border-radius: 5px;
    min-height: 36px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.top-left-values {
    height: 88px;
}

.top-left-values-big {
    height: 207px;
}

.dashboard-section-label {
    font-weight: 700;
    padding-left: 16px;
    padding-top: 8px;
}

.counter {
    font-size: 38px;
    font-weight: bold;
    padding-left: 16px;
    margin-top: 10px;
}
</style>
