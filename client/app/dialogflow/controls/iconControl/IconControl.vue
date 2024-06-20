<template>
<i :class="ikey" ></i>
</template>

<script>
export default {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  data() {
    return {
      iconName:"",
      reload:false
    };
  },
  methods: {
    
  }
}
</script>
