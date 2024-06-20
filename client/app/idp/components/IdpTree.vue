<template>
  <nav class="idp-tree">
    <!-- Folder search and add root folder -->
    <div class="tree-container">
      <div class="search-container">
        <el-form @submit.native.prevent>
          <span class="mdi mdi-magnify search-icon"></span>
          <el-input
            v-model="folderSearch"
            type="text"
            cid="idp-folder-search-text"
            placeholder="Search"
            name="search"
            size="mini"
          >
          </el-input>
          <el-popover
            v-if="!isTryItUser()"
            popper-class="add-folder-popover-container"
            placement="right"
            trigger="click"
          >
            <el-form class="add-folder-popover-body" label-position="top" @submit.native.prevent>
              <div class="form-horizontal">
                <el-form-item label="Add folder">
                  <el-input
                    name="name"
                    cid="idp-add-folder-name"
                    v-model="folderName"
                    placeholder="Folder name..."
                    @keyup.enter.native="addRootFolder()"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Organization hierarchy">
                  <org-hierarchy-list :onSelectEventName="onSelectEventName" :hideHigherThanLevel="hideHigherThanLevel" :selectedValue="userOrg" ref = "orgComp"></org-hierarchy-list>
                </el-form-item>
                
              </div>
            </el-form>
            <span v-if="invalidFolderName" class="folder-name-validation"
              >*Please enter valid folder name</span
            >
            <footer>
              <div></div>
              <div></div>
              <div style="text-align: right">
                <el-button
                cid="idp-confirm-folder-name"
                  :disabled="checkDisable"
                  class="btn btn-sm btn-primary"
                  @click="addRootFolder()"
                  >Confirm</el-button
                >
              </div>
            </footer>

            <!-- <i  class="el-icon-plus"></i> -->
            <el-button slot="reference" :disabled="hasButtonPermission('idp-add-folder')" cid="idp-add-folder" @click="handleClick">
              <span class="material-icons">add</span>
            </el-button>
          </el-popover>
        </el-form>
      </div>
    </div>

    <!-- Folder Tree -->
    <div class="folder-tree-container" v-loading="loading">
      <el-tree
        :props="props"
        :data="directoryData"
        default-expand-all
        highlight-current
        :filter-node-method="filterNode"
        current-node-key
        @node-click="handleNodeClick"
        @current-change="onCurrentNodeChange"
        node-key="id"
        empty-text=" "
        ref="tree"
        icon-class="mdi mdi-folder-outline mdi-folder-tree"
      >
        <span
          class="custom-tree-node"
          @mouseover="hoverNode = node.id"
          @mouseleave="hoverNode = ''"
          slot-scope="{ node }"
        >
          <span :cid="'idp-tree-folder_'+ node.label">{{ node.label }}</span>
          <span>
          </span>
        </span>
      </el-tree>
    </div>

    <!-- Archived and deleted folders -->
    <div class="menu" v-if="false">
      <ul>
        <li>
          <i class="mdi mdi-folder-outline"></i>
          <a href="#"> Archived</a>
        </li>
        <li><i class="mdi mdi-delete"></i> <a href="#">Deleted</a></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import DocumentService from "@/idp/services/DocumentService";
import { Loading } from "element-ui";
import EventBus from "@/EventBus";
import { scroller } from "vue-scrollto/src/scrollTo";
import Constants from "@/resources/Constants";
import OrgHierarchyList from "@/idp/components/OrgHierarchyList.vue";


const scrollTo = scroller();
let folderCreation = false; 
export default {
  name: "IdpTree",
  props: ["document_type"],
  watch: {
    folderSearch(val) {
      this.$refs.tree.filter(val.toLowerCase().trim());
    },
    document_type: {
      handler: function (newVal, oldval) {
        if (!newVal || newVal == oldval) {
          return;
        }
        this.init();
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    const storage = JSON.parse(localStorage.getItem('vuex'))
    const userOrg = storage["user"] && storage["user"]["org"] ? storage["user"]["org"]: null;
    return {
      isReviewerOnly:false,
      userOrg,
      hideHigherThanLevel: userOrg,
      loading: true,
      hover: false,
      activeNode: 1,
      hoverNode: 1,
      displayFolderDialog: false,
      invalidFolderName: false,
      folderSearch: "",
      folderName: "",
      isRootFolder: false,
      props: {
        label: "name",
        children: "children",
        isLeaf: "leaf",
      },
      directoryData: [],
      clickedNode: {},
      selectedFolderPath: "",
      orgName : userOrg || '',
      onSelectEventName : "IDP_TREE"
    };
  },
  computed: {
    checkDisable(){
      return this.isReviewerOnly||(!(this.folderName && this.orgName) ? true :false)
    }
  },
  methods: {
    loadNode(node, resolve) {
      this.n = node;
      resolve([]);
    },
    addRootFolder() {

      // avoid multiple clicks or enter
      if(folderCreation){
        return;
      }
      folderCreation = true;
      this.isRootFolder = true;
      this.createFolder();
    },

    async createFolder(node, data) {
      this.$setLoader({target: ".add-folder-popover-container",spinner: "el-icon-loading",background:this.$store.getters.uiConfig.mainColor ||"rgba(226, 232, 240)"});
      let createdNode = {};
      data ? (this.clickedNode = data) : "";
      let directoryPath = this.clickedNode
        ? this.getDirectoryPath(this.$refs.tree.getNode(this.clickedNode))
        : null;
      directoryPath =
        !this.isRootFolder && directoryPath
          ? `${directoryPath}/${this.folderName}/`
          : `/${this.folderName}/`;
      let currentNodeId = this.isRootFolder
        ? null
        : this.clickedNode && this.clickedNode.id;
      let response = await DocumentService.createFolder({
        directory: directoryPath,
        document_type: this.document_type,
        current_node_id: currentNodeId,
      });
      document.getElementsByTagName("body")[0].click();
      this.isRootFolder = false;
      folderCreation = false;
      if (
        response.data.statusCode !== 200 ||
        (response.data.data && !response.data.data.status)
      ) {
        this.notifyError(`Error while creating folder '${this.folderName}'`);
        this.$resetLoader();
        return;
      }
      if (!response.data.data.result) {
        this.notifyError(`'${this.folderName}' is already taken for other hierarchy. Please choose another name.`);
        this.$resetLoader();
        return;
      }
      this.notifySuccess(`folder created successfully.`);
      this.$resetLoader();
      await this.storeFolderStructure()

      if (response.data.data.current_node_id) {
        createdNode = { name: this.folderName, id: response.data.data.id };
        this.$refs.tree.append(
          createdNode,
          this.$refs.tree.getNode(response.data.data.current_node_id)
        );
        this.$refs.tree.setCurrentKey(response.data.data.id);
        this.clickedNode = createdNode;
        this.updateTable(
          this.getDirectoryPath(this.$refs.tree.getNode(this.clickedNode))
        );
        this.folderName = ""; 
        this.init();
        return;
      }
      createdNode = { name: this.folderName, id: response.data.data.id };
      this.directoryData.push(createdNode);
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(response.data.data.id);
        this.clickedNode = createdNode;
      });
      this.updateTable("/" + this.folderName);
      this.folderName = "";
      this.init();
      return createdNode.id;
    },
    async storeFolderStructure(){
      let payload = {'name':this.folderName,
                      'document_type':this.document_type,
                      'org': this.orgName}

      await DocumentService.storeFolderStructure(payload);
      
    },
    async deleteFolder(node, data) {
      data ? (this.clickedNode = data) : "";
      if (!this.clickedNode.id) {
        this.notifyError("Please select a folder to delete.");
        return;
      }
      let directoryPath = this.getDirectoryPath(
        this.$refs.tree.getNode(this.clickedNode)
      );
      let response = await DocumentService.deleteEmptyFolder({
        directory: directoryPath,
        document_type: this.document_type,
        current_node_id: this.clickedNode.id,
      });
      if (
        response.data.statusCode !== 200 ||
        (response.data.data && !response.data.data.status)
      ) {
        this.notifyError(
          `Error occurred while deleting folder '${this.folderName}'`
        );
        return;
      } else if (response.data.data.result) {
        this.$refs.tree.remove(
          this.$refs.tree.getNode(response.data.data.current_node_id)
        );
        this.notifySuccess(`Selected folder deleted successfully.`);
        this.updateTable(null);
        this.$nextTick(() => {
          this.init();
        });
        return;
      }
      this.notifyError("The folder you are trying to delete is not empty.");
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.toLowerCase().indexOf(value) !== -1;
    },
    handleClick(){
      this.folderName = ''
      this.$refs.orgComp.setSelected(this.userOrg);
    },

    getFilter() {
      let filter = {};
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const filterString = urlParams.get("filter");
        filter = JSON.parse(filterString || "{}");
      } catch (err) {
        filter = {};
      }
      return filter;
    },
    updateTable(storage_folder_path) {
      const filter = this.getFilter();
      //to remove pagination when click on other folder
      filter.idp_invoice_list && delete filter.idp_invoice_list.pageSize
      if (!storage_folder_path) {
        delete filter["folderPath"];
      } else {
        filter["folderPath"] = storage_folder_path;
      }
      EventBus.$emit("IDP_APPLY_TREE_FILTER", {folderPath:storage_folder_path});
    },
    async handleNodeClick(data, node) {
      this.clickedNode = data;
      let directoryPath = "/"+data.name;//this.getDirectoryPath(this.$refs.tree.getNode(data));
      this.updateTable(directoryPath);
      let response = await DocumentService.getDirectories({
        directory: directoryPath,
        document_type: this.document_type,
        current_node_id: this.clickedNode.id,
      });
      this.appendChildDirectories(response);
      console.log("Current node Id", this.clickedNode.id);
    },
    appendChildDirectories(directoryResponse) {
      if (
        directoryResponse.data.result &&
        directoryResponse.data.result.length
      ) {
        if (!this.clickedNode.children) this.clickedNode.children = [];
        this.$refs.tree.updateKeyChildren(
          directoryResponse.data.current_node_id,
          directoryResponse.data.result
        );
      }
    },
    onCurrentNodeChange(currentNode, nodeProperty) {
      console.log(
        "=======================onCurrentNodeChange===================="
      );
    },
    getDirectoryPath(node) {
      if (!node) return;
      // let directoryPath = "";
      // var key = "parent";
      // while (_.get(node, key).parent) {
      //   directoryPath = "/" + _.get(node, key).data.name + directoryPath;
      //   key += ".parent";
      // }
      // directoryPath = directoryPath + "/" + node.data.name;
      // this.selectedFolderPath = directoryPath;
      // return directoryPath;
      return "/" + node.data.name;
    },
    async init() {
      this.loading = true;
      let filter = this.getFilter();
      let nodeId = null;
      let selectedFolder = filter["folderPath"] || null;
      let directoryResponse = await DocumentService.getFolderStructure({
        document_type: this.document_type
      });
      // let directoryResponseData =
      //   directoryResponse.data.status && directoryResponse.data.result;
      if (directoryResponse && directoryResponse.length) {
        this.directoryData = directoryResponse;
      } else {
        this.directoryData = [];
        this.loading = false;
        return;
      }
      // condition for dashboard drilldown request
      if (
        !selectedFolder ||
        (selectedFolder && ("" + selectedFolder).trim() == "/*")
      ) {
        this.loading = false;
        return;
      }
      // else nodeId = await this.createFolder();
      let selectedFolderName = selectedFolder
        ? selectedFolder.split("/").pop()
        : null;
      const initialNodeName =
        selectedFolderName ||
        this.$route.meta.parentFolderName ||
        this.directoryData[0].name;
      // if(initialNodeName) this.processTableParams(initialNodeName);
      //Finding the node with name as initialNodeName in the current tree data
      const initialNode = _.find(this.directoryData, { name: initialNodeName });
      //nodeId: for which node to append the directory data to
      nodeId = (initialNode && initialNode.id) || nodeId;
      if (nodeId) {
        let response = await DocumentService.getDirectories({
          directory: `/${initialNodeName}/`,
          document_type: this.document_type,
          current_node_id: nodeId,
        });
        this.appendChildDirectories(response);
      }
      this.$refs.tree.setCurrentKey(nodeId);
      this.clickedNode = initialNode;
      this.selectedFolderPath = this.getDirectoryPath(
        this.$refs.tree.getNode(initialNode)
      );
      this.loading = false;
      filter["folderPath"] && this.scrollToFolder();
    },

    scrollToFolder() {
      const tree_options = {
        container: ".folder-tree-container",
        easing: "ease-in-out",
        force: false,
        y: true,
      };
      this.$nextTick(() => {
        scrollTo(`.is-current`, 400, tree_options);
      });
    },
  },
  components: { Loading,OrgHierarchyList },
  created() {},
  mounted() {},
  beforeDestroy() {
    EventBus.$off(["ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName]);
  },
  beforeMount() {
    let user = this.$store.getters.user;
    this.isReviewerOnly= _.get(user,"is_reviewer_only") 
    if (!this.document_type) {
      return;
    }
    this.init();         
    EventBus.$on("ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName, (data) => {
        this.orgName = data && data.org
    })
    EventBus.$on('orgHierarchyDeselect', (data) => {
        this.orgName = data && data.org
    })
  },
};
</script>


<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
 .add-folder-popover-container {
        overflow: visible !important;
          .el-form-item {
            margin-bottom: var(--space-base) !important;
          }
         
          .form-horizontal label {
             width: 100% !important;
            margin-bottom: var(--space-sm) !important;
          }
      }
// KP Nav
.idp-tree {
  background: var(--dark-08);
  // max-width: 16rem;
  max-width: unset;
  height: 100%;
  position: fixed;
  top: 2.5rem;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 9;
     
  .el-menu-item {
    background: var(--dark-08);
  }
  .pinned {
    text-align: right;
    padding: 0.5rem 1rem 0 0;

    .el-button {
      background: transparent;
      border: 0;
      font-size: var(--font-sm);
      color: var(--dark-05);
      padding: 0;
      font-weight: 400;
      i {
        font-size: var(--font-base);
        display: inline-block;
        margin-right: var(--space-xs);
      }
    }
  }
  .menu {
    padding: 0 var(--space-base);
    padding-top: 0.5rem;
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      li {
        padding-bottom: var(--space-xs);

        i {
          vertical-align: sub;
          display: inline-block;
          margin-right: var(--space-md);
          font-size: 1.5rem;
          color: var(--dark-03);
          line-height: 110%;
        }
        span {
          // vertical-align: sub;
          // display: inline-block;
          // margin-right: var(--space-md);
          // font-size: 1.5rem;
          color: var(--dark-03);
          // line-height: 110%;
        }
        a {
          text-decoration: none;
          color: var(--dark-02);
          font-size: var(--font-sm);
        }
      }
    }
  }

  .tree-container {
    border-top: var(--border-lg) solid var(--dark-07);
    // border-bottom: var(--border-lg) solid var(--dark-07);
    // margin-top: 1rem;
    padding: var(--space-base);
    padding-right: 0.5rem;

    .search-container {
      position: relative;
      form {
        display: flex;
        button {
          padding: 0px;
          padding-left: 0.55rem;
          padding-right: 0.5rem;
          height: 1.8rem;
        }
        input {
          border-radius: 0px;
          padding-left: 2rem;
        }
      }
      .search-icon {
        position: absolute;
        color: #a0aec0;
        left: var(--space-sm);
        top: -2px;
        font-size: 18px;
      }
      input[type="text"] {
        font-size: var(--font-sm);
        border: var(--border-base) solid var(--dark-06);
        padding-left: var(--space-xl);
        background: var(--dark-07);
        display: inline-block;
        height: 1.8rem;
        line-height:20px;
      }
      button {
        background: transparent;
        border: none;
        cursor: pointer;
        span {
          font-size: var(--font-lg);
          color: var(--dark-03);
        }
      }

      .search-container button:hover {
        background: #ccc;
      }
    }
  }

  .folder-tree-container {
    border-bottom: var(--border-lg) solid var(--dark-07);
    padding: var(--space-sm);
    height: 80%;
    overflow: auto;
    padding-left: 0.7rem;
    .el-loading-mask {
      background-color: initial !important;
    }
    .el-loading-spinner {
      margin-top: -21px !important;
    }
    .el-tree {
      background: initial !important;

      .el-tree-node__expand-icon.is-leaf {
        font-size: 1.4rem;
        color: var(--dark-03);
        margin-right: var(--space-md);
      }
      .el-icon-folder {
        font-size: 1.4rem;
        font-weight: 900;
        color: #454444;
      }
      .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: var(--font-sm);
        padding-right: 8px;
        i {
          transform: rotate(90deg);
        }
      }
    }

    .el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: var(--dark-06);
      border-radius: var(--radius-base);
    }

    .el-tree-node__content:hover {
        color: var(--brand-04);
        .is-leaf {
            color: var(--brand-04);
        }
    }
  }
} // | Kp Nav

.folder-tree-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px var(--dark-06);
  background-color: var(--white);
}

.folder-tree-container::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: var(--white);
}

.folder-tree-container::-webkit-scrollbar-thumb {
  background-color: var(--dark-05);
}

.folder-modal-container {
  text-align: center;
  .folder-name-save {
    text-align: left;
  }
  .folder-name-validation {
    color: red;
    font-size: var(--font-base);
  }
  .space-toolbar {
    font-size: 0.1px;
    display: inline-block;
  }
}

div.el-popover.el-popper {
  border-radius: 0px;
  .add-folder-popover-body {
    label {
      margin-bottom: var(--space-base);
    }
    div.el-input {
      background-color: inherit;
      input {
        border-radius: 0px;
        background-color: var(--dark-07);
      }
    }
  }
}

ul.idp-tree-option-button-container {
  background-color: #f3f7fa;
  margin: 0px;
  padding: 4px;
  li.idp-tree-option-button-item {
    line-height: 11px;
    background-color: #f3f7fa;
  }
}








</style>
