import Rete from "rete";
import * as Socket from "../../sockets";
import { IconControl } from "../../controls/iconControl/IconControl.js";
import { TextControl } from "../../controls/textControl/TextControl.js";
import CustomNode from "../properties/CustomNode.vue"
export default class BotPromptComponent extends Rete.Component {

    constructor() {
        super('Bot Prompt');
        this.data.render = 'vue';
        this.data.component = CustomNode;
        this.data.props = { 
          iconClass: "mdi mdi-bug-outline"
        }; 
         this.task = {
            outputs: {},
        };
    }
    builder(node) {
        // node.data.connections = node.data.connections || [];
        // if (!_.filter(node.data.connections, (con) => con.name === 'defaultConnection').length) {
        //     node.data.connections.unshift({ name: "defaultConnection", label: "defaultConnection", script: "(function(){done(null,true);})()" })
        // }
        // let chainedNode = node
        // .addInput(new Rete.Input('act', 'input', Socket.anyTypeSocket, true));

        // node.data && node.data.connections && _.each(node.data.connections, (con) => {
        //     chainedNode = chainedNode.addOutput(new Rete.Output(con.name, con.label, Socket.anyTypeSocket));
        // })
        // var ctrl = new TextControl(this.editor, 'num', false, 'number');
      
        let tag_name=node.data.general ?((node.data.general.tag_name != "") ? node.data.general.tag_name : "name" ): "name"
        let chainedNode = node
                            .addControl(new IconControl(this.editor, "mdi mdi-album", true))
                            .addControl(new TextControl(this.editor,tag_name , true))
                            .addOutput(new Rete.Output('key', '', Socket.anyTypeSocket))
                            .addInput(new Rete.Input('act', 'input', Socket.anyTypeSocket, true));
        node.data && node.data.connections && _.each(node.data.connections, (con) => {
            if (con.name === 'key') { return; }
            chainedNode = chainedNode.addOutput(new Rete.Output(con.name, con.label, Socket.anyTypeSocket));
        })
    }

    worker(node, inputs, data) {
        console.log('Entity event', node.id, data.tag_name);
     
    }
}