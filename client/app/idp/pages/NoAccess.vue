<template>
   <el-main class="kp-main">
    <section class="page-body">
      <div class="no-access-wraper">
        <div class="graphic">
          <img src="../../assets/images/no-access-graphic.png" height="260px">
        </div>
            <div class="kanverse-branding">
              <span class="red">&nbsp;</span>
              <span class="green">&nbsp;</span>
              <span class="blue">&nbsp;</span>
            </div>
        <h1>Do you wish to get <span> full access to Kanverse.ai features? </span> </h1>
        <h2>Please request for a demo, and a Kanverse expert will be on the way <br>to help you with that. </h2>
        <el-button class="btn-upgrade" v-on:click="upgradeNow" cid="no-access-upgrade-now">Upgrade Now</el-button>
      </div>
    </section>
  </el-main>
</template>

<script>
import EventBus from "@/EventBus";
import TryItService from "@/services/TryItService";

export default {
  name: "NoAccess",
  components: {
  },
  data() {
    return {
    };
  },
  methods: {
    upgradeNow(){
      console.log("Sending email for upgrade now..")     
      TryItService.requestDemo();
      this.notifySuccess("Thanks for requesting an upgrade. A Kanverse expert is on the way to contact you shortly.");            
    },
    hideLeftBar() {
      this.$store.commit("setDisplayIdpTree",false);
      this.$store.commit("setDisplayIdpNavbar",false);
    },
 
  },
  beforeDestroy() {
  },
  beforeMount() {
    const path =  this.$route.path;
    // if(path === '/idp/no-access-dashboard')
    //   this.hideLeftBar();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal.scss";
@import "../_idpVariables.scss";

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
      color: var(--dark-05);
      font-weight: 350;
      margin: 0;
    }
    .graphic {
      padding: 3rem 0 2rem 0;
        img {
            margin-right: 5rem;
        }
    }
}

</style>