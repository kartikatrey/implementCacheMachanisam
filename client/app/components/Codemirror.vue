<template>
  <div class="codemirror-container">

      <!-- <span class="kp-full-indicator"><i class="mdi mdi-help-box"></i>Press f11 for full screen</span> -->
    <codemirror
      v-model="inputValue"
      :options="cmOptions"
      :placeholder="placeholder"
      @blur="onBlur"
    ></codemirror>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";

// language
import "codemirror/mode/javascript/javascript.js";
// theme css
import "codemirror/theme/monokai.css";
import "codemirror/lib/codemirror.css";

// require active-line.js
import "codemirror/addon/selection/active-line.js";
// styleSelectedText
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";
// hint
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";

// lint
import "codemirror/addon/lint/lint.js";
import "codemirror/addon/lint/lint.css";
import "codemirror/addon/lint/javascript-lint.js";
// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";
// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";

import "codemirror/addon/display/autorefresh.js";
import "codemirror/addon/display/fullscreen.js";
import "codemirror/addon/display/placeholder.js"
import lodash from "lodash";
import { JSHINT } from 'jshint';	
window.JSHINT = JSHINT	

export default {
  name: "Codemirror",
  components: { codemirror },
  props: ["value", "options","placeholder"],
  data() {
    return {
      inputValue: this.value,
      cmOptions: {
        tabSize: 4,
        styleActiveLine: false,
        lineNumbers: true,
        styleSelectedText: false,
        line: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter","CodeMirror-lint-markers"],
        lint:true,
        highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
        mode: "text/javascript",
        hintOptions: {
          completeSingle: false
        },
        keyMap: "sublime",
        matchBrackets: true,
        showCursorWhenSelecting: true,
        theme: "default",
        autoRefresh: true,
        extraKeys: {
          Ctrl: "autocomplete",
          F11: function(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
          },
          Esc: function(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
          }
        }
      }
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
    handleInput() {
      this.$emit(" ", this.value);
    },
    setOptions() {
      this.cmOptions = lodash.defaultsDeep(this.options, this.cmOptions);
    },

    onBlur() {
      this.$emit("onBlur", this.inputValue);
    }
  },
  mounted() {
    this.setOptions();
  },
  beforeMount() {
    this.inputValue = this.value;
  }
};
</script>

<style  lang="scss">
.CodeMirror-focused .cm-matchhighlight {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
  background-position: bottom;
  background-repeat: repeat-x;
}
.CodeMirror-selection-highlight-scrollbar {
  background-color: #bdc3c7;
}
.CodeMirror-fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  height: 100% !important;
  z-index: 99999 !important;
  width:100% !important;
}
.CodeMirror { border: 1px solid silver; }
// .CodeMirror-empty { outline: 1px solid #c22; }
.CodeMirror-empty.CodeMirror-focused { outline: none; }
.CodeMirror pre.CodeMirror-placeholder { color: #999;     font-style: italic; }

.codemirror-container {
  p {
    font-size: 11px;
    margin: 0;
  }
}
.el-form-item__content{
  line-height: 17px;
}
</style>
