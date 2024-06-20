<template>
  <a :href="prepareUrl()" :cid="cid">{{
    propData.row.record_name
  }}</a>
</template>

<script>
import Constants from "@/resources/Constants";

export default {
  name: "BucketItemLink",
  props: ["propData"],
  components: {},
  data() {
    return {};
  },
  methods: {
    prepareUrl() {
      const formNameMapping = Constants.DOCEX.COLLECTION_TO_FORM_MAP;
      const formName = formNameMapping[this.propData.row.collection_name];
      const url = "/app/idp/" + formName + "?id=" + this.propData.row.record_id;
      return url;
    },
  },

  beforeMount() {},
  mounted() {
    
  },
};
</script>


