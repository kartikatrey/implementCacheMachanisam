<template>  
<div class="grid-content bg-purple count-container">
 
         <div class="top-left-values">
            <div class="dashboard-section-label">
                {{label}}
            </div>
            <div class="users-count"> <span class="counter"> {{getCount}} </span></div>
      </div>          
</div>  
  
</template>
<script>
import AjaxService from "../../services/AjaxService";

export default {
  name: "CountTile",
  computed:{
    getCount(){
      let count =  this.count ? this.count : 0
      return count
         }

  },
  props: ["label","count"],
  data() {
    return {
        allowedUsers :''
  }
  },
 


 beforeMount() {
     
  }

}
</script>
<style lang="scss">
 .count-container {
    min-height: 100px !important;
    padding-top:10px;
    .users-count {
      margin-top: -12px;
    }
  .counter {
     color: #004c97 !important;
    font-size: 30px;
    font-weight: bold;
    padding-left: 16px;
    margin-top: 10px;
  }
  }


 </style>


