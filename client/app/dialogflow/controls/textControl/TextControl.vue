<template>
<span class="nodetitle">{{title}}</span>
</template>


<script>
export default {
  props: ["readonly", "emitter", "ikey", "getData", "putData"],
  data() {
    return {
      title: ""
    };
  },
  methods: {
  
  },
  mounted() {
  this.title = this.ikey

  }
}
</script>

<style>
.nodetitle {
font-size: 16px;
    font-weight: 700;
    color:black;
}
</style>

