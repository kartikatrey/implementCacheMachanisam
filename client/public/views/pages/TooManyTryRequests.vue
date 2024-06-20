<template>
  <el-main class="kp-main">
   <!-- <section class="page-body"> -->
     <div class="no-access-wraper">
       <div class="graphic">
         <img src="../../assets/images/no-access-graphic.png" height="260px">
       </div>
           <div class="kanverse-branding">
             <span class="red">&nbsp;</span>
             <span class="green">&nbsp;</span>
             <span class="blue">&nbsp;</span>
           </div>
           <h2>We received your request for evaluating the light weight version. We have received a large number of requests and we are working on making the trial version available.
            <span>We will get back to you shortly.</span></h2>         
     </div>
   <!-- </section> -->
 </el-main>
</template>
 
 <script> 
 export default {
   name: "NoAccess",
   components: {
   },
   data() {
     return {
     };
   },
   methods: {
     hideLeftBar() {
       this.$store.commit("setDisplayIdpTree",false);
       this.$store.commit("setDisplayIdpNavbar",false);
     },
  
   },
   beforeDestroy() {
   },
   beforeMount() {
   },
 };
 </script>
 
 <style lang="scss">
 @import "../../../app/idp/_idpGlobal";
 @import "../../../app/idp/_idpVariables";
 .main {
  background: var(--white);
}
 .no-access-wraper {
  text-align: center;


    .kanverse-branding {
        position: relative;
        display: block;
        text-align: center;
        width: 100%;
        span {
          width: 8px;
          height: 8px;
          display: inline-block;
          border-radius: 100px;
          margin: 0 2px 0 0;
          display: inline-block;      
        }
        span.red {
          background: #FE2712;
        }
        span.green {
          background: #0147FE;
        }
        span.blue {
          background: #66B032;
        }
      } // branding

  .btn-upgrade {
    background: rgb(1,71,254) !important;
    background: linear-gradient(345deg, rgba(1,71,254,1) 0%, rgba(253,39,18,1) 100%) !important;
    color: var(--white) !important;
    font-weight: 500;
    border-radius: var(--radius-round) !important;
    margin: 2rem 0 0 0;
    padding: 1rem 3rem;
      i {
        font-size: 1.3rem;
      }
  }

    h1 {
          font-weight: 350;
          margin: 0 0 .7rem 0;
          font-size: var(--font-xxl);
          color: var(--dark-03);
            span {
              font-weight: 500;
            }

    }
    h2 {
      color: var(--dark-02);
      font-weight: 400;
      margin: 0 auto;
      width: 65%;
      font-size: var(--font-md);
        span {
            display: block;
            line-height: 2rem;
            font-weight: 400;
        }
    }
    .graphic {
      padding: 3rem 0 2rem 0;
        img {
            margin-right: 5rem;
        }
    }
}
 
 </style>