<template>
<el-main>
    <h1 class="kp-page-title">{{pageTitle}}</h1>
        <div class="table-wrap">
            <data-table :parameters="tableParams" @startTrainer="startTrainer" @deleteAll="deleteAll" @refreshCount="refreshCount" ref="datatable"></data-table>
        </div>
    <training-status-dialog @closeDialog="handleCloseDialog" :title="title" :displayTrainingDialog="displayTrainingDialog"></training-status-dialog>
    <v-tour name="userGuide" :callbacks="callbacks" :steps="steps" :options="options"></v-tour>
</el-main>
</template>

<script>
import DataTable from "../../components/DataTable.vue";
import TrainingStatusDialog from "../../components/TrainingStatusDialog.vue";
import QnaService from '../../services/QnaService'
import Constants from "@/resources/Constants";
import TrainingService from "@/services/TrainingService";
import _ from "lodash";
import uuidv4 from "uuid/v4";
import EventBus from "@/EventBus";
import {
    mapState
} from 'vuex'
import userGuide from "@/mixins/userGuide.js";
import navigation from "@/mixins/navigation.js";

export default {
    name: "QnAData",
    components: {
        DataTable,
        TrainingStatusDialog
    },
    mixins: [userGuide, navigation],
    computed: {
        ...mapState({
            isTableInEditMode: 'isTableInEditMode'
        })
    },
    data() {
        return {
            count: 0,
            pageTitle:"QNA",
            steps:Constants.USER_GUIDE_STEPS.QNA, 
            tableParams: {
                apiName: `/portal/api/table/trn_qna_data`,
                defaultData: {
                    'domain': Constants.DOMAINS['WA-QNA']
                },
                tableName: "trn_qna_data",
                isRestify: true,
                queryParam: {
                    active: true
                },
                limit: 10,
                initialSort: "-created_on",
                tableAction: [{
                        label: 'Train model',
                        icon: "el-icon-setting",
                        size: "medium",
                        event: "startTrainer"
                    },
                    {
                        label: 'Delete all',
                        icon: "el-icon-setting",
                        size: "medium",
                        event: "deleteAll"
                    }
                ],
                modelType: "QNA",
                downloadOptions: {
                    label: "Download Sample File",
                    path: `${window.location.origin}/portal/api/process-file?fileName=QNA.csv&alloweDelete=false`
                },
                allowInline: true,
                enableImport: true,
                enableExport: true
            },
            title: "QNA",
            displayTrainingDialog: false,
            searchValue: ''
        };
    },
    methods: {
        handleTutorialCompletion() {
            this.$store.commit("finishTutorial", this.$route.name);
        },
        handleCloseDialog() {
            this.displayTrainingDialog = false
        },
        getCount() {
            QnaService.fetchCount()
                .then((count) => {
                    this.count = count;
                })
                .catch((error) => {
                    // this.notifyError(error);
                    this.notifyError("Error while fetching QNA count");
                })
        },
        refreshCount() {
            this.getCount();
        },

        deleteAll() {
            this.$confirm(
                `Are you sure you want to delete all records?`,
                "Confirmation", {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning"
                }
            ).
            then(async () => {
                    let response = await QnaService.deleteAll(Constants.DOMAINS['WA-QNA']).catch((err) => {
                        this.notifyError("Error while deleting records");
                    })
                    if (response) {
                        this.notifySuccess(response.data.data.message);
                        //this.$refs.datatable.refreshTable();
                        EventBus.$emit('refreshTable');
                    }

                })
                .catch((err) => {
                    console.log(err)
                })

        },

        async startTrainer() {
            let res = await TrainingService.start(this, Constants.DOMAINS['WA-QNA'], Constants.TRANING_MODEL_TYPES.QNA_MODEL_TYPE).catch((err) => {
                this.notifyError("Error while training QNA model");
            })
            if (res) {
                this.displayTrainingDialog = true;
            }
        },
        prepareData(data) {
            let formattedRow = []
            _.forEach(data, (row) => {
                if (row['question'].trim() && row['answer'].trim()) {
                    row['answer'] = {
                        "data": row['answer'],
                        "TYPE": "STRING"
                    }
                    row['domain'] = Constants.DOMAINS['WA-QNA']
                    row['active'] = true
                    formattedRow.push(row)
                }
            })
            return formattedRow;
        }
    },
    async beforeMount() {
        this.getCount()
    },
    async beforeRouteLeave(to, from, next) {
        if (this.isTableInEditMode) {
            let res = await this.$confirm(
                `Changes you made may not be saved.`,
                "Leave page?", {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning"
                }
            ).
            then(() => {
                    this.$store.commit("setTableEditMode", false);
                    next();
                })
                .catch((err) => {
                    next(false)
                })
            return;
        }
        next()
    },
    beforeDestroy() {
    },
    mounted(){
        this.setupGuide()
    }
     }
</script>

<style lang="scss">
.taining-modal-container {
    .el-dialog__body {
        text-align:center;
    }
}
</style>
