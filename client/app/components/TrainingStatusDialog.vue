<template>
<el-main>
    <el-dialog width="33%" :show-close="false" class="taining-modal-container" before-close="closeDialog" :title="title" :visible.sync="displayTrainingDialog" center>
        <h4>Training has been started</h4>
        <el-button @click="closeDialog">Close</el-button>
        <el-button type="primary" v-on:click="$router.push('training-status-list')">Training status</el-button>
    </el-dialog>

</el-main>
</template>

<script>
export default {
    name: "TrainingStatusDialog",
    props: ["displayTrainingDialog", "title"],
    data() {
        return {

        };
    },
    methods: {
        closeDialog(){
            this.$emit('closeDialog');
        }



    },
    async beforeMount() {

    }
}
</script>

<style lang="scss">
.taining-modal-container {
    .el-dialog{
        border-radius:8px;
    }
    .el-dialog__header{
        text-align: left;
        padding: 8px 8px 6px 8px;
    }
    .el-dialog__body {
        //text-align: center !important;
        padding: 7px 15px 15px 15px;
        h4 {
            margin-bottom: 12px !important;
        }

        // p {
        //     font-size: 32px;
        //     margin: 0;
        //     margin-bottom: 30px;
        // }
    }
}
</style>
