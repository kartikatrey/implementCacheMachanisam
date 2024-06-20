import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import { TextControl } from "../../controls/textControl/TextControl.js";
import CustomNode from "../properties/CustomNode.vue"

export default class IDPStatusComponent extends Rete.Component {

    constructor(iconClass) {
        super('IDP Status');
        this.data.render = 'vue';
        this.data.component = CustomNode;
        this.data.props = { 
            iconClass: iconClass
         };
         this.task = {
            outputs: {},
        };
    }
    builder(node) {
        let chainedNode = node
                            .addControl(new IconControl(this.editor, this.data.props.iconClass, true))
                            .addInput(new Rete.Input('act', 'input', Socket.anyTypeSocket, true))
                            .addOutput(new Rete.Output('condition', 'Result', Socket.anyTypeSocket))

        // node.data && node.data.connections && _.each(node.data.connections, (con) => {
        //     if (con.name === 'key') { return; }
        //     chainedNode = chainedNode.addOutput(new Rete.Output(con.name, con.label, Socket.anyTypeSocket));
        // })
    }

    worker(node, inputs, data) {
        console.log('idp status event', node.id, data.tag_name);
    }
}