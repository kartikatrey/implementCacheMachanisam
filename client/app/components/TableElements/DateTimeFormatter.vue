<template>
<div :cid="'row-' + propData.column.field + '-'+ propData.index" style="width: auto">{{datetime}}</div>
</template>

<script>
import moment from "moment";
const inputDateFormat = "YYYY-MM-DD HH:mm Z";

export default {
    name: "DateTimeFormatter",
    props: ["propData"],
    watch: {

        'propData': {
            handler: function (newVal, oldval) {
                var fieldName = newVal.column.field;
                var fieldValue = newVal.row[fieldName];

                if (newVal.column["dateInputFormat"] == "unix") {
                    this.datetime = moment
                        .unix(fieldValue)
                        .utc()
                        .format("Do MMM YYYY");
                    return;
                }
                if(newVal.column.filterOptions && newVal.column.filterOptions.dateFormat){
                    this.outputDateFormat  = newVal.column.filterOptions.dateFormat;
                }
                var formattedDateTime = fieldValue ?
                    moment(fieldValue, inputDateFormat).format(this.outputDateFormat) :
                    "-";
                (formattedDateTime =
                    formattedDateTime == "Invalid date" ? "-" : formattedDateTime),
                (this.datetime = formattedDateTime);

            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            outputDateFormat: "Do MMM YYYY hh:mm A",
            datetime: null
        };
    },
    // created() {
    //     var fieldName = this.propData.column.field;
    //     var fieldValue = this.propData.row[fieldName];

    //     if (this.propData.column["dateInputFormat"] == "unix") {
    //         this.datetime = moment
    //             .unix(fieldValue)
    //             .utc()
    //             .format("Do MMM YYYY");
    //         return;
    //     }
    //     var formattedDateTime = fieldValue ?
    //         moment(fieldValue, inputDateFormat).format(outputDateFormat) :
    //         "NA";
    //     (formattedDateTime =
    //         formattedDateTime == "Invalid date" ? "NA" : formattedDateTime),
    //     (this.datetime = formattedDateTime);
    // }

};
</script>

<style lang="scss">
.el-picker-panel.el-date-picker.el-popper.has-time.calender-css{
        z-index: 9999 !important;
    }
</style>
