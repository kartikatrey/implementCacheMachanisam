import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import CustomNode from "../properties/CustomNode.vue"


 export default class BeginComponent extends Rete.Component { 
    constructor(iconClass) {
      super("Begin");
      this.data.render = 'vue';
      this.data.component = CustomNode;
      this.data.props = { 
        iconClass: iconClass
      }; 
      this.task = {
        outputs: { act: "option" },
        init(task) {
      }
      };
    }
  
    builder(node) {
        node
        .addControl(new IconControl(this.editor, this.data.props.iconClass, true))
        .addOutput(new Rete.Output("act", "Action",  Socket.anyTypeSocket));
}
  
    worker(node, inputs, msg) {
      console.log('Begin event');
    }
  }