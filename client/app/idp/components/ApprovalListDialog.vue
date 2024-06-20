<template>
    <el-dialog title="Approver" :visible.sync="showApprovalHistory" width="60%" class="approvalList-modal">
        <p class="approval-list-title">
            <el-button round text class="approval-list-back" size="small" @click="closeDialog"> <i class="mdi mdi-close"></i> </el-button>
              Approval History
        </p>
        <approval-list :documentId="documentId"></approval-list>
    </el-dialog>
</template>

<script>
import {mapState} from 'vuex';
import ApprovalList from "@/idp/components/ApprovalList";
export default {
    name: 'ApprovalListDialog',
    components: {
        ApprovalList
    },
    Data() {

    },
    computed: {
        ...mapState({
            showApprovalHistory: "showApprovalHistory",
            documentId: "documentId",
            loading : "showLoader"
        })
   },
   methods: {
    closeDialog() {
        this.documentId = "";
        this.showApprovalHistory = false;
        this.$store.commit("setDisplayApprovalHistory",{
            "showApprovalHistory":false,
            "documentId":""
            });
        }  
   }

}
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.approvalList-modal {
  .el-dialog {
      padding: 1.7rem;

      .vue-good-table-box {
          height: 360px;
          overflow: auto;
      }

      .el-dialog__body {}

      .vue-good-table-box .vgt-table tbody tr td {
          text-align: left;
      }

      .export-btn {
          display: none;
      }

      .table-toolbar {
          margin-right: 3rem;
      }
  }

  .table-toolbar .support-btn .refreshbtn {
      span {
          transform: scale(1.4);
          display: block;
      }
  }
}


.approval-list-title {
  margin: 0 0 -2rem 0;
  font-style: normal;
  font-weight: 600;
  font-size: 1.286rem;
  line-height: 27px;
  letter-spacing: 0.01em;
  color: var(--dark-02);
  position: relative;
}

.approval-list-back {
  position: absolute;
  border: 0;
  color: var(--dark-03);
  font-size: 1.2rem;
  vertical-align: text-top;
  // padding: 0 .7rem 0 .4rem;
  padding: 0 !important;
  right: -10px;
  top: -10px;
  z-index: 9999;
  transition: .15s all ease-in-out;
  transform-origin: center center;
  background: var(--dark-08);
  width: 25px;
  height: 25px;

  &:hover {
      background: transparent !important;
      transform: scale(1.2);
  }
}
</style>