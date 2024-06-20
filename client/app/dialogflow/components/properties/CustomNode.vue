<template>
    <div class="node component" :class="[selected(), node.name] | kebab">
    <div class="top-strip"></div>
    <div class="node-wrapper" :title="node.name"> 
            <div class="icon" v-for="control in controls()" :key="control.key" v-control="control"></div>
            <!-- <div class="icon"> -->
                <!-- <i class="mdi mdi-email"></i> -->
            <!-- </div> -->
            <div class="output" v-for="output in outputs()" :key="output.key">
                <div class="output-title">
                 <span> {{output.name}} </span>
                 <div class="title-bg"></div>
                </div>
                <Socket v-socket:output="output" type="output" :socket="output.socket">
                 
                </Socket> 
            </div><!-- Controls--> <!-- Inputs-->
        
          <div class="input" v-for="input in inputs()" :key="input.key">
              <Socket id="node-socket" v-socket:input="input" type="input" :socket="input.socket"></Socket>
              <!-- <div class="input-title" v-show="!input.showControl()">{{input.name}}</div> -->
            <!-- <div class="input-control" v-show="input.showControl()" v-control="input.icon"></div> -->
          </div>
       
      </div>
          
  
    <div class="title">{{node.data.component_name}}</div><!-- title-->
</div>
</template>

<script>
import VueRenderPlugin from "rete-vue-render-plugin";
import _ from "lodash";
export default {
  name: "CustomNode",
  props: ["iconClass"],
  mixins: [VueRenderPlugin.mixin],
  components: {
    Socket: VueRenderPlugin.Socket
  }
};
</script>

<style  lang="scss">
@import "../../../idp/_idpGlobal.scss";


.socket.input {
  background: #03a8e0 !important;
  border: #ffffff solid 1px;
}
.node {
    background: var(--white)  !important;
    border: 1px solid var(--dark-06) !important;
    border-top:0px solid var(--dark-06) !important;
    border-radius: 0rem !important;
    min-height: 43px !important; 
    height: auto !important;
    padding-bottom: 6px !important; 
    box-sizing: content-box !important;
     position: relative;
         width: 60px;
          .top-strip {
            width: 102%;
            display: block;
            height: 2px;
            background: var(--dark-06);
            top: 0;
          }
}

  .output{
      text-align: right;
      display: block;
      // position: relative;
         .output-title {
              left: 73px;
              font-size: .8rem;
              text-align: left;
              top: 5px;
              background: #fff;
              padding: 0 .3rem;
              color: var(--dark-04);
              height: 0px;
              position: relative;
                span {
                  position: absolute; 
                  z-index:99;
                }
                .title-bg {
                  background:#fff; 
                  height:3px; 
                  width:35px; 
                  position:absolute; 
                  z-index:9; 
                  top:7px;
                  left: 0;
                }
        }
        // .output-title::before{
        //   content: "";
        //                   background-color: yellow;
        //                   height: 10px;
        //                   width: 100px;
                      
        // }
  }
  
.node .icon {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    // left: 0 !important;
    display: block !important;
    width: 100% !important;
    // top: 0 !important;
    text-align: center !important;
    padding: 2px 0 0 0 !important;
    position: absolute !important;
        i {
          font-size: 2.7rem;
          color: var(--brand-05);
        }
   
}
.node .title {
    color: var(--dark-04) !important;
    font-family: sans-serif !important;
    font-size: 1.2rem !important;
    text-align: center !important;
    font-size: var(--font-base) !important;

    padding: 0 var(--space-lg);
    box-sizing: border-box;

    position: absolute !important;
    bottom: -1.85rem;
    padding: 0;
    // width: 100px !important;
     white-space: nowrap;
}

// .node .output-title {
//   color: #868686 !important;
//   font-family: sans-serif !important;
//   font-size: 12px;
//   font-style: Italic;
// }
// .node .input-title {
//   color: #868686 !important;
//   font-family: sans-serif !important;
//   font-size: 12px;
//   font-style: Italic;
// }

.node .icon + .icon {
  position: absolute;
  word-break: break-all;
  top: 25px !important;
  left: 25px !important;
}
// .socket[data-v-2de054d6] {
//   border: 0 !important;
//   margin: 0 !important;
//   width: 10px !important;
//   height: 34px !important;
//   background: transparent !important;
//   border-radius: 0 !important;
//   position: absolute !important;
// }

.socket[data-v-2de054d6]:hover {
      border-width: 2px !important;
}
.socket[data-v-2de054d6] {
  border: 0 !important;
 
    margin: 0 !important;
}
// .output {
//    i {
//             position: absolute;
//           font-size: 2em;
//           top: -8px;
//           right: -15px;
//       }
// }
.socket.output { 
    width: 10px !important;
    height: 10px !important;
     background: transparent !important;
    border-radius: 0 !important;
    width: 0 !important; 
    height: 0 !important; 
    border-top: 8px solid transparent !important;
    border-bottom: 8px solid transparent !important;
  
    border-left: 8px solid var(--dark-06) !important;
    margin-top: 4px !important;
    margin-right: -9px !important;
      &:hover {
         border-left: 8px solid var(--green-06) !important;
          border-top: 8px solid transparent !important;
        border-bottom: 8px solid transparent !important;
        transform: scale(1.5);
      }
    
}


.socket.input {
    width: 10px !important;
    height: 10px !important;
    background: var(--dark-06) !important;
    border: 0 !important;
    margin-left: -6px !important;
      &:hover {
        border: 2px solid var(--green-06) !important;
        background: var(--green-06) !important;
         transform: scale(1.5);
      }
}
.connection {
  overflow: visible !important;
  width: auto !important;
  height: unset;
  position: absolute;
  z-index: -1;
}
// .node-editor .connection .main-path {
//     stroke-width: 2px !important;
//     stroke: red !important;
// }


button.compile {
  z-index: 5;
  position: absolute;
  top: 10px;
  left: 10px;
}
// .node{
//   background: var(--dark-07) !important;
//   border: 2px solid #4e58bf;
//   border-radius: 3px;
//   cursor: pointer;
//   min-width: 180px;
//   height: auto;
//   padding-bottom: 6px;
//   box-sizing: content-box;
//   position: relative;
//   user-select: none;
//   // &:hover{
//   //   background: lighten($node-color,4%)
//   // }  
//   // &.selected{
//   //   background: $node-color-selected
//   //   border-color: #e3c000
//   // }  
//   .title{
//     color: white;
//     font-family: sans-serif;
//     font-size: 18px;
//     padding: 8px;
//   }  

//   .input{
//     text-align: left;
//   }  

// .socket{
//     text-align: left;
//   } 

  // .socket.output{
  //    border-top: 14px solid transparent !important;
  //   border-bottom: 14px solid transparent !important;
  //   border-left: 14px solid #b6c0b6 !important;
  // } 
 
  // .input-title,.output-title{
  //   vertical-align: middle
  //   color: white
  //   display: inline-block
  //   font-family: sans-serif
  //   font-size: 14px
  //   margin: $socket-margin
  //   line-height: $socket-size
  // }  
  // .input-control{
  //   z-index: 1
  //   width: calc(100% - #{$socket-size + 2*$socket-margin})
  //   vertical-align: middle
  //   display: inline-block
  // }  
  // .control{
  //   padding: $socket-margin $socket-size/2 + $socket-margin
  // }  
//}

  
</style>
