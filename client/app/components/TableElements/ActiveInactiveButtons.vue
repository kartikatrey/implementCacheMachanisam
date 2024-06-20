<template>
  <span>
    <el-dropdown-item
      v-if="propData.row.status=='Blocked' || propData.row.active==false"
      :command="activate"
    ><i  class="mdi mdi-check-circle-outline"></i>Activate</el-dropdown-item>
    <el-dropdown-item
      v-if="propData.row.status == 'Active' || propData.row.active == true"
      :command="block"
      ><i class="mdi mdi-minus-circle-outline"></i>Block</el-dropdown-item>
  </span>
</template>

<script>
import TableAPIService from "../../services/TableAPIService";
import AjaxService from "../../services/AjaxService";
import { _ } from "vue-underscore";
import lodash from 'lodash'
import EventBus from "@/EventBus";

let tableApiService = new TableAPIService();
export default {
  name: "ActiveInactiveButtons",
  props: ["propData"],
  data() {
    return {
      search: "",
      list: []
    };
  },
  methods: {
    activate(){
      this.update('Active')
    },
    block(){
         this.update('Blocked')
    },
    update(status) {
      let record = this.propData.row;
      let options = this.propData.column.options;
      let message = status == "Active" ? "activate" : "block";
      this.$confirm(`Are you sure you want to ${message} ?`, "Confirmation", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          let url = options.url;
          if (options.fieldType == "boolean") {
            status = status == "Active" ? true : false;
          }
          let updateInfo = {};
          updateInfo[options.field] = status;          
          if (options.isRestify) {
            return this.findByIdAndUpdate(
              url,
              record._id,
              updateInfo
            ).then(() => {});
          }
          if (options.filterCondition) {
            _.each(options.filterCondition, (value, key) => {
              options.filterCondition[key] = lodash.get(record, value, value);
            });
          }

          return this.updateUsingAjax(
            url,
            options.filterCondition,
            updateInfo
          ).then(() => {});
        })
        .catch(() => {
          // this.$message({
          //   type: "info",
          //   message: "You click Cancel"
          // });
        });
    },
    findByIdAndUpdate(url, recordId, updateInfo) {
      return new Promise((resolve, reject) => {
        tableApiService.findByIdAndUpdate(
          url,
          recordId,
          updateInfo,
          (error, response) => {
            if (response.data._id === recordId) {
              this.$notify({
                title: "Success",
                //message: response.data.data.message,
                type: "success"
              });
              EventBus.$emit('refreshTable');
            } else {
              this.$notify.error({
                title: "Error"
                //message: response.data.data.message
              });
            }
            resolve();
          }
        );
      });
    },
    updateUsingAjax(url, filterCondition, updateInfo) {
      let requestData = {
        filterCondition: filterCondition,
                 updateData : updateInfo
      }         
      AjaxService.postJson(url, requestData, (error, response) => {
            if (error) {
                  this.$notify.error({
                title: "Error"
              });
            return
            } 
              this.$notify({
                title: "Success",
                type: "success"
              });
              //this.$parent.$parent.refreshTable();
              EventBus.$emit('refreshTable');
          });

    }
  }
};
</script>
<style lang="scss">
.button-blocked {
  color: red !important;
  font-size: 26px !important;
  padding: 0 !important;
}
.button-active {
  color: rgba(66, 240, 153, 0.7) !important;
  font-size: 26px !important;
  padding: 0 !important;
}
.edit-delete-button-container {
  .el-button {
    padding: 5px;
    border: 0;
  }
}
</style>
