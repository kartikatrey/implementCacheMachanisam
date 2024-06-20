<template>
  <el-aside width="100%" style="overflow:hidden;">
    <!--  SideNav -->

    <el-row class="tac">
      <el-col :span="24">
        <el-menu
          :default-active.sync="activeLink"
          :mode="mode"
          @select="goto"
          :collapse="isCollapse"
          :unique-opened="true"
          :class="{'nav-collapsed':collapseNavToggle}"
        >
          <div v-for="item in menuItems" :key="item.id">
            <el-submenu
              v-if="item.children && item.children.length > 0"
              :index="item.url ? item.url: item._id"
              popper-class="main-navigation-submenu"
            >
              <template slot="title">
                <i :class="item.class"></i>
                <span>{{item.label}}</span>
              </template>
              <el-menu-item :index="childItem.url" v-for="childItem in item.children" :key="childItem.id">
                <span slot="title">{{childItem.label}}</span>
              </el-menu-item>
            </el-submenu>

            <el-menu-item :index="item.url ? item.url: item._id" v-if="item.url">
              <i :class="item.class"></i>
              <span slot="title">{{item.label}}</span>
            </el-menu-item>
          </div>
        </el-menu>
      </el-col>
    </el-row>
  </el-aside>
  <!--  SideNav Ends -->
</template>


<script>
import AjaxService from "../services/AjaxService";
import { detect } from "detect-browser";
import EventBus from "@/EventBus";

const browser = detect();

export default {
  name: "Nav",
  props: ["mode", "isCollapse"],
  data() {
    return {
      isIe: true,
      isEdge: true,
      activeLink: null,
      menuItems: []
    };
  },
  methods: {
    goto(index, indexPath) {
      if (index.includes("assistance/test/")) {
        window.open(indexPath[0]);
        return;
      }
      if (index.charAt(0) === "/") {
        this.$router.push(index);
        this.$emit("push-page", { page: index });
      }
    },
    setLink(path) {
      this.activeLink = path;
    },
    getMenu() {
      var url = "/portal/api/menuItems";
      AjaxService.getJson(url, {}, (error, response) => {
        this.menuItems =  _.filter(response.data,{hidden:false});
      });
    },
    collapseNavToggle() {
      this.$emit("collapse-nav-toggle");
    },
    pushPage(index, indexPath) {
      this.$emit("push-page", { page: index });
    },
    closeNav() {
      this.$emit("update:openSidebar", false);
    }
  },
  beforeMount() {
    EventBus.$on("update-menu", payload => {
      this.getMenu();
    });
  },
  beforeDestroy() {
    EventBus.$off("update-menu");
  },
  created() {
    if (browser.name !== "ie") this.isIe = false;
    if (browser.name !== "edge") this.isEdge = false;

    this.setLink(this.$router.currentRoute.path);
    this.$router.afterEach((to, from) => {
      this.setLink(this.$router.currentRoute.path);
      //console.log('afterEach', to, from)
    });
    //console.log('this.$router.currentRoute.path', this.$router.currentRoute.path)
  },
  mounted() {
    this.getMenu();
  }
};
</script>

<style lang="scss" scoped>
// @import "../assets/scss/_variables";

.el-menu {
  margin-top: 16px;
  border:0;
}

.is-active {
  background: #00a7e0;
  box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
  // margin: 0 10px;
  border-radius: 6px;
}

.el-menu-item:hover, .el-menu-item:focus {
  background: #00a7e0;
}

.el-menu-item.is-active {
  color: #ffffff;
}

.nav-collapsed {
  .sidebar {
    width: 74px;
  }
}
el-menu-item {
  font-weight: bold;
  color: #212121;
}

el-aside{
  overflow: hidden !important;
}
</style>
