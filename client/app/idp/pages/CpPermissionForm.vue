<template>
	<el-main class="kp-main">
		<section class="page-body">
			<div class="page-title">
				<el-button
					cid="form-header-back"
					icon="mdi mdi-arrow-left-circle-outline"
					v-on:click="displayList"
				></el-button>
				<span class="page-title-text" v-if="cp_permission._id"
					>Edit {{ pageTitle }}
				</span>
				<span class="page-title-text" v-else>Add {{ pageTitle }}</span>
			</div>
			<section class="form-page-container">
				<div class="panel">
					<div class="panel-body">
						<el-form
							label-position="left"
							:model="cp_permission"
							ref="ruleForm"
							label-width="120px"
							:rules="validationRules"
						>
							<ConfirmModel ref="model"> </ConfirmModel>
							<div class="grouping-tile">
								Menu details
							</div>
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
                      label="Permission name"
                      prop="permission_name"
                      class="kp-form-field-label"
                    >
                      <el-input v-model="cp_permission.permission_name" placeholder></el-input>
                    </el-form-item>
									</div>
								</el-col>
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
                      label="Resource type"
                      prop="resource_type"
                      class="kp-form-field-label"
                    >
                    <el-select
                            v-model="cp_permission.resource_type"
                            default-first-option
                            clearable
                            @change="onResourceTypeChange"
                            filterable
                            placeholder="Select resource type"
                      >
                        <el-option
                            v-for="resource in resourceList"
                            :key="resource.value"
                            :label="resource.label"
                            :value="resource.value"
                          >
                        </el-option>
                      </el-select>
                    </el-form-item>
									</div>
								</el-col>	
							</el-row>

							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item label="Roles" prop="roles" class="kp-form-field-label">
                      <el-select
                            v-model="cp_permission.roles"
                            multiple
                            default-first-option
                            clearable
                            collapse-tags
                            placeholder="Select Role"
                      >
                        <el-option
                            v-for="role in rolesList"
                            :key="role.value"
                            :label="role.label"
                            :value="role.value"
                          >
                        </el-option>
                      </el-select>
                   </el-form-item>
									</div>
								</el-col>

								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item label="Operation" prop="operation" class="kp-form-field-label">
                      <el-select
                        v-model="cp_permission.operation"
                        @change="onOperationChange"
                        placeholder="Select"
                        label="Operation"
                      >
                        <el-option label="Read" value="read"></el-option>
                        <el-option label="Write" value="write"></el-option>
                      </el-select>
                    </el-form-item>
									</div>
								</el-col>
							</el-row>
							<el-row :gutter="40">
								<el-col :span="12">
									<div class="kp-form-group">
										<el-form-item
                      label="Column name"
                      prop="column_name"
                      class="kp-form-field-label"
                    >
                      <el-input v-model="cp_permission.column_name" placeholder></el-input>
                    </el-form-item>
									</div>
								</el-col>	
                <el-col :span="12">
									<div class="kp-form-group">
                    <el-form-item
                      label="Resource name"
                      prop="resource_name"
                      class="kp-form-field-label"
                    >
                    <el-input v-if="cp_permission.resource_type !== 'record'" v-model="cp_permission.resource_name" placeholder></el-input>
                    <el-select
                            v-if="cp_permission.resource_type === 'record'"
                            v-model="cp_permission.resource_name"
                            default-first-option
                            @change="onResourceNameChange"
                            clearable
                            filterable
                            collapse-tags
                            placeholder="Select resource name"
                      >
                        <el-option
                            v-for="resource in resourceNames"
                            :key="resource.value"
                            :label="resource.value"
                            :value="resource.value"
                          >
                        </el-option>
                      </el-select>
                    </el-form-item>
									</div>
								</el-col>
							</el-row>
						</el-form>
					</div>
          <div v-if="displayAddRecordDialog">
              <AddRecords
                :permissionRecord="cp_permission"
              />
          </div>
					<footer>
						<div></div>
						<div>
							<el-button size="small" v-on:click="displayList"
								>Cancel</el-button
							>
						</div>
						<div>
							<el-button size="small"
								v-on:click="save"
								type="primary"
								>Save</el-button
							>
						</div>
					</footer>
				</div>
			</section>
		</section>
    <VersionRelatedList  :id="cp_permission._id"  title="Resource permission versions"></VersionRelatedList>

	</el-main>
</template>

<script>
import _ from "lodash";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";
import UserService from "@/idp/services/UserService";
import VersionRelatedList from "@/idp/components/VersionRelatedList.vue";
import AddRecords from "@/idp/components/AddRecords.vue";
import EventBus from "@/EventBus";

export default {
  name: "PermissionFrom",
  components: {
    ConfirmModel,
    VersionRelatedList,
    AddRecords
  },
  data() {
    return {
      pageTitle: "permission",
      cp_permission: {},
      endpoint: constants.RESOURCE_PERMISSION_ENDPOINT,
      validationRules: this.setValidationRules(),
      rolesList: [],
      resourceList: [],
      resourceNames: [],
      displayAddRecordsDialog : false
    };
  },
  computed: {
    displayAddRecordDialog(){
      return _.get(this.cp_permission, "resource_type", "") === 'record';
    }
  },
  methods: {
    registerEvents() {
      EventBus.$on("add-record-ids", async (recordIds) => {
        this.cp_permission.record_ids = recordIds;
      });
    },
    async init() {
      const permissionId = this.$route.query.id;
      if (permissionId) {
        let cp_permission = await CommonService.fetchById(this.endpoint,permissionId).catch(error => {
          console.error(error)
          this.notifyError("Error while fetching permission data");
        });
        this.cp_permission = Object.assign({}, this.cp_permission, cp_permission);
      }
    },

    async save() {
      const isValid = await this.$refs.ruleForm.validate().catch(error => {});
      this.cp_permission.roles = _.isString(this.cp_permission.roles) ? this.cp_permission.roles.split(","):this.cp_permission.roles;
      const  permissionResponse = isValid && await CommonService.save(this.endpoint, this.cp_permission).catch(
          error => {
            this.notifyError("Error while saving permission data!!"+error);
          }
        );
        if(_.get(permissionResponse, "data.status") === 403){
          return this.notifyError(_.get(permissionResponse, "data.message", "Error while saving permission data!!"));
        }
        if (permissionResponse) {
          this.cp_permission._id = permissionResponse._id; // add service id after first request to existing service object to avoid duplicate service entries
          this.notifySuccess("Permission saved successfully!!");
          this.displayList();
        }
    },

    displayList() {
      this.$router.push({path: "/idp/permission-list"});
    },
    setValidationRules() {
      return {
        permission_name: [
          {
            required: true,
            message: "Please input permission name",
            trigger: "change"
          }
        ],
        resource_name: [
          {
            required: true,
            message: "Please input resource name",
            trigger: "change"
          }
        ],
        roles: [
          {
            required: true,
            message: "Please input roles",
            trigger: "blur"
          }
        ],
        operation: [
          {
            required: true,
            message: "Please input operation",
            trigger: "change"
          }
        ]
      };
    },
    async fetchRoles() {
      try {
        const roles = await UserService.getRoles({active:true,is_idp:true});
        this.rolesList = (roles || []).map((role) => {
          return { value: "" + role._id, label: "" + role.label };
        });
      } catch (e) {
        console.error(e);
      }
    },
    fetchConfigurationMenus(){
      this.resourceList = Object.entries(constants.PERMISSION_RESOURCE_TYPES).map(([key, value]) => ({
          value,
          label: key.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())
      })); 
    },
    onOperationChange(operation) {
    this.cp_permission.operation = operation;
    },
    onResourceTypeChange(resourceType) {
      if(resourceType === "record"){
        this.cp_permission.resource_name = "";
      }
    },
    onResourceNameChange(resourceName) {
      this.$set(this.cp_permission, 'resource_name', resourceName);
    },
    async fetchResourceNames(){
      const modelsResponse = await CommonService.fetchConfigCollectionList();
      if(!_.get(modelsResponse, "data.status")){
        return this.notifyError("Error while fetching resource names!!");
      }
      const allModels = _.get(modelsResponse, "data.data",[]);
      this.resourceNames = allModels.map(name => ({ value: name, label: name }));
    }

  },
  beforeDestroy() {
    EventBus.$off(["add-record-ids"]);
  },
  async beforeMount() {
    this.registerEvents();
    this.fetchRoles()
    await this.fetchResourceNames()
    this.fetchConfigurationMenus()
    await this.init();
  },
  
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.kp-form-group {
	.vue-tel-input {
		height: 22px;
		background-color: var(--dark-10);
		input {
			background-color: var(--dark-10);
			font-size: var(--font-sm);
		}
	}

    .el-input__prefix,
    .el-input__suffix {
      top: -6px !important;
    }
}
</style>
