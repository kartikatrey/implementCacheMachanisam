<template>
<div class="avatar-wrapper">
    <el-popover :disabled="disablePopover" popper-class="user-view" placement="top-start" width="250" trigger="hover">
        <div @mouseover="onMouseHover"  @mouseout="onMouseOut" slot="reference" class="icon-container">
            <avatar :backgroundColor="color.background" :color="color.font" :username="username" :src="src" :size="size"></avatar>
            <div v-if="showStatus && hideClose" v-bind:class="{'user-online' : status && status.state}" class='status-circle' >
            </div>
            <el-button type="text" :disabled="disableRemoveUser" v-if="!hideClose && showClose" class='mdi mdi-close-circle remove-user' @click="removeUser">
            </el-button>
        </div>
        <div class="user-profile">
            <avatar :backgroundColor="color.background" :color="color.font" :username="username" :src="image" :size="50"></avatar>
            <div class="user-profile-popup">
                <span class="user-name">{{ username }}</span>
                <span v-if="userEmail" class="user-email">{{ userEmail }}</span>
            </div>
        </div>
    </el-popover>
</div>
</template>

<script>
import Avatar from 'vue-avatar'
var hsl = require('hsl-to-hex')
import Constants from "@/resources/Constants";

export default {
    components: {
        Avatar,
    },

    props: ["username", "src", "size", "status", "showStatus", "disablePopover","userId","showClose","userEmail"],
    data() {
        return {
            image:null,
            lighten:"10",
            hideClose:true,
            disableRemoveUser:false
            
        };
    },
    computed: {
       color() {
            const selectedTheme = this.$store.getters.selectedTheme;
            let backgroundSaturation, backgroundLightness, fontSaturation, fontLightness;

            if (selectedTheme === "dark") {
                backgroundSaturation = "30";
                backgroundLightness = "20";
                fontSaturation = "70";
                fontLightness = "80";
            } else {
                backgroundSaturation = "45";
                backgroundLightness = "90";
                fontSaturation = "50";
                fontLightness = "35";
            }
            let hash = 0;
            for (let i = 0; i < this.username.length; i++) {
                hash = this.username.charCodeAt(i) + ((hash << 5) - hash);
            }
            const hue = hash % 360;
            const background = hsl(hue, backgroundSaturation, backgroundLightness)  
            const font =  hsl(hue, fontSaturation, fontLightness)
            return ({font, background});
        }
    },
    methods: {
         onMouseHover() {
              this.hideClose = false
        },
          onMouseOut() {
              this.hideClose = true
        },
         removeUser() {
             this.disableRemoveUser = true
             this.$emit('remove-user', this.userId)
         }
    },
};
</script>

<style lang="scss">
@import "../../../_idpGlobal.scss";
@import "../../../_idpVariables.scss";
.vue-avatar--wrapper {
    span {
    font-weight: bold !important;
    font-family: var(--font-family) !important;
    font-size: 1.1rem;
}
}


.avatar-wrapper {
      padding-right:5px;
}
.user-view {
    width: auto !important;
  }

.user-profile {
    display: flex;
    align-items: center;

    .user-name {
        margin-left: var(--space-base);
        font-weight: 400;
        color: var(--dark-01);
    }

    .avatar table td {
        text-align: center;
        vertical-align: middle;
        font-size: 1.7rem;
        font-weight: 500;

    }
}

.icon-container {
    position: relative;
}

.status-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1.5px solid white;
    background-color: var(--yellow-05);
    top: -3px;
    right: -3px;
    position: absolute;
}

.remove-user{
    font-size: 1rem !important;  
    border-radius: 50%;
    border: 1.5px solid white;
    top: -16px;
    right: -4px;
    position: absolute;
    color:var(--brand-05);
    cursor:pointer;
            &:hover {
                color:var(--brand-05);
                font-size: 1.15rem;
                opacity:1;
            }
}

div.user-online {
    background-color: var(--green-06);
}

.user-profile-popup{
    display: grid;

    .user-email {
        margin-left: 12px;
        font-size: 12px;
    }
}
</style>
