<template>
    <div>
        <el-row>
           <el-col :span="4" :offset="20">
            Dark Theme
            <el-switch v-model="isDarkTheme" @change="handleThemeChange" class="theme-switch">
            </el-switch>
              
           </el-col>
       </el-row>
        <div ref="editor" :style="{'width': options.width || '100%', 'height': options.height || '500px'}"></div>
    </div>
  </template>
  
  <script>
  import loader from "@monaco-editor/loader";
  import businessRule from "@/languages/kanverse-editor/businessRule";
  import scheduler from "@/languages/kanverse-editor/scheduler";
  import Constants from "@/resources/Constants";
  const languageToRuleFileMap ={
    "businessRule": businessRule,
    "scheduler": scheduler
  }
  export default {
   name: "KanverseEditor",
   data() {
    return {
      selectedTheme: "vs-default",
      monacoEditor:null,
      editorContent:this.content || "",
      isDarkTheme: false
   }
  },
   props:{
    "content": {"default":"", "type": String},
    "options": {"default":{}, "type": Object},
    "refreshModel": {"default":false, "type": Boolean},
    "language": { "default": "javascript", "type": String }
   },
   watch: {  
    refreshModel(val, oldval) {
      if(val){
          this.editorContent = this.content;
          this.monacoEditor && this.monacoEditor.getModel().setValue(this.content);
        }
      }
    },
   beforeMount() {
     this.createKanverseEditor();
    },
    methods:{
      createKanverseEditor(){
        let userLocalTheme = localStorage.getItem("kanverse_theme");
        if (userLocalTheme === Constants.DOCEX.THEMES.DARK) {
          this.isDarkTheme = true;
          userLocalTheme = "vs-kanverse"
        }
        if(userLocalTheme){
            this.selectedTheme = userLocalTheme;
        }
        loader.init().then(async (monaco) => {
        this.createTheme(monaco);
        // this.addCustomTokensToMonarch(monaco);
        this.addCustomAutoComplete(monaco);
        this.disableDOMSuggessions(monaco)
        this.createEditor(monaco);
        this.emitEvents();
        });
    },
    handleThemeChange(){
        this.selectedTheme = this.isDarkTheme ? "vs-kanverse" : "vs-default";
        this.monacoEditor && this.monacoEditor.dispose()
        localStorage.setItem("kanverse_theme", this.selectedTheme);
        this.createKanverseEditor()
    },
     /** Theme configuration*/
    createTheme(monaco){
      const themeRules = languageToRuleFileMap[this.options.language].theme_rules // Get the custom theme rules from language files
      monaco.editor.defineTheme('vs-kanverse', {
        base: 'vs-dark', 
        inherit: true,
        rules:themeRules,
        colors: {
        }
      });
    },

    async addCustomTokensToMonarch(monaco){
      const customTokenizer = {
        keywords: [
          'context',
          'Logger',
          'RestClient',
          'getAwaitAuthorizedRestClient'
        ],
        // The main tokenizer for language
        tokenizer: {
          root: [
            { include: 'custom' }
          ],
          custom : [
            [ 'getAwaitAuthorizedRestClient','Logger' ],
            [ 'context']
          ]
        },
      };
      const allLangs = monaco.languages.getLanguages();
      const { conf, language: jsLang } = await allLangs.find(({ id }) => id ==='javascript').loader();
      for (let key in customTokenizer) {
        const value = customTokenizer[key];
        if (key === 'tokenizer') {
          for (let category in value) {
            const tokenDefs = value[category];
            if (!jsLang.tokenizer.hasOwnProperty(category)) {
              jsLang.tokenizer[category] = [];
            }
            if (Array.isArray(tokenDefs)) {
              jsLang.tokenizer[category].unshift.apply(jsLang.tokenizer[category], tokenDefs)
            }
          }
        } else if (Array.isArray(value)) {
          if (!jsLang.hasOwnProperty(key)) {
            jsLang[key] = [];
          }
          jsLang[key].unshift.apply(jsLang[key], value)
        }
      }
  
    },
    addCustomAutoComplete(monaco){
      const shortcuts = languageToRuleFileMap[this.options.language].getCodeShortcuts(monaco) // Get the custom shortcuts from the language files
      monaco.languages.registerCompletionItemProvider(this.language, {
        provideCompletionItems: () => {
          return { suggestions: shortcuts,  };
        }
      });
    },
    // Override existing default autocomplete suggession instead show only javascript Ex. Avoid DOM/typescript
    disableDOMSuggessions(monaco){
      const compilerOptions = monaco.languages.typescript.javascriptDefaults.getCompilerOptions();
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        ...compilerOptions,
        noLib: true,
      });
    },
    createEditor(monaco){
      this.monacoEditor =  monaco.editor.create(this.$refs.editor, {
          value: this.editorContent,
          language: this.language,
          theme: this.selectedTheme || "vs-kanverse",
          fontSize: "14px"
      });
    },
    // Emit event on content change
    emitEvents(){
      this.monacoEditor && this.monacoEditor.onDidChangeModelContent((event)=>{
        const value = this.monacoEditor.getValue()
        this.$emit("onDidChangeModelContent", event, value);
      });
    }
   },
   beforeDestroy(){
    // Destroy the models register on editor create
    this.monacoEditor && this.monacoEditor.getModel().dispose();
   }
  };
  </script>
  <style scoped>
  .theme-switch {
    margin-top: 10px;
  }

  #editor {
    border-radius: 5px;
    margin-top: 20px;
    overflow: auto;
  }
</style>