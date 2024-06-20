<template>
    <div class="action-button-list-icon">
        <span v-for="iconOption in options">
            <Icon :data="data" :options=iconOption></Icon>
        </span>
    </div>
</template>
  
<script>

import Icon from "./Icon";

export default {
    name: "ListIcon",
    props: ["data", "options"],
    components: { Icon },
    data() {
        return {};
    },
    computed: { },
    methods: {
        beforeMount() { }
    }
};
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" >
@import "../../_idpVariables";

.action-button-list-icon {
    text-align: center;
    display: flex;
    justify-content: space-around;

    .el-button {
        font-size: 1.4rem;
        color: var(--dark-03);
        padding: 0;
    }

    .el-button:hover {
        color: var(--brand-04);
    }
}
</style>
  