<template>
    <el-dialog v-if="visibleEmailPopup" class="email-detail-popup" title="Email details pop up" :visible.sync="showEmailDetailsDialog" width="50%"
        :before-close="handleClose" :close-on-click-modal="false">
        <el-button round text class="email-details-cross" size="small" @click="handleClose"> <i class="mdi mdi-close"></i> </el-button>
        <EmailDetails :docIds="docIds" :messageId="emailRecord._id"></EmailDetails>
    </el-dialog>
</template>
  
<script>
import EmailDetails from "@/idp/components/EmailDetails.vue";
import DocumentService from "@/idp/services/DocumentService";

export default {
    name: "EmailDetailsPopup",
    components: {
        EmailDetails
    },
    props: ["emailRecord", "showEmailDetailsDialog", "documentType"],
    data() {
        return {
            docIds: [],
            visibleEmailPopup: false,
        }
    },
    watch: {
        "emailRecord._id": {
            handler: async function (newVal, oldVal) {
                if (!newVal || (newVal == oldVal)) {
                    return;
                }

                await this.getDocIdsByEmailId();
            }
        }
    },
    methods: {
        async getDocIdsByEmailId() {
            try {
                this.docIds = await DocumentService.getDocIdsByEmailId(this.emailRecord._id, this.documentType);
                this.visibleEmailPopup = true;
            } catch (error) {
                this.notifyError("Error while getting email details.");
                console.log("Error while fetching email details documentIds ", error);
            }
        },
        handleClose() {
            this.$emit("closeDialog");
        }
    }
};
</script>

<style lang="scss">

@import "../_idpVariables";
@import "../_idpGlobal";

.email-detail-popup{
    .email-details-container{
        .email-body{
            overflow: auto;
            font-size: 1rem;
            margin-top: 2rem;
            background: var(--sub-color2);
            padding: 20px 24px;
            margin-right: 1rem;
            max-height: 200px;
            border: 1px solid #5A67D8;
            margin-bottom: 1rem;
        }
        
        .attached-file-list{
            padding: 0px;
        }
        
        .email-container{
            padding-left: 4.6rem;
            font-size: 1rem;
            /* margin-top: 1rem; */
            /* margin-top: 0.5rem; */
            bottom: 1rem;
            position: relative;
            margin-top: 0px;
        }

        .email-from{
            padding-left: 5px;

            .avtar-details{
                .email-user-name{
                    font-size: 1.3rem;
                    color: rgb(91, 104, 216);
                    font-weight: 500;
                    bottom: 1rem;
                    position: relative;
                }

            } 
        }

        .email-subject{
            font-size: 1.286rem;
            color: rgb(59, 59, 59);
            padding-bottom: 11px;
            font-weight: 500;
            display: flex;
            border-bottom: 1px solid #cfcfcf;
            align-items: baseline;

            .subject-details{
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 95%;
            }
            
            .email-id{
                font-size: 1.286rem;
                color: rgb(59, 59, 59);
            }
        }
    } 
    .email-details-cross{
        position: absolute;
        border: 0;
        color: var(--dark-03);
        font-size: 1.2rem;
        vertical-align: text-top;
        padding: 0 !important;
        right: -8px;
        top: -8px;
        z-index: 9999;
        transition: .15s all ease-in-out;
        transform-origin: center center;
        background: var(--dark-08);
        width: 25px;
        height: 25px;
    
        &:hover {
            transform: scale(1.2);
        }
    
        span {
            display: block;
        }
    }
}

</style>