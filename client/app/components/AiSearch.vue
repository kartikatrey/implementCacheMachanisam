<template>
	<div class="search-container-ai">
          <span class="mdi mdi-magnify search-icon"  id="search-btn"></span>
          <el-input 
            v-model="contentSearchText"
            type="text" 
            placeholder="Search for any Business Rule..." 
            name="Search" 
            size="mini" 
            clearable 
            :disabled="isSearching"
            @keyup.enter.native.prevent="aiSearch()"
            @clear="aiSearch()"
            cid="nav-bar-search-text">
          </el-input>
          <el-tooltip v-if="showToggle" effect="light" :content="toolTipText" placement="top">
            <el-button
              v-on:click="handleSearchBy"
              size="small"
              :type="buttonType"
              class="code-tag-btn"
              >
              <i class="mdi mdi-xml"></i>
            </el-button>
          </el-tooltip>
      </div>
</template>

<script>
import AiSearchService from "../services/AiSearchService";
import EventBus from "@/EventBus";


export default {
	name: "AiSEarch",
	props: ["searchText","searchColumn","collectionType","toggleSearchColumn","showToggle"],
	data() {
		return {
            contentSearchText: "",
            searchToggle: false,
            buttonType :'default',
            toolTipText: 'Search only by code disabled',
            isLoading: false,
            isSearching: false

        };
	},
    methods:{
        async aiSearch(){
            if(this.contentSearchText){
                this.isSearching = true; 
                let params = {'searchText': this.contentSearchText,
                'searchBy': this.searchToggle ? this.toggleSearchColumn : this.searchColumn,
                'collectionType' : this.collectionType}
                this.$setLoader({
                    target: "#search-btn",
                    spinner: "el-icon-loading",
                });                
                let res = await AiSearchService.getAiSearchData(params)
                .catch((e) => {
                console.log("Error occured while searching::",e)
                });
                if (res) {
                    EventBus.$emit('dataChanged',this.contentSearchText,res);
                }}
                else{
                    EventBus.$emit('dataChanged','',[]);
                }
                this.$resetLoader();
                this.isSearching = false;
        },
       
        handleSearchBy(){
            this.searchToggle = !this.searchToggle;
            this.buttonType = this.searchToggle? 'primary':'default';
            this.toolTipText = this.searchToggle? "Search only by code enabled":"Search only by code disabled";
        },
    },
    beforeMount(){
        this.contentSearchText = this.searchText
    }
};
</script>

<style lang="scss">
.search-container-ai {
  position: relative;
  margin-bottom: 1rem;

  button {
    padding: 14px;
    height: 1.8rem;
    width: 2.167rem;
  }

    input {
      padding-left: 2rem;
    }

  .search-icon {
    position: absolute;
    color: var(--dark-04-5);
    left: var(--space-sm);
    top: 7px;
    font-size: 18px;
    z-index: 100;
  }

  input[type="text"] {
    font-size: var(--font-base);
    border: var(--border-base) solid var(--dark-06);
    padding-left: 2.4rem;
    background: var(--white);
    display: inline-block;
    height: 3.15rem;
    line-height: 20px;
    border-radius: .3rem;
    color: var(--dark-02);

    &::placeholder {
      color: var(--dark-04-5);
      opacity: 1;
      font-size: var(--font-base);
    }

    &:focus {
      border: 1.5px solid var(--brand-05);
      background: rgb(237, 242, 247);
    }
    &:hover {
      background: rgb(237, 242, 247);
    }
  }

  span {
    font-size: var(--font-lg);
  }

  .el-button{
    position: absolute;
    right: 4px;
    top: 3px;
    font-size: 18px;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: var(--space-xxs);

  }
  .el-input--suffix .el-input__inner{
    padding-right: 5rem;
  }
  .el-icon-circle-close{
    position: absolute;
    right: 4.5rem;
  }

  .code-tag-btn.el-button--default{
    background: transparent;
    border: none;

    i{
      color: #8d99ab;
    }
  }

  .code-tag-btn.el-button--default:hover{
    background: rgb(237, 242, 247);
  }

  .code-tag-btn{
    border: none;
    
    i {
      font-size: 20px;
    }
  }
}
</style>
