import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import { TextControl } from "../../controls/textControl/TextControl.js";
import CustomNode from "../properties/CustomNode.vue"
export default class LLMExtractionComponent extends Rete.Component {

  constructor(iconClass) {
    super('LLM Extraction');
    this.data.render = 'vue';
    this.data.component = CustomNode;
    this.data.props = { 
      iconClass: iconClass
    }; 
    this.task = {
      outputs: { condition: 'option' }
    }
  }

  builder(node) {
    node
        .addControl(new IconControl(this.editor, this.data.props.iconClass, true))
        .addInput(new Rete.Input('act', 'Input', Socket.anyTypeSocket, true))
        .addOutput(new Rete.Output('condition', 'Result', Socket.anyTypeSocket))
        
  }

  worker(node, inputs, outputs) {
    console.log('Idp LLM Extraction Event', node.id, inputs);
  }
}