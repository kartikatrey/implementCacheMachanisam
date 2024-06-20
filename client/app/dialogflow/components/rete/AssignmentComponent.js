import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import CustomNode from "../properties/CustomNode.vue"
export default class AssignmentComponent extends Rete.Component {
    
    constructor(iconClass){
      super('Assignment');
      this.data.render = 'vue';
      this.data.component = CustomNode;
      this.data.props = { 
        iconClass: iconClass
      }; 
      this.task = {
        outputs: {condition:'option'}
      }
    }
    
    builder(node) {
      node
          .addControl(new IconControl(this.editor, this.data.props.iconClass, true))
          .addInput(new Rete.Input('act','input', Socket.anyTypeSocket,true))
          .addOutput(new Rete.Output('key', '', Socket.anyTypeSocket))
        }
    
    worker(node, inputs, outputs) {
      
    }
  }