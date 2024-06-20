import Rete from "rete";

import VueIconControl from "./IconControl.vue";

    export class IconControl extends Rete.Control {
        constructor(emitter, key, readonly) {
          super(key);
          this.props = { emitter, ikey: key, readonly };
          this.component = VueIconControl;        
        }
      
        setValue(val) {
          this.vueContext.value = val;
        }
      }
      
    