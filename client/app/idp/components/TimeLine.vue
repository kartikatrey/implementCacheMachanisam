<template>
<div class="kp-body-scroll-timeline" v-bar="{ useScrollbarPseudo: true }">
 <Timeline
    :timeline-items="timelineItems"
    :message-when-no-items="messageWhenNoItems"
    :unique-year="true"/>
</div>
</template>

<script>
  import Timeline from 'timeline-vuejs'

export default {
  name: "TimeLine",
  components: {
    Timeline
  },
  props: ["data"],

  data: () => ({
    messageWhenNoItems: 'There are no logs',
    timelineItems: []
  }),
   beforeMount() {
    this.timelineItems=this.data
  }
};
</script>

<style>

.kp-body-scroll-timeline {
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    /* // padding-bottom: 60px; */
    box-sizing: border-box;
    padding-right: 10px;

   
  }
</style>

