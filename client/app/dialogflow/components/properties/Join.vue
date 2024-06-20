<template>

</template>

<script>
import wfDirty from "@/mixins/wfDirty.js";
import PropertiesFooter from "./PropertiesFooter.vue";
import PropertiesHeader from "@/dialogflow/components/properties/PropertiesHeader.vue";
import Codemirror from "@/components/Codemirror.vue";

import _ from "lodash";

export default {
  name: "Join",
  props: ["dialogFlowData", "currentNode"],
  components: {
    Codemirror,
    PropertiesFooter,
    PropertiesHeader,
  },
  mixins: [wfDirty],
  data() {
    return {
      form: {},
    };
  },
  methods: {
    init() {
      let nodeData = JSON.parse(JSON.stringify(this.currentNode.data));
      this.form = {
        node_id: nodeData["node_id"],
        ...this.form,
      };
      _.size(nodeData) > 1 ? (this.form = nodeData) : null;
            this.$nextTick(()=>{this.clonedForm = JSON.parse(JSON.stringify(this.form))})	

    },
  },
  mounted() {},
  async beforeMount() {
    this.init();
  },
};
</script>

<style lang="scss">
</style>