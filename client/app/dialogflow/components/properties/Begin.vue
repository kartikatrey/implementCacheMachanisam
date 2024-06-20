<template>
  
</template>

<script>
import EventBus from "@/EventBus";
import propertyJSON from "@/dialogflow/helpers/Property";

import _ from "lodash";
export default {
  name:"Begin",
  props: ["currentNode"],
  data() {
    return {
     formData:{}
    };
  },
  methods: {
  
  },
  mounted() {    
    EventBus.$emit("DISPLAY_PROPERTY_WINDOW", {name:'Properties'});
}
};
</script>
<style>
/* html,
body {
  height: 100%;
  margin: 0;
}


button.compile {
  z-index: 5;
  position: absolute;
  top: 10px;
  left: 10px;
} */
</style>