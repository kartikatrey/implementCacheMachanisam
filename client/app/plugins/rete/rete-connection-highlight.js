/*!
* Name: rete-connection-highlight-plugin 
* Purpose: Highlights the node and connection color based on condition
*/
import constants from "../../resources/Constants";

function insertStyle(css) {
    if (!css) {
        return;
    }
    if (typeof window === 'undefined') {
        return;
    }

    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.innerHTML = css;
    document.head.appendChild(style);
    return css;
}

function install(editor, params) {
    const processedNodes = params.processed_nodes;
    const nodeContexts = params.node_contexts;
    let suspendedNodes = [];
    let failedNodes = [];

    for(const node in nodeContexts){
        const nodeData = nodeContexts[node];
        // Push the node_ids based on their status
        const nodeId = nodeData && nodeData.data && nodeData.data.node_id
        if(nodeData.status == constants.WORKFLOW.STATUS.SUSPENDED){
            suspendedNodes.push(nodeId);
        } else if (nodeData.status == constants.WORKFLOW.STATUS.FAILED || nodeData.status == constants.WORKFLOW.STATUS.CANCELLED){
            failedNodes.push(nodeId);
        }
    }

    editor.on('renderconnection', (_ref2) => {
        let el = _ref2.el;
        let path = el.querySelector("path");

        // if input and output node id of a connection exists in processed node ids, change connection color
        const inputNodeId = _ref2.connection && _ref2.connection.input && _ref2.connection.input.node && _ref2.connection.input.node.id;
        const outputNodeId = _ref2.connection && _ref2.connection.output && _ref2.connection.output.node && _ref2.connection.output.node.id;
        const nodeIds = [inputNodeId, outputNodeId];

        // Highlight the intermediate connecting lines of each node
        if (nodeIds.every(
            nodeId => 
                processedNodes.includes(nodeId) || 
                suspendedNodes.includes(nodeId) || 
                failedNodes.includes(nodeId)
        )) {
            path.classList.add('highlight');
        } else {
            path.classList.add('main-path');
        }    
    });

    editor.on("rendernode", ({ el, node }) => {
		const div = el.querySelector("div.icon");

		// Assign the class to the nodes based on their status. i.e., Processed/Suspended/Failed
		div.classList.add(
            processedNodes.includes(node.id) ? "processed-highlight-node" :
            suspendedNodes.includes(node.id) ? "suspended-highlight-node" :
            failedNodes.includes(node.id) ? "failed-highlight-node" :
            "main-node"
        );
	});
}

insertStyle(`
    .connection {
        overflow: visible !important;
        width: 1px;
        height: 1px;
        position: absolute;
        z-index: -1; 
    }
    
    .connection .main-path {
        fill: none;  
        stroke-width: 1px;
        stroke: #bbc1c7; 
    }
    
    .connection .highlight {
        fill: none;
        stroke-width: 1.8px;
        stroke: #13CE66; 
    }

    .workflow-editor-container {
        .node {
            
            .main-node {
                background-color: transparent; 
            }

            .processed-highlight-node {
                background-color: #90ee90; 
                border: 1px solid #13CE66;
            }

            .suspended-highlight-node {
                background-color: #e7dc7b; 
                border: 1px solid #CEBB13;
            }

            .failed-highlight-node {
                background-color: #FFA6A6; 
                border: 1px solid #cd5151;
            }
        }
    }

`);
export default { install }