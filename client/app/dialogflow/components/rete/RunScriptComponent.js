import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import { TextControl } from "../../controls/textControl/TextControl.js";
import CustomNode from "../properties/CustomNode.vue"

export default class RunScriptComponent extends Rete.Component {
    
    constructor(iconClass){
      super('Run Script');
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
          .addOutput(new Rete.Output('key1', '', Socket.anyTypeSocket))
          .addOutput(new Rete.Output('key2', '', Socket.anyTypeSocket))
        }
    
    worker(node, inputs, outputs) {
      
    }
  }