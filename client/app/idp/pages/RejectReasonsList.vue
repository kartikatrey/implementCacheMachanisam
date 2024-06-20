<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="table-wrap" v-if="tableParams">
        <DataTable :parameters="tableParams"></DataTable>
      </div>
    </section>

    <el-dialog
      v-if="showReasonPopup"
      :title="isEditMode ? `Edit reason` : `Add reason`"
      custom-class="reason-config-wrap"
      :visible.sync="showReasonPopup"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="dialogClosing"
      width="30%"
      center
      @close="onDialogClose"
    >
      <div class="inner-body">
        <!-- <h3>Add column</h3> -->
        <el-form
          :model="reasonForm"
          ref="reasonForm"
          label-width="100px"
          :rules="formRules"
        >
          <el-row>
            <div class="kp-form-group">
              <el-form-item
                class="control-label col-sm-2"
                prop="label"
                label="Label"
              >
                <el-input
                  cid="reason-config-form-type"
                  class="form-control"
                  prop="label"
                  v-model="reasonForm.label"
                  placeholder="Label"
                ></el-input>
              </el-form-item>
            </div>
          </el-row>
          <el-row>
            <div class="kp-form-group">
              <el-form-item
                class="control-label col-sm-2"
                prop="value"
                label="Value"
              >
                <el-input
                  cid="reason-config-form-type"
                  class="form-control"
                  prop="label"
                  v-model="reasonForm.value"
                  placeholder="value"
                ></el-input>
              </el-form-item>
            </div>
          </el-row>
          <el-row>
            <div class="kp-form-group">
              <el-form-item
                class="control-label col-sm-2"
                prop="document_type"
                label="Document type"
              >
                <el-select
                  style="padding-left: 0px"
                  class="select-box"
                  size="large"
                  v-model="reasonForm.document_type"
                  filterable
                  reserve-keyword
                  cid="reason-config-form-data-type-select"
                  placeholder="Select document type"
                >
                  <el-option
                    v-for="(type, index) in document_type_list"
                    :cid="'reject-reason-form-document-type_' + index"
                    :key="type"
                    :label="type"
                    :value="type"
                    label-width="170px"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-row>
        </el-form>
      </div>
      <footer id="add-user-footer">
        <el-button
          size="small"
          v-if="!isEditMode"
          cid="reason-config-form-add"
          @click="addRejectReason"
          type="primary"
          >Add</el-button
        >
        <el-button
          size="small"
          v-if="isEditMode"
          cid="reason-config-form-add"
          @click="updateRejectReason"
          type="primary"
          >Update</el-button
        >
        <el-button
          size="small"
          cid="reason-config-form-done"
          @click="dialogClosing"
          >Close</el-button
        >
      </footer>
    </el-dialog>
  </el-main>
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import EventBus from "@/EventBus";
import { Loading } from "element-ui";
import RejectReasonService from "@/idp/services/RejectReasonService";
import CustomerConfig from "@/idp/services/DeCustomerConfig";

export default {
  name: "RejectReasonsList",
  components: {
    DataTable,
    Loading,
  },
  data() {
    return {
      beforeEdit: "",
      reasonForm: {},
            formRules: {
        label: [
          {
            required: true,
            message: "Please enter label",
            trigger: "blur",
          },
        ],
        value: [
          {
            required: true,
            message: "Please enter label",
            trigger: "blur",
          },
        ],
        document_type: [
          {
            required: true,
            message: "Please select document type",
            trigger: "change",
          },
        ],
      },
      showReasonPopup: false,
      isEditMode: false,
      tableParams: "",
      document_type_list: [],
    };
  },
    methods: {
        onDialogClose() {
      console.log("onDialogClose");
      this.beforeEdit = "";
      this.fetchDetails();
    },
    dialogClosing(){
      this.resetForm();
      this.showReasonPopup = false
    },
    resetForm(){
      this.$refs.reasonForm && this.$refs.reasonForm.resetFields();
      this.reasonForm = {};
    },
    async updateRejectReason() {
      let isValid = await this.$refs.reasonForm.validate().catch((error) => {});

      if (!isValid) {
        this.disableAddColumnButton = false;
        return;
      }
      const response = await RejectReasonService.put({
        oldVal: _.pick(this.beforeEdit, ["value", "label", "document_type"]),
        newVal: _.pick(this.reasonForm, ["value", "label", "document_type"]),
      });
      if (_.get(response, "data.status")) {
        this.notifySuccess("Reason saved successfully");
        this.resetForm();
        this.showReasonPopup = false;
        this.fetchDetails();
      } else {
        this.notifyError("Reason not saved !");
      }
      console.log("upsertRejectReason");
    },
    async addRejectReason() {
      let isValid = await this.$refs.reasonForm.validate().catch((error) => {});
      this.beforeEdit = '';

      if (!isValid) {
        this.disableAddColumnButton = false;
        return;
      }
      const response = await RejectReasonService.upsert(this.reasonForm);
      if (_.get(response, "data.status")) {
        this.notifySuccess("Reason created successfully");
        this.resetForm();
        this.showReasonPopup = false;
        this.fetchDetails();
      } else {
        this.notifyError("Reason not created !");
      }
      console.log("upsertRejectReason");
    },
    async deleteRejectReason(data) {
      this.$confirm("Do you want to delete ?", "Confirmation", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          const payload = _.pick(data, ["value", "label", "document_type"]);
          const response = await RejectReasonService.delete(payload);
          if (_.get(response, "data.status")) {
            this.notifySuccess("Reason deleted successfully");

          } else {
            this.notifyError("Reason not deleted !");
          }
          this.fetchDetails();
        })
        .catch((error) => {});
    },
    async getDocumentType() {
      let document_types = await CustomerConfig.getDocumentTypes();
      return document_types;
      // Removed user domain dependancy
      // this.domain_document_map = await CustomerConfig.getDocumentTypes();
      // (this.domain_document_map || []).map((list) => {
      //   document_types = _.uniq([
      //     ...document_types,
      //     ...(list.document_type || []),
      //   ]);
      // });
      // return document_types.filter((type) => type.toLowerCase() != "other");
    },
    prepareDatatable(data) {
      this.tableParams = {
        tableMode: "static",
        pageTitle: "Reject Reason",
        initialSort: "label",
        isStaticTable: true,
        customfilter: false,
        showPaginationOptions: false,
        showTableToolbar: true,
        fixedHeader: false,
        rows: _.cloneDeep(data),
        isRegxSearch:false,
        globalSearch:false,
        columns: [
          {
            field: "label",
            label: "Label",
            filterOptions: {
              enabled: true,
              placeholder: 'Search',
              filterValue: '',
              trigger: 'enter',
            }
          },
          {
            field: "value",
            label: "Value",
            filterOptions: {
              enabled: true,
              placeholder: 'Search',
              filterValue: '',
              trigger: 'enter',
            }
          },
          {
            field: "document_type",
            label: "Document type",
            filterOptions: {
              enabled: true,
              placeholder: 'Search',
              filterValue: '',
              trigger: 'enter',
            }
          },
          {
            label: "Actions",
            field: "actions",
            sortable: false,
            tdClass: "action-col ",
            thClass: "action-col single-action-col",
          },
        ],
        addButtonConfig: true,
        addButtonConfig: {
          event: "add_reject_reason",
          name: "Add",
        },
        actionItems: [
          {
            icon: "mdi mdi-delete",
            name: "Delete",
            event_name: "delete_reject_reason",
            inline: true,
          },
          {
            icon: "mdi mdi-pencil",
            name: "Edit",
            event_name: "edit_reject_reason",
            inline: true,
          },
        ],
      };
    },
        async fetchDetails() {
      this.loading = true;
      try {
        const response = await RejectReasonService.get();
        let data = _.get(response, "data.data") || [];
        data = _.cloneDeep(data);
        this.prepareDatatable(data);
      } catch (exception) {
        console.log(exception);
      } finally {
        this.loading = false;
        this.showReasonPopup = false;
        this.resetForm();
      }
    },
    async init() {
      await this.fetchDetails();
      this.document_type_list = await this.getDocumentType();
    },
  },
  async mounted() {
    this.init();
  },
  beforeDestroy() {
    EventBus.$off([
      "delete_reject_reason",
      "edit_reject_reason",
      "add_reject_reason",
    ]);
      },
  beforeMount() {
        EventBus.$on("delete_reject_reason", (reason) => {
      console.log(reason);
      this.deleteRejectReason(reason.row);
    });
    EventBus.$on("edit_reject_reason", (reason) => {
      console.log(reason);
      this.isEditMode =true;
      this.reasonForm = _.cloneDeep(reason.row);
      this.beforeEdit = _.cloneDeep(reason.row);
      this.showReasonPopup = true;
    });
    EventBus.$on("add_reject_reason", (reason) => {
      this.showReasonPopup = true;
      this.isEditMode =false;
    });
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
  },
};
</script>


<style  lang="scss">
@import "../_idpGlobal";
.reason-config-wrap {
  padding: 0;
  .el-dialog {
    padding: 0;
  }
  .el-dialog__header {
    display: block;
    padding: 1rem 2eem;
    .el-dialog__title {
      font-size: 1.286rem;
      margin: 0;
      color: rgba(45, 55, 72, 1);
      display: inline-block;
      font-weight: normal;
      margin-right: 1rem;
    }
    .el-dialog__headerbtn {
      top: 14px;
    }
  }
  .el-dialog__body {
    padding: 0 !important;
    .inner-body {
      padding: 1.5rem !important;
    }
  }
  #add-user-footer {
    padding: 1.2rem 1.8rem !important;
    border-top: 0.5px solid #e4e7ed;
    text-align: right;
    .dialog-footer {
      display: flex;
      justify-content: flex-end;

      div:first-child {
        margin-left: 0;
        margin-right: auto;
      }
      .file-uploads {
        background: rgba(90, 103, 216, 1);
        color: #ffffff;
        padding: 3px 13px;
        border: 1px solid #5f8fdf;
        margin-left: 0;
        margin-right: auto;
        display: inline-block;
        margin-right: 10px;
        border-radius: 3px;
        label {
          cursor: pointer;
        }
      }
      #upload-file {
        font-family: "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Fira Sans",
          "Droid Sans", "Helvetica Neue", sans-serif;
        white-space: unset;
        display: flex;
        padding: 5px 13px;
        font-size: 1rem;
        background: rgba(90, 103, 216, 1);
      }
    }
  } // footer
} // reason dialog
</style>