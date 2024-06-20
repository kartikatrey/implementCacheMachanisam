import {
    Loading
} from "element-ui";

export default {
    // The install method will be called with the Vue constructor as the first argument, along with possible options
    install (Vue, options) {
      Vue.component('Loading')
      // ES6 way of const job = options.job
      Vue.prototype.$loadingInstance = null
      
      // Add $plugin instance method directly to Vue components
      Vue.prototype.$setLoader = (params) => { Vue.prototype.$loadingInstance  = Loading.service({...params})}
    
      Vue.prototype.$resetLoader = () => { 
          if(Vue.prototype.$loadingInstance ){
            Vue.prototype.$loadingInstance .close()
            Vue.prototype.$loadingInstance  = null
          }
    }
    }
  }
