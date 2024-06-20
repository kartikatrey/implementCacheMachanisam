<template>
  <div class="idp-excel" >
      <div
        id="idp-excel"
        :style="{
          margin: '0px',
          padding: '0px',
          position: 'absolute',
          width: excelWidth,
          left: '0px',
          top: '30px',
          bottom: '0px'
        }
        "
      ></div>
    </div>
</template>
  <script>
  export default {
      name: 'IdpExcel',
      props: [
        "data",
        "width",
        "allowUpdate",
        "updateUrl",
        "loadUrl",
        "gridKey",
        "handleCellEditBefore",
        "showsheetbarConfig",
        "showtoolbarConfig",
        "cellRightClickConfig",
        "enableAddRow",
        "enableAddBackTop",
        "sortConfig",
        "sheetRightClickConfig"
      ],
      data(){
        return {
            excelWidth : '',
        }
      },
  
     watch: {
          "width": {
              handler: function (newVal, oldval) {
                  this.excelWidth = `${this.width}%`;
                  this.$nextTick(()=>{
                    window.luckysheet && window.luckysheet.resize()
                    this.$forceUpdate()
                  })
              },
              deep: true,
              immediate:true
          },
    },
  
      methods:{
       
          createExcel(){
            const that = this;
              window.luckysheet.create({
              container: "idp-excel",
              allowUpdate: this.allowUpdate,
              updateUrl: this.updateUrl,
              loadUrl : this.loadUrl,
              title:this.title,
              loading: {
                image:()=>{
                  return `<svg viewBox="25 25 50 50" class="circular">
                  <circle cx="50" cy="50" r="20" fill="none"></circle>
                  </svg>`
                },
                imageClass:"loadingAnimation"
              },
              lang: "en",
              userImage:"",
              showinfobar:false,
              plugins: ["chart"],
              gridKey:this.gridKey,
              showsheetbarConfig:this.showsheetbarConfig,
              sheetRightClickConfig:this.sheetRightClickConfig,
              showtoolbarConfig:this.showtoolbarConfig,
              cellRightClickConfig: this.cellRightClickConfig,
              enableAddRow: this.enableAddRow,
              enableAddBackTop: this.enableAddBackTop,
              sortConfig: this.sortConfig,
              hook:{
                rangeSelect:(sheet,selections)=>{
                  that.$emit('rangeSelect',sheet,selections)
                },
          
                // Should execute onMessage in websocket, Not present in current cdn version Need to build the code of luckysheet  
                cooperativeMessage:(data)=>{
                  that.$emit('cooperativeMessage',data)
                },
                //  Execute after cell render 
                cellRenderAfter(cell,position,sheet,ctx){
                  // that.$emit('cellRenderAfter',cell,position,sheet,ctx)
                },
                cellRenderBefore(cell,position,sheet,ctx){
                  if(that.handleCellRenderBefore){
                    const isRender = that.handleCellRenderBefore(cell,position,sheet,ctx)
                    return isRender;
                  }
                },
                cellEditBefore(selection){
                  if(that.handleCellEditBefore){
                    const isEdit = that.handleCellEditBefore(selection)
                    return isEdit;
                  }
                },

                // Handle sheet change event here
                sheetActivate: (sheetIndex) => {
                    that.$emit('sheetActivate', sheetIndex);
                }
              } 
            })
          
          }
      },
      mounted(){
          this.createExcel()
      },
      beforeDestroy() {
        window.luckysheet && window.luckysheet.destroy();
      }
  }
  </script>
  
  <style lang="scss">
  
    .loadingAnimation {
      width: 3em;
      height: 3em;
      animation: loading-rotate 2s linear infinite;
    }
  
    .loadingAnimation circle {
      animation: loading-dash 1.5s ease-in-out infinite;
      stroke-dasharray: 90, 150;
      stroke-dashoffset: 0;
      stroke-width: 2;
      stroke: currentColor;
      stroke-linecap: round;
    }
  </style>
  