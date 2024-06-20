<template>
  <div style="postion: fixed; top: 0">
    <header class="idp-admin-toolbar">
      <div class="logo">
        <img :src="logoPath" />
      </div>
      <!-- | logo -->

      <!-- Menu list -->
      <div class="top-menu-container">
        <el-menu
          cid="idp-header-menu"
          :default-active.sync="activeLink"
          mode="horizontal"
          @select="goto"
          :unique-opened="true"
          class="el-menu-demo idp-menu-item"
        >
          <template v-for="item in menuItems">
            <el-menu-item
              v-bind:key="item.id"
              :cid="'toolbar-' + item.label"
              :class="configSelectedClass"
              @click="renderChildMenus(item)"
              v-if="item.children && item.children.length > 0"
              :index="item.url ? item.url : item._id"
            >
              <span slot="title"
                ><i v-if="item.class" :class="item.class"></i
                >{{ item.label }}</span
              >
            </el-menu-item>

            <el-menu-item
              :cid="'toolbar-' + item.label"
              :index="item.url ? item.url : item._id"
              v-if="item.url"
            >
              <span slot="title"
                ><i v-if="item.class" :class="item.class"></i
                >{{ item.label }}</span
              >
            </el-menu-item>
          </template>
        </el-menu>
      </div>

      <!-- | Customer list  -->
      <div class="domain-wrap">
        <el-select
          filterable
          placeholder="Login with customer"
          v-model="customer_id"
          @change="onCustomerChange($event)"
        >
          <el-option
            v-for="customer in customers"
            :value="customer._id"
            :key="customer._id"
            :label="customer.customer_name"
          >
          </el-option>
        </el-select>
      </div>
      <!-- Profile menu -->
      <div class="avtar-wrap">
        <span>{{ getUserFullName() }}</span>
        <el-popover
          placement="bottom"
          popper-class="profile-container"
          trigger="click"
        >
          <avatar
            cid="idp-toobar-profile-menu"
            class="profile-avatar"
            slot="reference"
            :disablePopover="true"
            :username="getUserFullName()"
            :src="getUserAvatar()"
            :size="25"
          ></avatar>

          <div style="text-align: right; margin: 0">
            <el-button
              cid="idp-toobar-profile-profile"
              size="mini"
              type="text"
              @click="showProfile()"
              >Profile</el-button
            >
            <div style="text-align: right; margin: 0">
              <el-button
                size="mini"
                type="text"
                cid="idp-toobar-profile-logout"
                @click="logout()"
                >Logout</el-button
              >
            </div>
          </div>
        </el-popover>
      </div>
      <!-- | Avtar  -->
    </header>
  </div>
</template>

<script>
import _ from "lodash";
import MenuService from "@/services/MenuService";
import CustomerService from "@/idp/services/CustomerService";
import EventBus from "@/EventBus";
import Avatar from "@/idp/components/chat/components/Avatar.vue";
import Constants from "@/resources/Constants";
const defaultRoute = "/idp/train-requests";
const darkLogo= require('@/assets/images/logo-dark-theme.svg');
const lightLogo= require('@/assets/images/logo-ai.svg');


export default {
  name: "IdpAdminToolbar",
  data() {
    return {
      customers: [],
      customer_id: "",
      is_idp_admin: false,
      is_customer_selected: false,
      isImpersonate: false,
      showIdpCusomterButtons: true,
      menuItems: [],
      activeLink: "/idp",
    };
  },
  computed: {
    logoPath() {
      return this.$store.getters.selectedTheme === Constants.DOCEX.THEMES.DARK ? darkLogo : lightLogo;
    },
  },
  watch: {
    $route(to, from) {
      this.setMenu(to.path);
    },
  },
  methods: {
    goto(route, indexPath) {
      if (route.includes("assistance/test/")) {
        window.open(indexPath[0]);
        return;
      }
      if (route.charAt(0) === "/") {
        // let filter = this.getFilter();
        // delete filter["folderPath"];
        this.$router.push({
          path: "" + route,
          query: {},
        });
        // this.$emit("push-page", { page: index });
      }
    },
    async getCustomerData() {
      try {
        let customers = await CustomerService.find({
          $or: [{ _id: Constants.SYSTEM_CUSTOMER_ID }, { type: "IDP" }],
        });
        this.customers = _.sortBy(customers, "customer_name");
        const logInCustomerResponse = await CustomerService.getLogInCustomer();
        if (logInCustomerResponse.status) {
          this.customer_id = logInCustomerResponse.customerId;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async onCustomerChange(val) {
      const selectedCustomer = _.find(
        this.customers,
        (customer) => customer._id == val
      );
      localStorage.setItem("customer_name", selectedCustomer.customer_name);
      localStorage.setItem("customerName", selectedCustomer.customer_name);
      let params = { customer_id: this.customer_id };
      let response = await CustomerService.loginWithCustomer(params);

      this.$store.commit("setCustomerId", this.customer_id);
      this.$store.commit("setImpersonate", response.data.is_impersonate);

      let user = this.$store.getters.user;
      user["permitted_widgets"] = response.data.permitted_widgets || [];
      user["permitted_dashboard_pages"] = response.data.permitted_dashboard_pages || [];

      this.$store.commit("setUser", user);
      window.location.replace("/app/idp");
    },
    logout() {
      this.$store.commit("setUidefault");
      window.location.replace("/logout");
    },
    async showProfile() {
      this.$router.push({
        path: "/idp/user-profile",
        query: {},
      });
    },
    getUserFullName() {
      let user = this.$store.getters.user;
      return (user && user["full_name"]) || "";
    },
    getUserAvatar() {
      let user = this.$store.getters.user;
      return user && user["avatar"];
    },
    setMenu(path) {
      // if (path.includes("all-document-list")) {
      //   this.configSelectedClass = "";
      //   this.activeLink = "";
      //   return;
      // }   ..already written
      let isValidRoute = _.find(this.menuItems, {
        url: path,
      });
      if (!isValidRoute) {
        this.configSelectedClass =
          path == "/idp-admin-dashboard" ? "" : "is-active";
        return;
      }
      this.activeLink = isValidRoute.url;
      this.configSelectedClass = "";
    },
    renderChildMenus(item) {
      EventBus.$emit(
        "DISPLAY_IDP_NAVBAR",
        _.filter(item.children, { hidden: false }),
        defaultRoute
      );
    },
    async fetchMenus() {
      try {
        let menuItems = await MenuService.fetchMenus();
        EventBus.$emit("GET_MENUS", menuItems);
        this.menuItems = _.filter(menuItems, {
          hidden: false,
        });
        this.setMenu(this.$route.path);
      } catch (error) {
        console.log(error);
      }
    },
    initConfiguration() {
      this.fetchMenus();
      //   let user = this.$store.getters.user;

      //   this.isImpersonate = this.$store.getters.isImpersonate == true;

      //   this.is_idp_admin = user.roles.includes(
      //     Constants.DOCEX.ROLES_MAP.IDP_ADMIN
      //   )
      //     ? true
      //     : false;
    },
  },
  components: {
    Avatar
  },
  created() {},
  beforeDestroy() {},
  beforeMount() {},
  mounted() {
    this.initConfiguration();
    this.getCustomerData();
  },
};
</script>

<style lang="scss">
@import "../_idpVariables";

// new style theme
.idp-admin-toolbar {
  height: 2.457rem;
  background: var(--white);
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
  width: 100%;
  position: fixed;
  top: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: flex-end;
  z-index: 999;
  padding: 0 var(--space-sm);

  .logo {
    margin-left: 0;
    margin-right: 0;
    padding: var(--space-sm) var(--space-sm) var(--space-sm) var(--space-base);
    width: 14rem;
    clear: both;

    img {
      height: 100%;
      float: left;
    }
  }

  .avtar-wrap {
    color: var(--dark-02);
    margin-left: var(--space-base);
    margin-right: var(--space-base);
    padding: var(--space-xs) 0;

    .profile-avatar {
      cursor: pointer;
    }

    .avatar {
      vertical-align: middle;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      display: inline-block;
      margin-left: var(--space-sm);
    }

    span {
      display: inline-block;
      vertical-align: unset;
      color: var(--dark-03);
      font-size: var(--font-sm);
    }
  }

  // | logo

  .top-menu-container {
    margin-left: 1.4rem;
    margin-right: auto;

    .el-menu--horizontal {
      min-height: auto;
      box-sizing: border-box;
    }

    ul {
      list-style: none;
      height: 100%;
      margin: 0;
      padding: 0;
      width: auto;
      background: transparent;

      .el-menu-item.is-active {
        color: #4a5568;
        background-color: var(--dark-07);
        border-bottom: 0;
        // pointer-events: none;
      }
    }

    .idp-menu-item {
      display: inline-block;
      height: 100%;

      .el-menu-item {
        height: 100%;
        // padding-left: 8px;
        line-height: unset;
        font-size: inherit;

        span {
          i {
            margin-right: 8px;
            font-size: 16px;
          }

          font-size: var(--font-base);
          height: 100%;
          display: inline-block;
          display: flex;
          align-items: center;
        }
      }

      .el-menu-item:hover {
        background-color: var(--brand-09);
        color: var(--brand-03);
      }

      .el-menu-item.active {
        background-color: var(--brand-09) !important;
        color: var(--brand-03);
      }
    }
  }

  .domain-wrap {
    padding: var(--space-xs) 0;

    .el-input--suffix .el-input__inner {
      background-color: var(--dark-07);
      padding: 0 1.5rem 0 1rem;
      color: var(--dark-01);
      font-weight: 400;
      font-size: 0.857rem;
      cursor: pointer;
      border-radius: 6.25rem;
      border: 0;
      font-size: 0.857rem;
      height: 23px;
      outline: none;
      line-height: 40px;
    }
  }

  .upload-wrap {
    position: relative;
    overflow: hidden;
    display: inline-block;
    margin-left: var(--space-base);
    padding: var(--space-xs) 0;

    i {
      vertical-align: sub;
      font-size: var(--font-lg);
      margin-right: var(--space-xs);
      font-weight: 200;
    }

    .btn-upload {
      background-color: var(--dark-07);
      padding: 0 var(--space-lg) 0 var(--space-base);
      color: var(--dark-02);
      font-weight: 400;
      font-size: var(--font-sm);
      cursor: pointer;
      border-radius: var(--radius-round);
      border: 0;
      font-size: var(--font-sm);
      height: 100%;
      outline: none;
      line-height: 170%;
    }

    input[type="file"] {
      font-size: 120px;
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
    }
  }
}

// | header

.profile-container {
  min-width: 4rem !important;
  padding: 1px 4px 2px 1px !important;
  background: white !important;
}
</style>
