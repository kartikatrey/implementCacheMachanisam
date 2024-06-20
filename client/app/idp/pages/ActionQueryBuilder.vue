<template>
  <div v-loading="loading">
    <vue-query-builder
      :rules="rules"
      @blur="onBlur"
      v-model="query"
    ></vue-query-builder>
  </div>
</template>
<script>
import VueQueryBuilder from "vue-query-builder";
import Constants from "@/resources/Constants";
export default {
  name: "ActionQueryBuilder",
  props: ["query"],
  components: {
    VueQueryBuilder,
  },
   watch: {
    query: {
      handler(newVal, oldVal) {
        if (!newVal || newVal == oldVal) {
          return;
        }
        this.$emit("onQueryChange", newVal);
      },
      immediate: true,
      deep: true,
    },
   },
  data() {
    return {
      loading: false,
      rules: [],
    };
  },
  methods: {
    onBlur() {
      this.$emit("blur");
    },
    prepareRulesList() {
      this.loading = true;
      let rules = [];
      const fieldsListData = [
        { id: "state", name: "state" },
        { id: "stage", name: "stage" },
      ];
      let statelist = {
        ...Constants.DOCEX.STATE_UPLOADED,
        ...Constants.DOCEX.STATE_PUBLISHED,
        ...Constants.DOCEX.APPROVAL_STATUS,
      };
      let stateListData = Object.entries(statelist).map(([key, value]) => ({
        value: value,
        label: key,
      }));
      const stageListData = Constants.DOCEX.ALL_LIST_STAGES;
      const objList = {
        state: stateListData,
        stage: stageListData,
      };
      _.each(fieldsListData, (fieldData) => {
        let ruleObj = {
          type: "select",
          inputType: "select",
          operators: ["equals", "does not equal"],
          id: fieldData.id,
          label: fieldData.name,
          choices: objList[fieldData.name],
        };
        rules.push(ruleObj);
      });
      this.rules = _.sortBy(rules, "label");
      this.loading = false;
    },

    async init() {
      this.prepareRulesList();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
</style>
