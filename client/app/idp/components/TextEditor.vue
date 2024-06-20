<template>
  <wysiwyg id="emailBody" v-model="inputValue" @change="onChange" ref="editor" @focus="onEditorFocus" />
</template>
        
        
<script>
import EventBus from "@/EventBus";

export default {
  name: "TextEditor",
  props: ["sourceData"],
  data() {
    return {
      inputValue: "",
      curPos: null,
    };
  },
  watch: {
    sourceData: {
      handler(newVal, oldVal) {
          this.inputValue = newVal;
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onChange() {
      EventBus.$emit("editedBody", this.inputValue);
    },
    onEditorFocus(event) {
      this.editor = event.target;
    },
    insertPlaceholder(placeHolderField) {
      let emailBody = document.querySelector('#emailBody .editr--content');
      let self = this;
      emailBody.addEventListener('click', function() {
        self.curPos = self.getCursorPosition(emailBody);
      });
      const value = this.inputValue;
      let newValue = "";
      // This check is added for the first time on entering text and adding placeholder into the body
      // Because the first time on clicking on placeholder, the curPos is not set yet, so its value is null
      // We need to append the placeholder with the existing inputValue
      if (this.curPos === null) {
        newValue = value + "${" + placeHolderField + "}";
      } else {
        newValue = value.slice(0, this.curPos) + "${" + placeHolderField + "}" + value.slice(this.curPos);
      }
      this.inputValue = newValue;
      EventBus.$emit("editedBody", this.inputValue);
    },

    // Function to get the current Cursor position within the email body content
    getCursorPosition(element) {
      let currPos = 0;
      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const preCursorRange = range.cloneRange();
          
          // Select the contents of the email body element
          preCursorRange.selectNodeContents(element);

          // Set the end of the range to the current Cursor position
          preCursorRange.setEnd(range.endContainer, range.endOffset);

          // Calculate the length of the selected text to determine the Cursor position
          currPos = preCursorRange.toString().length;
        }
      }
      return currPos;
    }
  },
};
</script>

<style lang="scss">
@import '../../../../node_modules/vue-wysiwyg/dist/vueWysiwyg.css';
</style>
