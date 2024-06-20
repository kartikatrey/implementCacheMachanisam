import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import { TextControl } from "../../controls/textControl/TextControl.js";
import CustomNode from "../properties/CustomNode.vue"

export default class WorkflowComponent extends Rete.Component {
    
    constructor(iconClass){
      super('WorkFlow');
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
        let workflow_name=node.data.workflow_name ? node.data.workflow_name :'name'
        
      node
          .addControl(new IconControl(this.editor, "mdi mdi-lan", true))
          .addControl(new TextControl(this.editor,workflow_name , true))
          
          .addInput(new Rete.Input('act','input', Socket.anyTypeSocket,true))
        //   .addOutput(new Rete.Output('condition', 'condition', Socket.anyTypeSocket))
    }
    
    worker(node, inputs, outputs) {
      
    }
  }