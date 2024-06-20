import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import { TextControl } from "../../controls/textControl/TextControl.js";
import CustomNode from "../properties/CustomNode.vue"
export default class EndWithMessageComponent extends Rete.Component {

  constructor(iconClass) {
    super('End With Message');
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
        .addInput(new Rete.Input('act', 'sendToBot', Socket.anyTypeSocket, true))
  }

  worker(node, inputs, outputs) {
    console.log('End Message event', node.id, inputs);
  }
}