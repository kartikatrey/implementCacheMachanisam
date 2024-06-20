<template>
    <div class="otp">
        <v-otp-input
            ref="otpInput"
            input-classes="otp-input"
            separator=""
            :num-inputs="input"
            :should-auto-focus="true"
            :is-input-num="true"
            @on-change="handleOnChange"
            @on-complete="handleOnComplete"
        />
    </div>
</template>

<script>

export default {
  name: "OtpInputBoxes",
  props:["inputs"],//
    data() {
        return {
          input: this.inputs
        }
    },
    methods:{
      handleOnComplete(value) {
        this.$emit('passcode', value);
      },
      handleOnChange(value) {}
    },
}
</script>


<style>
  .otp{
    margin: auto;
    width:  215px;
    padding-bottom: 4px;
  }
  .otp-input {
    width: 24px;
    height: 28px;
    padding: 3px;
    margin: 0 2px;
    font-size: 20px;
    border-radius: 4px;
    border: 1px solid rgba(106, 109, 112, 0.877);
    text-align: center;
    &.error {
      border: 1px solid red !important;
    }
  }
  .otp-input::-webkit-inner-spin-button,
  .otp-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  
</style>