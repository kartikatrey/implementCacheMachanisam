import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import { TextControl } from "../../controls/textControl/TextControl.js";
import CustomNode from "../properties/CustomNode.vue"
export default class ConditionComponent extends Rete.Component {

  constructor(iconClass) {
    super('Condition');
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
    let chainedNode = node
      .addControl(new IconControl(this.editor, this.data.props.iconClass, true))
      .addInput(new Rete.Input('act', 'input', Socket.anyTypeSocket))
       node.data && node.data.connections && _.each(node.data.connections, (con) => {
            chainedNode = chainedNode.addOutput(new Rete.Output(con.name, con.label, Socket.anyTypeSocket));
        })
  }

  worker(node, inputs, outputs) {
    console.log('Condition event');
  }
}