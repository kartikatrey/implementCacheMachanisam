import "es6-promise/auto";
import Vue from "vue";
import Element from "element-ui";
import locale from "element-ui/lib/locale/lang/en";
import Vuebar from "vuebar";
import Fullscreen from "vue-fullscreen";
import VirtualList from "vue-virtual-scroll-list";
import VueGoodTable from "vue-good-table";
import VuePerfectScrollbar from "./components/vue-ps";
import Affix from "./directives/affix";
import App from "./App.vue";
import router from "./router/";
import store from "./store/store";
import JsonExcel from "vue-json-excel";
import VueScrollTo from "vue-scrollto";
import Notification from "./plugins/Notification";
import idpUserRoles from "./plugins/idpUserRoles";
import IdpConfig from "./plugins/IdpConfig";
import Tour from "./plugins/tour";
import JsonCSV from "vue-json-csv";
import vSelect from "vue-select";
import * as VueWindow from '@hscmap/vue-window'
import OtpInput from "@bachdgvn/vue-otp-input";

import "vue-select/dist/vue-select.css";
import "vue-good-table/dist/vue-good-table.css";
import "./assets/scss/global.scss";
import "flex.box";
import "animate.css";
import "@mdi/font/scss/materialdesignicons.scss";
import "vue-good-table/dist/vue-good-table.css";
import "./assets/scss/global.scss";
import "animate.css";
import 'timeline-vuejs/dist/timeline-vuejs.css'
import vClickOutside from "v-click-outside";
import {
	Loading
} from "element-ui";
import Loader from "./plugins/Loader.js";
import VueTour from 'vue-tour'
import VueKonva from 'vue-konva'
import VueYouTubeEmbed from 'vue-youtube-embed'
import VueDOMPurifyHTML from 'vue-dompurify-html'
import VTooltip from 'v-tooltip'
import VueFormulate from '@braid/vue-formulate'
import axios from 'axios'

const baseUrl = `${window.location.protocol}//${window.location.host}`;
const axiosInstance = axios.create({
	baseURL: baseUrl
})
  
Vue.use(VueFormulate, {
	uploader: axiosInstance,
	uploadUrl: '/form/upload'
})

Vue.use(VueDOMPurifyHTML, {default:{FORBID_TAGS: ['style']}})
Vue.use(VueYouTubeEmbed)
Vue.use(VTooltip)

// import 'echarts/lib/chart/line';
// import 'echarts/lib/component/title';
// import 'echarts/lib/component/legend';
// import 'echarts/lib/component/tooltip';
// import "echarts/lib/chart/pie";
// import 'echarts/lib/component/legendScroll';
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'

// import ECharts modules manually to reduce bundle size
import {
	CanvasRenderer
} from 'echarts/renderers'
import {
	BarChart,
	LineChart,
	GaugeChart,
	LinesChart
} from 'echarts/charts'
import {
	GridComponent,
	TooltipComponent
} from 'echarts/components'

import "echarts"
use([
	CanvasRenderer,
	BarChart,
	GridComponent,
	TooltipComponent,
	LineChart,
	GaugeChart
]);

// register globally (or you can do it locally)
Vue.component('v-chart', ECharts)
// import 'echarts/lib/chart/line'
import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'
import Button from 'vue-js-toggle-button'
import wysiwyg from "vue-wysiwyg";
import Constants from "@/resources/Constants";
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
if(process.env.NODE_ENV == "production"){
	const appInsights = new ApplicationInsights({ config: {connectionString:  Constants.PORTAL_APP_INSIGHTS_INSTRU_KEY}});
	appInsights.loadAppInsights();
}
const origin = window && window.location ? window.location.origin || "localhost:3000" : "localhost:3000"
Vue.use(new VueSocketIO({
	connection: SocketIO(origin, {transports: ['websocket']})
})
);


require('vue-tour/dist/vue-tour.css')
Vue.config.productionTip = false;
Vue.use(VueScrollTo, {
	container: "#service-container",
});
Vue.config.productionTip = false;
Vue.use(VueScrollTo, {
	container: "#container",
	duration: 500,
	easing: "ease",
	offset: -65,
	force: true,
	cancelable: true,
	onStart: false,
	onDone: false,
	onCancel: false,
	x: false,
	y: true
});
Vue.use(Button)
Vue.use(VueWindow)
Vue.use(Fullscreen);
Vue.use(Element, {
	locale
});
Vue.use(vClickOutside);
Vue.use(Loading)
Vue.use(Loader)
Vue.directive("affix", Affix);
Vue.use(Vuebar);
Vue.use(VueGoodTable);
Vue.use(Notification);
Vue.use(idpUserRoles);
Vue.use(IdpConfig);

Vue.use(VueTour)
Vue.use(Tour);

// Vue.component('v-chart', ECharts)
Vue.component("downloadCsv", JsonCSV);
Vue.component("downloadExcel", JsonExcel);
Vue.component("vue-scroll", VuePerfectScrollbar);
Vue.component("vue-virtual-list", VirtualList);
Vue.component("v-select", vSelect);
Vue.component("v-otp-input", OtpInput);

Vue.use(VueKonva)
Vue.use(wysiwyg, {
	hideModules: { "link": true },
})

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
