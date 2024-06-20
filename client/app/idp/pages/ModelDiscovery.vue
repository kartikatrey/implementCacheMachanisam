<template>
<el-main class="kp-debug-view">
    <el-button class="backButton" cid="form-header-back" v-on:click="$router.push('/idp/document-setup-list')" icon="mdi mdi-arrow-left-circle-outline"></el-button>
    <h1 class="kp-page-title">{{pageTitle}} 
         <el-button class="btn-copy" type="primary"  @click= "copyCodeToClipBoard"> 
             <i class="mdi mdi-content-copy"></i> 
         </el-button>
    </h1>
     <div class="kp-json-wrap"  v-loading="loading">
      
       <div class="model-dis"><vue-json-pretty :data="modelDiscovery"></vue-json-pretty></div>

     </div>
   
</el-main>
</template>

<style lang="scss">
@import "../_idpGlobal";
.btn-copy {
    position: absolute;
    right: 5rem;
}

.model-dis {
    overflow: auto;
    height: 500px;
}

	.model-dis::-webkit-scrollbar-track {
		// -webkit-box-shadow: inset 0 0 6px var(--dark-05);
		background-color: var(--white);
	}

	.model-dis::-webkit-scrollbar {
		width: 6px;
		background-color: var(--white);
	}

	.model-dis::-webkit-scrollbar-thumb {
		background-color: var(--dark-05);
	}

    .textarea {
        display: none;
    }
.kp-json-wrap {
    position: relative;
     overflow: auto;
     margin-top:20px;
}

.kp-debug-view{
   margin-top: 20px;
        .vjs-tree.is-root  {
            overflow: auto;
            height: 76vh;
        }
}


.vjs-tree.is-root::-webkit-scrollbar {
    width: 7px;
    height: 20px;
    border-radius: 100px;
    position: relative;
}
.vjs-tree.is-root::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px #d0d0d0;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 100px;
}
.vjs-tree.is-root::-webkit-scrollbar-track {
    border-radius: 100px;
}
.vjs-tree.is-root::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
}

.backButton{
    padding: 0;
    border: 0;
    font-size: 1.9rem;
}
// .kp-json-wrap::-webkit-scrollbar {
//     width: 5px;
//     height: 5px;
//     border-radius: 100px;
//     position: relative;
// }
// .kp-json-wrap::-webkit-scrollbar-thumb {
//     border-radius: 10px;
//     -webkit-box-shadow: inset 0 0 6px #d0d0d0;
//     background-color: rgba(0, 0, 0, 0.5);
//     border-radius: 100px;
// }
// .kp-json-wrap::-webkit-scrollbar-track {
//     border-radius: 100px;
// }
// .kp-json-wrap::-webkit-scrollbar-thumb:hover {
//     background-color: rgba(0, 0, 0, 0.5);
// }


</style>

<script>
import VueJsonPretty from 'vue-json-pretty'
import CustomerService from "@/idp/services/CustomerService";
import 'vue-json-pretty/lib/styles.css';
import EventBus from "@/EventBus";
import _ from "lodash";
export default {
    name: "ModelDiscovery",
    components: {
        VueJsonPretty
        
    },
    data() {
        return {
            pageTitle: "Model Discovery View",
            modelDiscovery:'',
            loading: false,

        }
    },
    methods: {
        async init(){
            let customerConfigurationtion = await CustomerService.getCustomerConfiguration({selectColumns:['model_discovery']});
            this.modelDiscovery = _.get(customerConfigurationtion[0],'model_discovery')
            this.loading = false
        },
        copyCodeToClipBoard() {
        let textArea = document.createElement("textarea");
        textArea.textContent = JSON.stringify(this.modelDiscovery,null,2);
        document.body.append(textArea);
        textArea.select();
        document.execCommand("copy");
        this.notifySuccess("Copied to clipboard");
        
    }
    
},
    beforeMount() {
        this.$store.commit("setDisplayIdpTree",false);
        this.$store.commit("setDisplayIdpNavbar",false);
        this.loading = true
        this.init()       
    }
  
};
</script>
