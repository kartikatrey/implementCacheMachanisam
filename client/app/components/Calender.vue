<template>
  <div class="kp-form-input-1 kp-form-field">
			<el-collapse>
				<el-date-picker
        popper-class="calender-css"
					v-model="inputValue"
					:type="inputType"
					:placeholder="placeholder"
          :range-separator='rangeSeperator'
          format="yyyy-MM-dd">          
			  </el-date-picker>
			</el-collapse>
		</div>
</template>

<script>
import { DatePicker } from "element-ui";
export default {
  name: "Calender",
  components: {
    ElDatePicker: DatePicker
  },

  props: ["value", "type", "rangeSeparator","placeholder"],
  data() {
    return {
      inputValue: this.value,
      inputType: this.type,
      rangeSeperator: this.rangeSeparator || "-"
    };
  },
  watch: {
    inputValue(val) {
      this.$emit("input", val);
    },
    value(val, oldval) {
      this.inputValue = val;
    }
  },
  methods: {
  }
};
</script>
<style lang="scss">
//calender date time range
.el-date-range-picker {
  z-index: 99999 !important;
    .el-time-panel {
      left: -50px !important;
    }
}
.calender-css{
.el-popper {
    max-height: 500%;
    overflow-x: hidden;
	overflow-y: auto;
	
}
}
.el-time-panel{
	text-align: center;
	padding: inherit;
	width: -webkit-fill-available;
	margin:5px;
}
.el-range-editor.el-input__inner{
	background-color: #f5f6fa;
}
.el-range-editor .el-range-input{
	font-size: 10px !important;
}
.el-date-editor .el-range-separator {
	line-height: 22px !important;
  font-size: 11px !important;
  width: 26px !important;
  padding: 0 !important;
}
.el-date-editor .el-range__close-icon{
	line-height: 1px !important;
}
.el-icon-time::before,.el-icon-time::after
{
	line-height: 28px;
}
// calender datetime range end

//calender date time
.el-input__icon {
  line-height:31px;
}

</style>