<template>
<div style="width:180px">{{duration}}</div>
</template>

<script>
import moment from "moment";
import _ from "lodash"; 
export default {
    name: "Duration",
    props: ["data","options"],
    computed: {
        duration() { 
                if(!_.has(this.data, 'row')){return '';}        
                let startTime = this.data.row[this.options.start_time];
                let endTime = this.data.row[this.options.end_time];
                if(!(startTime && endTime)){return '';} 
                startTime = moment(startTime);
                endTime = moment(endTime);
		        let duration = moment.duration(endTime.diff(startTime));
		        const calculatedTime = duration.asSeconds();
		        return Math.abs(calculatedTime.toFixed())+'s';             
        }
    }
};
</script>

<style lang="scss">
</style>
