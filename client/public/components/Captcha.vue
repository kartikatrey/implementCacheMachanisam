<template>
  <div id="captcha-div">
    <vue-recaptcha
      ref="recaptcha"
      @verify="onVerify"
      @expired="onExpired"
      :sitekey="sitekey"
    >
    </vue-recaptcha>
    <!-- <button @click="resetRecaptcha">Reset ReCAPTCHA</button> -->
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import AjaxService from '../services/AjaxService'
export default {
  name: "captcha",
  data() {
    return {
      sitekey: "6Leji5AUAAAAAP_HGN3o06c1A6vPH8Ex1XINKMxi"
    };
  },
  methods: {
    //Emit on reCAPTCHA verified response is the successful reCAPTCHA response
    onVerify: function(value) {
      this.$emit("captchaResponse", value)

    },
    //Emit on reCAPTCHA expired
    onExpired: function() {
      console.log("Expired");
      this.resetRecaptcha();
      this.$emit("captchaExpired");
    },
    //Reset reCAPTCHA instance
    resetRecaptcha() {
      this.$refs.recaptcha.reset(); // Direct call reset method
     }
  },
  components: {
    "vue-recaptcha": VueRecaptcha
  }
};
</script>

<style>
#captcha-div{
    /* margin-left: 36px; */
    padding-bottom: 0.5rem;
}
.rc-anchor-error-msg-container{
	  font-size:11px !important;
		padding:5px !important;
		font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', 'sans-serif' !important;
    color: #ff0000;
    font-weight: 400;
    left: 0;
    line-height: 14px;
    margin: 2px;
    position: absolute;
    top: 0
}

</style>