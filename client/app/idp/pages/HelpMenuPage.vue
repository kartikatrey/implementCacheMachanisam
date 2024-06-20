<template>
  <el-main class="kp-main full-main">
    <p class="helppage-title">Kanverse IDP Training Videos</p>
    <div v-if="responseData" class="align-input">
      <el-input
        v-model="input"
        type="text"
        placeholder="Search in Kanverse help videos.."
        name="search"
        size="mini"
        clearable
        cid="search-text"
        class="search-help"
      >
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <section v-if="responseSuccess" class="page-body help-body" v-loading="loader">
      <div class="help-div">
        <el-row :gutter="20">
          <el-col
            v-for="(item ) in filteredList"
            :key="item.id"
            :span="24"
          >
            <el-card class="help-card" shadow="never" :span="24">
              <div style="display: flex">
                <div class="thumbnail">
                  <youtube  :label="item.id" :playsinline="true" :video-id="item.video_id"></youtube>
                </div>
                <div class="details">
                  <p class="video-title">
                    <b>{{ item.title }}</b>
                  </p>
                  <p class="video-desc">
                    {{ item.desc }}
                  </p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </section>
    <p v-else class="error-title" v-loading="loader">
      Something went wrong while getting Kanverse IDP training videos.Try again later.
    </p>
  </el-main>
</template>

<script >
import _ from "lodash";
import { getIdFromURL, getTimeFromURL } from 'vue-youtube-embed'
import HelpMenuService from "@/idp/services/HelpMenuService";
import EventBus from "@/EventBus";
export default {
  name:"HelpMenuPage",
  data() {
    return {
      currentDate: new Date(),
      playerOptions: [],
      responseData: null,
      input: "",
      loader: false,
      responseSuccess:false,
      videoID:[],
      
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
    filteredList() {
      return this.videoID.filter((data) => {
        return (
          data.title.toLowerCase().includes(this.input.toLowerCase()) ||
          data.desc.toLowerCase().includes(this.input.toLowerCase())
        );
      });
    },
  },
  methods: {
    async getVideoData() {
      this.loader = true;
      try{
      const response = await HelpMenuService.getHelpVideos()
      this.responseData = JSON.parse(response.data);  
      this.responseSuccess=true;
      this.loader = false;
      for (const data of this.responseData){
        let videoContent = {
          video_id:getIdFromURL(data.link),
          title: data.title,
          desc: data.description,
        }
        this.videoID.push(videoContent)
      }
      }
      catch(err)
      {
        this.notifyError(err);
      }
    },
  },
  beforeMount() {
    this.$store.commit("setDisplayIdpTree",false);
    this.$store.commit("setDisplayIdpNavbar",false);
    this.getVideoData();
  },
};
</script>

<style lang="scss">
@import "../_idpGlobal";
@import "./../_idpVariables";
.kp-main.full-main {
  padding-left: 0;
  padding-right: 0;
}
.search-help {
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
}
.help-div {
  padding-top: 25px;
  width: 60%;
  margin: 0 auto;
}
.page-body.help-body {
  width: 100%;
  background: var(--brand-09-5);
}
.helppage-title {
  display: block;
  font-size: var(--font-xxl);
  text-align: center;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(45deg, #fe2712, #0147fe, #66b032);
}
.error-title {
  display: block;
  font-size: var(--font-xl);
  text-align: center;
}
.video-title {
  color: var(--dark-02);
  font-size: var(--font-lg);
}
.video-desc {
  color: var(--dark-04);
  font-size: var(--font-md);
}
.video-js.vjs-fluid,
.video-js.vjs-16-9,
.video-js.vjs-4-3 {
  width: 300px;
}
.align-input {
  width: 300px;
  margin: 0 auto;
  display: block;
  padding-bottom: 20px;
}
.el-card__body {
  padding: 5px;
}
.help-card {
  border: 0;
  box-shadow: none;
  background: transparent;
  padding-top: 10px;
  padding-bottom: 10px;
    .thumbnail {
      iframe {
        width: auto;
        height: 190px;
        border-radius: var(--radius-sm);
      }
    }
}
.details {
  padding-left: 20px;
  padding-right: 20px;
}
.video-js .vjs-big-play-button {
  display: none;
}
.video-js *,
.video-js *:before,
.video-js *:after {
  width: fit-content;
}
</style>

