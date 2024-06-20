import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import { TextControl } from "../../controls/textControl/TextControl.js";
import CustomNode from "../properties/CustomNode.vue"

export default class KnowledgeBaseComponent extends Rete.Component {

    constructor() {
        super('Knowledge Base');
        this.data.render = 'vue';
        this.data.component = CustomNode;
         this.task = {
            outputs: {},
        };
    }
    builder(node) {
        let chainedNode = node
			.addControl(new IconControl(this.editor, "mdi mdi-file-document-box", true))
			.addInput(new Rete.Input('act', 'input', Socket.anyTypeSocket, true));
			//.addOutput(new Rete.Output('yes', 'Solved', Socket.anyTypeSocket));
			//chainedNode = chainedNode.addOutput(new Rete.Output('no', 'Not solved', Socket.anyTypeSocket));

			node.data && node.data.connections && _.each(node.data.connections, (con) => {
				if (con.name === 'key') { return; }
				chainedNode = chainedNode.addOutput(new Rete.Output(con.name, con.label, Socket.anyTypeSocket));
			})

		}

    worker(node, inputs, data) {


    }
}
