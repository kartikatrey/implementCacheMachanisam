<template>
	<span>
		<i :class="'mdi ' + iconName" :style="customStyle" @click="handleIconClick"></i>
	</span>
</template>

<script>
import EventBus from "@/EventBus";
import _ from "lodash";

export default {
	name: "ActionIcon",
	props: ["data", "options"],
	computed:{
        iconName() {
            // Set default icon from the datatable for the icon column
            let iconName = this.options.defaultIcon;
            if(this.evalConditions){
                // If a custom icon is provided for the column, use it; otherwise, apply the default icon
                iconName = this.evalConditions.iconName;
            }
            // Return the determined icon name
            return iconName;
        },
        evalConditions(){
            // Get specified conditions for the column in the datatable
            const conditions = this.options.conditions;
            let matchedCondition = null;
            // Check if conditions are provided
            if(conditions){
                // Find the first condition that matches all filters
                matchedCondition = _.find(conditions, condition => {
                    if(condition){
                        // Check if all filters within the condition match the data row
                        // ex, filter: [{fname: "has_document", fvalue:true }, ....],
                        return condition.filter.every(filter => {
                            return this.data.row[filter.fname] === filter.fvalue;
                        });
                    }
                });
            }
            // Return the matched condition (if any)
            return matchedCondition;
        },
        customStyle(){
            // Get customize styling for the icons
            return _.get(this.evalConditions, "style") || {};
        }
	},
	methods: {
		handleIconClick() {
			EventBus.$emit(this.options.eventName, this.data["row"]);
		}
	}
};
</script>

<style lang="scss">

</style>
