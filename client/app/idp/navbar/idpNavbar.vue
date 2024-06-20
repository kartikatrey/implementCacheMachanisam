<template>
  <nav class="kp-nav">

     <div class="tree-container">
      <div class="search-container">
        <el-form @submit.native.prevent>
          <span class="mdi mdi-magnify search-icon"></span>
          <el-input
            v-model="menuSearch"
            type="text"
            placeholder="Search"
            name="search"
            size="mini"
            clearable
            cid="nav-bar-search-text"
          >
          </el-input>
          <el-tooltip effect="light" :content="toolTipText" placement="top">
            <el-button
              v-on:click="handleOrderChange"
              size="small"
              :type="buttonType"
              >
              <i class="mdi mdi-sort-ascending"></i>
            </el-button>
          </el-tooltip>
        </el-form>
      </div>
    </div>  

    <el-menu
          :default-active.sync="activeLink"
          mode="vertical"
          class="menu-container"
          @select="goto"
          cid="nav-bar-menu-list"
          :unique-opened="true"
          :class="{'nav-collapsed':collapseNavToggle}"
        >
        <div v-for="item in filteredMenu" :key="item.id" class="idp-menu-item">
          <el-menu-item :cid="'nav-bar-'+item.label" :index="item.url ? item.url: item._id" v-if="item.url">
              <i :class="item.class"></i>
              <span slot="title">{{item.label}}</span>
          </el-menu-item>
        </div>
     </el-menu>
  </nav>
</template>

<script>
import _ from 'lodash';
export default {
  props:["menus"],
  name: "IdpNavbar",
  data() {
    return {
      isIe: true,
      menuSearch:'',
      isEdge: true,
      activeLink: null,
      sortByOrder:false,
      buttonType:"default",
      toolTipText:"Sort by order disabled"
    };
  },
  watch:{
    $route (to, from){
      this.setLink(to.path);
    }
  },
  computed: {
    sortedMenu(){
          // If sortByOrder is true, sort child menu items by order; otherwise, sort by label in ascending order.
          if(this.sortByOrder){
            return _.sortBy(this.menus,['order'])
          }
          return _.sortBy(this.menus,['label'])  
    },
    filteredMenu(){
      if(!this.menuSearch)return this.sortedMenu;
      let result = _.filter(this.sortedMenu,(menu)=>{
        if(menu.label){ return menu.label.toLowerCase().includes(this.menuSearch.toLowerCase().trim()) }
      });
      return result;
    }
  },
  methods: {
    goto(index, indexPath) {
      if (index.charAt(0) === "/") {
        this.$router.push(index);
        this.$emit("push-page", { page: index });
      }
    },
    setMenu(path){
      // let isValidRoute = _.find(this.menus,{url:path});
      // if(!isValidRoute) path = '/idp/document-setup-list';
      this.activeLink = path;  
    },
    setLink(path) {
      // let isValidRoute = _.find(this.menus,{url:path});
      // if(!isValidRoute) path = '/idp/document-setup-list';
      this.activeLink = path;
    },
    collapseNavToggle() {
      this.$emit("collapse-nav-toggle");
    },
    pushPage(index, indexPath) {
      this.$emit("push-page", { page: index });
    },
    closeNav() {
      this.$emit("update:openSidebar", false);
    },
    handleOrderChange(){
      this.sortByOrder = !this.sortByOrder;
      localStorage.setItem("sort_by_order", this.sortByOrder);
      this.buttonType = this.sortByOrder? 'primary':'default';
      this.toolTipText = this.sortByOrder? "Sort by order enabled":"Sort by order disabled";
    },
    setMenuOrder(){
      const storedOrder = localStorage.getItem("sort_by_order");
      this.sortByOrder = storedOrder ? JSON.parse(storedOrder) : false;
      this.buttonType = this.sortByOrder? 'primary':'default';
      this.toolTipText = this.sortByOrder? "Sort by order enabled":"Sort by order disabled";
    }
  },
  components: {},
  created() {},
  mounted() {
    this.setLink(this.$route.path);
  },
  beforeDestroy() {
  },
  beforeMount() {
    // this.$router.push("/idp/document-setup-list");
    console.log("filteredMenu-------",this.filteredMenu)
    this.setMenuOrder();
  },
};
</script>

<style lang="scss" >
@import "../_idpVariables";

// KP Nav
  .kp-nav {
    background: var(--dark-08);
    width: 17rem;
    height: 100%;
    position: fixed;
    top: 0;
    // overflow: hidden;
    // overflow-y: auto;
    box-sizing: border-box;
    z-index: 9;
    .el-menu {
      background: var(--dark-08);
      padding: 0 var(--space-sm);
      // padding-top:  var(--space-xxxl);
    }
    .el-menu-item{
      background: var(--dark-08);
      height: 30px;
      line-height: 30px;
      color: var(--dark-03);
      font-size: var(--font-base);
      margin-bottom: var(--space-base);
      border-radius: var(--radius-base);
      padding: 0 var(--space-base) !important;
          i {
            font-size: 1.7rem;
            color: var(--dark-03);
            margin-right: .7rem;
            vertical-align: top;
            line-height: 30px;
          }
    }
    .el-menu-item.is-active {
      color: var(--dark-02);
      background: var(--dark-07);
    }
    .el-menu-item:hover {
      color: var(--brand-04);
      background: var(--white);
      i {
        color: var(--brand-04);
      }
    }
    .pinned {
      text-align: right;
      color: var(--dark-05);
      font-weight: 100;
      padding-top: var(--space-base);
      padding-right: var(--space-base);
        span {
          font-size: var(--font-sm);
          display: inline-block;
          margin-right: var(--space-xxs);
        }
    }
    .menu {
      padding: 0 var(--space-base);
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        li {
          padding-bottom: var(--space-xs);
          span {
            vertical-align: text-bottom;
            display: inline-block;
            margin-right: var(--space-sm);
            font-size: var(--font-lg);
            color: var(--dark-03);
          }
          a {
            text-decoration: none;
            color: var(--dark-03);
            font-size: var(--font-sm);
            
          }
        }
      }
    }

      .tree-container {
        border-top: var(--border-lg) solid var(--dark-07);
        // border-bottom: var(--border-lg) solid var(--dark-07);
        // margin-top: 1rem;
        padding: 4rem 1rem 1rem 1rem;
        // padding-right: 0.5rem;

        .search-container {
          position: relative;
          form {
            display: flex;
            align-items: center;
            gap: 5px;
            button {
              padding: 0px;
              padding-left: 0.55rem;
              padding-right: 0.5rem;
              height: 1.8rem;
              width: 2.167rem;
            }
            input {
              // border-radius: 0px;
              padding-left: 2rem;
            }
          }
          .search-icon {
            position: absolute;
            color: var(--dark-03);
            left: var(--space-sm);
            top: 0px;
            font-size: 18px;
            z-index:100;
          }
          input[type="text"] {
            font-size: var(--font-base);
            border: var(--border-base) solid var(--dark-06);
            padding-left: 2.4rem;
            background: var(--white);
            display: inline-block;
            height: 2.1rem;
            line-height:20px;
            border-radius: .3rem;
            color: var(--dark-02);
              &::placeholder {
                color: var(--dark-03);
                opacity: 1;
                font-size: var(--font-base);
              }
              &:focus {
                  border: 1.5px solid var(--brand-05);
              }
          }


          button {
            background: transparent;
            border: none;
            cursor: pointer;
            span {
              font-size: var(--font-lg);
              color: var(--dark-03);
            }
          }

          button.el-button.el-tooltip.el-button--default.el-button--small{
            background: var(--main-color);
            border: 0.0625rem solid #cbd5e0;
          }
          button.el-button.el-tooltip.el-button--primary.el-button--small{
            i{
              color: var(--white);
            }
          }

          .search-container button:hover {
            background: #eee6e6;
            color: var(--brand-03);
          }        
        }
    }

    .menu-container{
      overflow: hidden;
      overflow-y: auto;
      height: 86%;
    }

} // | Kp Nav

.menu-container::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px var(--dark-06);
  background-color: var(--white);
}

.menu-container::-webkit-scrollbar {
  width: 6px;
  background-color: var(--white);
}

.menu-container::-webkit-scrollbar-thumb {
  background-color: var(--dark-05);
}


</style>
