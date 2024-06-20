<template>
<div>
    <el-col :span="getSpan">
        <count-tile label="Transactions (Model Service)" :count="transactionCount"></count-tile>
    </el-col>
    <el-col :span="getSpan" v-if="isAdmin">
        <count-tile label="Total Customers" :count="customerCount"></count-tile>
    </el-col>
    <el-col :span="getSpan">
        <count-tile label="Training Count" :count="trainingCount"></count-tile>
    </el-col>

</div>
</template>

<script>
import AjaxService from "../../services/AjaxService";
import CountTile from "../../components/Dashboard/CountTile.vue";

export default {
    name: "CountTileModule",
    data() {
        return {
            transactionCount: '',
            customerCount: '',
            trainingCount: ''
        }
    },
    components: {
        CountTile
    },
    props: ["isAdmin"],
    computed: {
        getSpan() {
            let span = this.isAdmin ? 8 : 12
            return span
        }

    },
    methods: {
        populateCountData() {

            AjaxService.getJson("/portal/api/count-data", null, (error, res) => {

                if (res) {
                    this.customerCount = res.data.customerCount;
                    this.masterSystemCount = res.data.masterSystemCount;
                    this.trainingCount = res.data.trainingCount;
                    this.transactionCount = res.data.transactionCount;

                } else {
                    console.log("error occured");
                }
            });
        }
    },
    beforeMount() {
        this.populateCountData();
    }

}
</script>

<style lang="scss">
.count-container {
    min-height: 100px !important;
    padding-top: 10px;

    .users-count {
        margin-top: -12px;
    }

    .counter {
        color: #004c97 !important;
        font-size: 30px;
        font-weight: bold;
        padding-left: 16px;
        margin-top: 10px;
    }
}
</style>
