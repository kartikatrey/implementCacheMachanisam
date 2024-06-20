<template>
  <el-main class="kp-main">
    <section class="page-body">
      <div class="page-title">
        <el-button
          class="back-button"
          icon="mdi mdi-arrow-left-circle-outline"
          v-on:click="$router.push('/idp/roles')"
        >
        </el-button>
        <span class="page-title-text"> {{ pageTitle }}</span>
      </div>

      <section class="form-page-container" v-loading="loader">
        <div class="panel">
          <div class="panel-body" v-loading="loading">

          <el-row>
            <el-col :span="10">
                <div class="add-orgHierarchy-container">
                    <el-tree
                      :data="data"
                      node-key="id"
                      default-expand-all
                      :expand-on-click-node="false"
                    >
                      <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span v-if="!data.editMode">{{ data.label }}</span>

                        <el-input
                          v-if="data.editMode"
                          name="label"
                          :value="data.label"
                          placeholder="Label"
                          v-on:input="
                            (value) => {
                              changeNodeLabel(value, node, data);
                            }
                          "
                          v-on:blur="disabledEdit(data)"
                        ></el-input>

                        <span class="actions">
                          <el-button
                            type="text"
                            size="mini"
                            @click="() => disabledEdit(data)"
                            v-if="data.editMode"
                            icon="mdi mdi-check"
                          >
                          </el-button>

                          <el-button
                            type="text"
                            size="mini"
                            v-if="!data.editMode"
                            @click="() => enableEdit(data)"
                            icon="mdi mdi-pencil"
                          >
                          </el-button>

                          <el-button
                            type="text"
                            size="mini"
                            @click="() => append(data)"
                            icon="mdi mdi-plus"
                          >
                            
                          </el-button>
                          <el-button
                            type="text"
                            size="mini"
                            v-if="node.parent_id || data.parent_id"
                            @click="() => remove(node, data)"
                            icon="mdi mdi-delete"
                          >
                            
                          </el-button>
                        </span>
                      </span>
                    </el-tree>
                </div>
            </el-col>
          </el-row>

          </div>
          <footer>
            <div></div>
            <div>
              <el-button cid="org-hirearchy-form-cancel" v-on:click="$router.push('/idp/roles')" size="small">
                Cancel
              </el-button>
            </div>
            <div>
              <el-button
                id="save-btn"
                cid="org-hirearchy-form-save"
                :disabled="disableSave"
                v-on:click="save"
                size="small"
                type="primary"
              >
                Save
              </el-button>
            </div>
          </footer>
        </div>
      </section>
    </section>
  </el-main>
  </template>
<script>
import RolesService from "@/idp/services/RoleService";
import CustomerService from "@/idp/services/CustomerService";
import EventBus from "@/EventBus";
const uuidv4 = require("uuid/v4");

export default {
  name: "OrgHierarchy",
  components: {},
  data() {
    return {
      pageTitle:"Organization Hierarchy",
      data: [],
      loading: false,
    };
  },

  methods: {
    changeNodeLabel(label, node, data) {
      this.$set(data, "label", label);
    },
    disabledEdit(data) {
      data.editMode = false;
    },

    enableEdit(data) {
      data.editMode = true;
    },

    generateNodeId() {
      return uuidv4();
    },

    generateNodeOrgString(parentNode) {
      const randomString = (length) => {
        let result = "";
        let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789";
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          );
        }
        return result;
      };
      if (parentNode) {
        return parentNode.org + "/" + randomString(5);
      }
      return randomString(5);
    },

    generateNode(parentNode) {
      let label =  "level";
      try {
        label = !parentNode ?JSON.parse(localStorage.getItem('vuex'))["user"]["customer_name"] || "level" : "level";
      } catch (error) {}
      return {
        id: this.generateNodeId(),
        parent_id: parentNode ? parentNode.id : null,
        label: label,
        children: [],
        org: this.generateNodeOrgString(parentNode),
        editMode: true,
      };
    },

    async init(){
      this.loading = true;
      try {
        await this.fetchOrgHierarchy();        
      } catch (error) {
        this.data = [this.generateNode()];
      }
      this.loading = false;
    },

    async fetchOrgHierarchy() {
      const result = await CustomerService.getHierarchy();
      if(!result["org"]){throw new Error("No data saved");}
      this.data = JSON.parse(result["org"]);
    },
    async save() {
      this.disableSave = true;
      this.loading = true;
      console.log("this.data ", JSON.stringify(this.data));
      try {
        const result = await CustomerService.saveHierarchy({
          org: JSON.stringify(this.data),
        });
        this.notifySuccess("Organizational structure saved successfully");
      } catch (error) {
        this.notifyError("Something went wrong while saving...");
      }
      this.disableSave = false;
      this.loading = false;
    },

    append(data) {
      const newChild = this.generateNode(data);
      if (!data.children) {
        this.$set(data, "children", []);
      }
      data.children.push(newChild);
    },

    remove(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",true);
    this.init()
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-base);
  padding-right: 8px;
}

.add-orgHierarchy-container {
  .vue-treeselect__input {
    &::placeholder {
      font-size: var(--font-base);
    }
  }
  .el-tree-node__content > .el-tree-node__expand-icon {
    padding: 8px;
    transition: unset;
  }
    // .el-tree-node > .el-tree-node__content {
    //   background: var(--dark-08);
    //   border-radius: var(--radius-base);
    //   color: var(--dark-01);
    //   padding: var(--space-xs) 0;
    //   margin-top: 10px;
    // }
     .el-tree-node__content {
       margin-bottom: var(--space-base);
       height: auto;
     }
     .custom-tree-node {
      background: var(--dark-08);
      border-radius: var(--radius-base);
      color: var(--dark-01);
      padding: var(--space-xs) var(--space-base);
       font-size: var(--font-base);
      height: 24px;
        &:hover {
             background: var(--dark-03);
             color: var(--white);
                 .actions {
                   display: block;
                    .el-button {
                      color: var(--white);
                    }
                  }
        }
    }
    .el-input__inner {
        height: 26px;
        border: 0;
        width: 80%;
    }
    .el-tree-node__expand-icon {
      color: var(--dark-04);
      font-size: var(--font-md);
       background: var(--dark-08);
    }
    .actions {
      display: none;
      .el-button {
        font-size: 1.4rem;
        padding: 3px;
        margin: 0;
      }
    }
   


////////////////////////


// .el-tree {
//   position: relative;
//   &:after {
//     content: "";
//     position: absolute;
//     width: 2px;
//     height: calc(100% - 62px);
//     border-right: red 1px solid;
//     top: 33px;
//   }
// }
// .el-tree-node {
//     position: relative;
//         .el-tree-node {
//           .el-tree-node__children {
//               &:after {
//                 content: "";
//                 position: absolute;
//                 width: 2px;
//                 height: calc(100% - 62px);
//                 border-right: red 1px solid;
//                 top: 33px;
//                 left: 18px;
//               }
//               .el-tree-node {
//                 &:after {
//                   content: "";
//                   position: absolute;
//                       width: calc(100% - 98%);
//                   border-top: red 1px solid;
//                   top: 16px;
//                   left: 20px;
//                 }
//               }
//           } 
//         }
// }





} // add-orgHierarchy-container 



</style>
