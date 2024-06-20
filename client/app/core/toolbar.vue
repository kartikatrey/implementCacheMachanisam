<template>
  <div class="toolbar flex align-center justify-space-between">
    <div class="box-left box grow flex">
      <button
        @click="toggleSidebar"
        v-if="menuBurger !== 'right'"
        class="toggle-sidebar card-base card-shadow--small"
      >
        <i class="mdi mdi-menu"></i>
      </button>
    </div>
    <div class="box-right flex align-center pl-10">
      <el-button
        class="help-button"
        v-if="enableHelp"
        :disabled="isTutorialInProgress"
        v-on:click="startTutorial"
        circle
        ><i class="el-icon-question"></i
      ></el-button>
      <el-select
        filterable
        clearable
        placeholder="Login with customer"
        v-model="customer_id"
        @change="onSelect($event)"
        v-if="isAdmin"
      >
        <el-option
          v-for="customer in customers"
          :value="customer._id"
          :key="customer._id"
          :label="customer.customer_name"
        ></el-option>
      </el-select>
      <el-button
        id="exit-setup"
        class="cancel-setup"
        v-if="isDigitalAssistanceSelected"
        type="danger"
        v-on:click="exitSetup"
        size="medium"
        >Exit setup : {{ selectedDigitalAssistance }}</el-button
      >
      <button class="fullscreen-button" @click="toggleFullscreen">
        <i class="mdi mdi-fullscreen" v-if="!fullscreen"></i>
        <i class="mdi mdi-fullscreen-exit" v-if="fullscreen"></i>
      </button>
      <!-- <el-popover ref="popover" placement="bottom" :width="popoverWidth" trigger="click">

<notification-box></notification-box>

</el-popover>

<el-badge :is-dot="true" class="notification-icon-badge">

<el-button v-popover:popover icon="mdi mdi-bell" class="notification-icon"></el-button>
      </el-badge>-->
      <!-- <span class="username feedback"><router-link to="/profile">Feedback</router-link></span> -->

      <!-- <span class="username"><router-link to="/profile">User Name</router-link></span> -->
      <span class="username" trigger="click" @command="onCommand">{{ userName }}</span>
      <el-dropdown trigger="click" @command="onCommand">
        <span class="el-dropdown-link">
          <img
            src="../assets/images/avatar.jpg"
            class="avatar user-avatar"
            alt="avatar"
          />
        </span>
        <el-dropdown-menu
          class="user-profile-dropdown"
          slot="dropdown"
          style="width: 150px"
        >
          <el-dropdown-item command="/user-profile" divided>Profile</el-dropdown-item>
          <el-dropdown-item v-if="isQnaCustomer" command="/subscriptions" divided
            >Purchases</el-dropdown-item
          >
          <el-dropdown-item v-if="isQnaCustomer" command="/billing" divided
            >Billing</el-dropdown-item
          >

          <el-dropdown-item command="/logout" divided>Logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <button
        @click="toggleSidebar"
        v-if="menuBurger === 'right'"
        class="toggle-sidebar toggle-sidebar__right card-base card-shadow--small"
      >
        <i class="mdi mdi-menu"></i>
      </button>
    </div>
  </div>
</template>

<script>
import NotificationBox from "@/components/NotificationBox";
import Search from "@/components/Search";
import CustomerService from "@/services/CustomerService";
import AjaxService from "@/services/AjaxService";
import EventBus from "@/EventBus";
import _ from "lodash";
import { mapState } from "vuex";

export default {
  name: "Toolbar",
  props: ["menuBurger"],
  data() {
    return {
      popoverWidth: 300,
      fullscreen: false,
      lang: "us",
      userName: "",
      customers: [],
      customer_id: "",
      isAdmin: false,
      isQnaCustomer: false,
      selectedDigitalAssistance: "",
      isDigitalAssistanceSelected: false,
    };
  },
  computed: {
    enableHelp() {
      return this.$route.meta.enableHelp;
    },
    ...mapState({
      isTableInEditMode: "isTableInEditMode",
      isTutorialInProgress: "isTutorialInProgress",
    }),
  },
  methods: {
    startTutorial() {
      this.$startTour();
    },
    onCommandLang(lang) {
      if (lang.charAt(0) === "/") this.onCommand(lang);
      else this.lang = lang;
    },
    onCommand(path) {
      this.$router.push(path);
    },
    toggleSidebar() {
      this.$emit("toggle-sidebar");
    },
    resizePopoverWidth() {
      if (window.innerWidth <= 768) {
        this.popoverWidth = 250;
      } else {
        this.popoverWidth = 300;
      }
    },
    toggleFullscreen() {
      this.$fullscreen.toggle(document.querySelector("body"), {
        wrap: false,
        callback: () => {
          this.fullscreen = this.$fullscreen.getState();
        },
      });
    },
    async init() {
      let user = this.$store.getters.user;
      this.isQnaCustomer = user.roles.includes("qna") ? true : false;
      if (!user.roles.includes("admin")) return;
      this.isAdmin = true;
      let customers = await CustomerService.find();
      this.customers = _.sortBy(customers, "customer_name");
      AjaxService.getJson("/portal/api/admin-login-with-customer", {}, (err, res) => {
        if (err) return this.notifyError("Error while processing");
        this.customer_id = res.data.customerId;
      });
    },
    onSelect(val) {
      const selectedCustomer = _.find(this.customers, (customer) => customer._id == val);
      localStorage.setItem("customer_name", selectedCustomer.customer_name);
      localStorage.setItem("customerName", selectedCustomer.customer_name);
      AjaxService.postJson(
        "/portal/api/admin-login-with-customer",
        {
          customer_id: this.customer_id,
        },
        (err, res) => {
          if (err) return this.notifyError("Error while processing");
          //localStorage.setItem("customer_id", this.customer_id);
          this.$store.commit("setCustomerId", this.customer_id);
          //this.notifySuccess(res.data.data);
          this.$router.go();
        }
      );
    },
    async exitSetup() {
      if (this.isTableInEditMode) {
        let res = await this.$confirm(
          `Changes you made may not be saved.`,
          "Exit setup?",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        ).catch((err) => {});
        if (!res) {
          return;
        }
      }
      this.$setLoader({
        target: "#exit-setup",
        spinner: "el-icon-loading",
      });
      AjaxService.postJson(
        "/portal/api/digital-assistance-setup",
        {
          isExitSetup: true,
          customer_id: this.selectedDAId,
        },
        (err, res) => {
          this.$resetLoader();
          if (err) return this.notifyError("Error while cancel setup");
          this.isDigitalAssistanceSelected = false;
          localStorage.setItem("qnaChild", "");
          EventBus.$emit("update-menu", {
            type: "update-menu",
          });
          this.$store.commit("setTableEditMode", false);
          this.$router.push({
            path: "/digital-assistant-list",
          });
        }
      );
    },
    checkDigitalAssistanceSetup() {
      let selectedDA = localStorage.getItem("qnaChild");
      let selectedDAId = localStorage.getItem("qnaChildId");
      if (selectedDA) {
        this.isDigitalAssistanceSelected = true;
        this.selectedDigitalAssistance = selectedDA;
        this.selectedDAId = selectedDAId;
      } else {
        this.isDigitalAssistanceSelected = false;
      }
    },
  },
  components: {
    NotificationBox,
    Search,
  },
  mounted() {
    let user = this.$store.getters.user;
    if (user) this.userName = user.full_name;
    this.fullscreen = this.$fullscreen.getState();
    this.resizePopoverWidth();
    window.addEventListener("resize", this.resizePopoverWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resizePopoverWidth);
    EventBus.$off("update-toolbar");
  },
  beforeMount() {
    this.init();
    EventBus.$on("update-toolbar", (payload) => {
      setTimeout(() => {
        this.checkDigitalAssistanceSetup();
      }, 1000);
    });
    this.checkDigitalAssistanceSetup();
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/scss/_variables";
@import "../assets/scss/_mixins";

.help-button {
  padding: 1px !important;
  font-size: 18px !important;
  color: #606266 !important;
  margin-right: 18px;
}
.el-popper {
  overflow: visible;

  .el-dropdown-menu__item--divided {
    border-top: 0;
  }
}

.toolbar {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  .feedback {
    margin-left: 20px !important;
  }

  .username {
    margin-left: 30px;
    // @include text-bordered-shadow();
    font-weight: $font-size-14;

    a {
      color: #a5b4c3;
      text-decoration: none;

      &:hover {
        color: $text-color-accent;
      }
    }
  }

  .avatar {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    border: 1px solid #fff;
    margin-left: 5px;
    box-sizing: border-box;
    display: block;
    cursor: pointer;
    box-shadow: 0 2px 5px 0 rgba(49, 49, 93, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08);
    transition: box-shadow 0.5s;

    &:hover {
      box-shadow: 0px 3px 10px 0 rgba(49, 49, 93, 0.08), 0px 2px 7px 0 rgba(0, 0, 0, 0.08);
    }
  }

  .notification-icon {
    font-size: 20px;
    outline: none;
    padding: 0;
    background: transparent;
    border: none;
    margin-left: 20px;
    //color: #aab7c5;
    color: transparentize($text-color, 0.7);
    @include text-bordered-shadow();

    &:hover {
      color: $text-color-accent;
    }
  }

  .toggle-sidebar {
    border: 1px solid transparent;
    height: 32px;
    min-height: 32px;
    line-height: 32px;
    width: 32px;
    min-width: 32px;
    max-width: 32px;
    box-sizing: border-box;
    text-align: center;
    margin: 0;
    outline: none;
    margin-right: 5px;
    font-size: 24px;
    padding: 0;
    cursor: pointer;
    display: inline-block;
    color: $text-color;
    background: white;
    display: none;
    opacity: 0;
    transition: all 0.5s;

    &__right {
      margin-right: 0px;
      margin-left: 5px;
    }

    &:hover,
    &:focus,
    &:active {
      color: $text-color-accent;
      border-color: $text-color-accent;
    }
  }

  .fullscreen-button {
    font-size: 24px;
    cursor: pointer;
    outline: none;
    padding: 0;
    background: transparent;
    border: none;
    margin-left: 20px;
    //color: #aab7c5;
    color: transparentize($text-color, 0.7);
    @include text-bordered-shadow();

    &:hover {
      color: $text-color-accent;
    }
  }

  .el-dropdown {
    .flag-icon {
      box-shadow: 0 2px 5px 0 rgba(49, 49, 93, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.08);
      cursor: pointer;
      border: 1px solid lighten($background-color, 20%);
      background-color: lighten($background-color, 20%);
    }
  }
}

@media (max-width: 650px) {
  .toolbar {
    .username {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .toolbar {
    padding: 0 10px;

    .toggle-sidebar {
      display: block;
      opacity: 1;
    }

    .fullscreen-button {
      display: none;
    }
  }
}

.cancel-setup {
  margin-left: 20px;
  background-color: #f56c6c;
  border-color: #f56c6c;
}

.user-profile-dropdown {
  padding-top: 0px;
  padding-bottom: 0px;
  li {
    border-bottom: 1px solid #e8e8e8 !important;
  }
  .el-popper {
    padding-bottom: 0px;
    padding-top: 0px;
  }
  .el-popper .el-dropdown-menu__item--divided {
  }

  .el-dropdown-menu__item--divided:before {
    height: 0px;
  }
}
.user-avatar {
  margin-top: 17px;
}
</style>
