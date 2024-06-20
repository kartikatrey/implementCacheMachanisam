<template>
  <div class="slushbucket_container">
    <el-button
      class="field-opener-button"
      @click="openModal"
      cid="idp-field-selection"
      :disabled="isDocumentReadOnly"
      :type="buttonType || 'primary'"
    >
      <span v-if="buttonIcon" :class="buttonIcon"></span>
      {{ buttonText || "" }}
    </el-button>
    <el-dialog
      width="46rem"
      class="slushbucket_modal"
      :title="title"
      :visible.sync="showModal"
      :before-close="close"
    >
      <span v-if="!data.length">No Data to show</span>
      <el-tabs
        v-if="data.length"
        v-model="selectedGroup"
        @tab-click="handleTabChange"
      >
        <el-tab-pane
          v-bind:key="key"
          v-for="(tabData, key) in data"
          :label="tabData.label"
          :name="tabData.name"
          :cid="'idp-field-selection_' + tabData.label"
        >
          <DualListBox
            :source="tabData.source"
            :destination="tabData.destination"
            label="name"
            @onChangeList="
              (changedData) => {
                onChangeList(changedData, tabData);
              }
            "
          />
        </el-tab-pane>
      </el-tabs>
      <el-row class="footer_row">
        <el-button cid="idp-field-selection-close" @click="close" type="secondary">Close</el-button>
        <el-button cid="idp-field-selection-save" @click="save" type="primary">Save</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import DualListBox from "dual-listbox-vue";
import "dual-listbox-vue/dist/dual-listbox.css";

export default {
  name: "SlushBucket",
  // props: ["columns", "tableIdentifier"],
  components: { DualListBox },
  computed: {},
  props: [
    "data",
    "selectedGroup",
    "buttonText",
    "buttonType",
    "buttonIcon",
    "title",
    "isDocumentReadOnly"
  ],
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    handleTabChange(selectedTab) {
      this.selectedGroup = selectedTab.name;
    },
    close() {
      this.$emit("onClose");
      this.showModal = false;
    },
    save() {
      this.showModal = false;
      const selected = {};
      this.data.map((group) => {
        selected[group.name] = group.destination.map((field) => field.code);
      });
      this.$emit("onSave", selected);
    },
    openModal() {
      this.showModal = true;
    },
    onChangeList: function ({ source, destination }, tabData) {
      tabData["source"] = source;
      tabData["destination"] = destination;
    },
  },
  beforeMount() {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.slushbucket_container {
  .slushbucket_modal {
    div.el-dialog {
      width: 48rem;
      height: 36rem;
      padding: 2rem;
      .footer_row {
        margin: 16px 0px 016px 16px;
        float: right;
      }
      div.bulk-action:hover {
        cursor: pointer;
      }
      div.bulk-action {
        .select-all {
          padding: 4px;
          background-color: #5a67d8;
        }
        .deselect-all {
          padding: 4px;
          color: #96989a;
          background: white;
          border-radius: 0px;
        }
      }

      ul.list-box {
        li.list-item.active {
          background-color: #5a67d8;
          color: var(--white);
        }
        li.list-item.active:hover {
          background-color: #5a67d8;
          color: var(--white);
        }
      }

      .el-tab-pane {
        font-family: var(--font-family);
        font-size: var(--font-sm);
        font-weight: normal;
        div.clear-search {
          padding: 0px 4px 0px 4px;
          margin: 4px;
          border: 1px solid;
          border-radius: 10px;
          color: #6c757d;
        }

        .list-box-wrapper {
          .list-box-item {
            border-radius: 0px;
            input {
              background-color: var(--dark-07);
              height: 2rem;
            }
            input:hover {
              border-radius: 0px;
              border: none;
            }
            &::placeholder {
              font-family: var(--font-family);
              font-size: var(--font-sm);
              font-weight: normal;
            }
          }
          .actions {
            div.btn-action {
              background-color: #5a67d8;
              padding: 0px 4px 0px 4px;
              svg {
                height: 1rem;
                width: 1rem;
              }
            }
          }
        }
      }

      .list-box::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px var(--dark-06);
        background-color: var(--white);
      }

      .list-box::-webkit-scrollbar {
        width: 6px;
        background-color: var(--white);
      }

      .list-box::-webkit-scrollbar-thumb {
        background-color: var(--dark-05);
      }
    }
  }
}
</style>
