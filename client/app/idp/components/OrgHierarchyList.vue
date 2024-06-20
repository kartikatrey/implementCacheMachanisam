<template>
  <div class="org-hierarchy" v-loading="loading">
    <treeselect
      v-model="value"
      :clearable="false"
      :options="hierarchy"
      v-on:deselect="handleDeselect"
      v-on:select="handleSelect"
      :default-expand-level="20"
    />
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import EventBus from "@/EventBus";
import _ from "lodash";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import CustomerService from "@/idp/services/CustomerService";

export default {
  name: "OrgHierarchyList",
  components: { Treeselect },
  props: ["selectedValue", "hideHigherThanLevel","onSelectEventName"],
  data() {
    return {
      // define the default value
      value: null,
      loading: false,
      // define options
      hierarchy: [],
    };
  },
  watch: {
    hideHigherThanLevel: {
      handler(newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          this.prepareHierarchyData(newVal);
        }
      },
      deep: true,
    },
    hierarchy: {
      handler(newVal, oldVal) {
        if (this.selectedValue) {
          this.setSelected(this.selectedValue);
        }
      },
      deep: true,
    },
    selectedValue: {
      handler(newVal, oldVal) {
        if (newVal && newVal != oldVal) {
          this.setSelected(newVal);
        }
      },
      deep: true,
    },
    value: {
      handler(newVal, oldVal) {
        if (!newVal && this.setSelected && this.hierarchy) {
          this.setSelected(this.setSelected);
        }
      },
      deep: true,
    },
  },
  methods: {
    async getHierarchy() {
      this.loading = true;
      try {
        this.hierarchy = await CustomerService.getHierarchy();
        if (!this.hierarchy["org"]) {
          throw new Error("No data saved");
        }
        this.hierarchy = JSON.parse(this.hierarchy["org"]);
        this.prepareHierarchyData(this.hideHigherThanLevel);
      } catch (e) {
        console.error(e);
      }
      this.loading = false;
    },
    setSelected(val) {
      if (!val || !this.hierarchy || !this.hierarchy.length) {
        return;
      }
      let newHierarchy = this.hierarchy[0];
      if ("" + newHierarchy.org == "" + val) {
        this.value = newHierarchy.id;
        this.$store.commit('dashboardStore/setOrgHierarchy', newHierarchy.label)
        return;
      }

      let childFound = false;

      while (newHierarchy.children) {
        childFound = false;
        for (let child of newHierarchy.children) {
          if (("" + val).startsWith("" + child.org)) {
            newHierarchy = child;
            childFound = true;
            break;
          }
        }
        if (
          !childFound ||
          "" + newHierarchy.org == "" + val
        ) {
          this.value = newHierarchy.id;
          break;
        }
      }          
    },
    handleSelect(e) {
      this.$store.commit('dashboardStore/setOrgHierarchy', e.label)
      EventBus.$emit("ON_SELECT_ORG_HIERARCHY_"+this.onSelectEventName, e);
    },
    handleDeselect(e) {
      EventBus.$emit("orgHierarchyDeselect", e);
    },

    prepareHierarchyData(removeHigherThanLevel) {
      if (!removeHigherThanLevel || !this.hierarchy || !this.hierarchy.length) {
        return;
      }
      let newHierarchy = this.hierarchy[0];
      if ("" + newHierarchy.org == "" + removeHigherThanLevel) {
        return;
      }

      let childFound = false;

      while (newHierarchy.children) {
        childFound = false;
        for (let child of newHierarchy.children) {
          if (("" + removeHigherThanLevel).startsWith("" + child.org)) {
            newHierarchy = child;
            childFound = true;
            break;
          }
        }
        if (
          !childFound ||
          "" + newHierarchy.org == "" + removeHigherThanLevel
        ) {
          break;
        }
      }
      this.hierarchy = [newHierarchy];
    },
  },

  async beforeMount() {
    await this.getHierarchy();
  },
};
</script>
<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";
.org-hierarchy {
  width: 100%;
  background: transparent;
  z-index: 99;
  height: 100%;
  max-width: 13rem;
  box-sizing: border-box;
  .vue-treeselect__no-children-tip {
    display: none;
  }
  .vue-treeselect__control {
    background: var(--white);
    height: 24px;
    border-radius: 1px solid var(--radius-sm);
    border: 1px solid var(--dark-03);
    .vue-treeselect__placeholder,
    .vue-treeselect__single-value {
      line-height: 27px;
    }
  }
  .vue-treeselect__menu-container {
    background: var(--dark-08) !important;
  }
  .vue-treeselect--single .vue-treeselect__input-container {
    height: 24px;
    font-family: var(--font-family);
    font-size: var(--font-base);
  }
}
</style>