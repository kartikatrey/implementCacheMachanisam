
export default {

    data() {
      return {
        undoStackMaxDepth: 1000,
        undoStack: [],
        undoStackCurrent: null,
        undoOrRedoInProgress: false,
        redoStack: [],
      };
    },
  
    computed: {
        checkpointData() {
            return {
              "fieldPrediction": this.fieldPredictionData,
              "selected": this.computedSelectedField
          }
        },
           canUndo() {
            return !!this.undoStack.length;
          },
      
          cantUndo() {
            return !this.canUndo;
          },
      
          canRedo() {
            return !!this.redoStack.length;
          },
      
          cantRedo() {
            return !this.canRedo;
          },  
          checkpointsToRemoveCount() {
            return this.undoStack.length - this.undoStackMaxDepth;
          },
      
          hasCheckpointsToRemove() {
            return !!(this.checkpointsToRemoveCount > 0);
          },
    
    },
  
    methods: {
        resetStack(){
          this.undoStack= []
          this.undoStackCurrent=null
          this.undoOrRedoInProgress=false
          this.redoStack = []
        },
        restoreCheckpoint(checkpointData) {
            let checkpoint = _.cloneDeep(checkpointData)
            this.$set(this.fieldPredictionData,'prediction',checkpoint.fieldPrediction.prediction);
            this.computedSelectedField = checkpoint.selected
             // 3. Restore the component's properties given the to-be-restored checkpoint's data
          },
    
         checkpoint() {
      
            if (this.undoOrRedoInProgress) {
              return;
            }
      
            const checkpointData =  _.cloneDeep(this.checkpointData)
          //  if(!_.isEqual(checkpointData, this.undoStack[this.undoStack.length - 1])){
            // if (checkpointData !== this.undoStack[this.undoStack.length - 1]) {
              this.undoStack.push(checkpointData);
              this.redoStack.length = 0; // Clears the array
              this.undoStackCurrent = checkpointData;
           //}
            // }
      
            if (this.hasCheckpointsToRemove) {
              this.undoStack.splice(0, this.undoStackCheckpointsToRemoveCount);
            }
          },
          
          redo() {
            if (this.canRedo && !this.undoOrRedoInProgress) {
            this.undoOrRedoInProgress = true;
            let undoStackCurrent = _.cloneDeep(this.undoStackCurrent)
            const current = undoStackCurrent;
            const last = this.redoStack.pop();
    
            this.restoreCheckpoint(last);
            this.undoStackCurrent = last;
            this.undoStack.push(current);
      
              setTimeout(() => {
                this.undoOrRedoInProgress = false;
              }, 200);
            }
          },
      
          undo() {
            if (this.canUndo && !this.undoOrRedoInProgress) {
              this.undoOrRedoInProgress = true;
              let checkPoint = _.cloneDeep(this.checkpointData)
              const current = checkPoint
              const last = this.undoStack.pop();
      
             // if(!_.isEqual(current, last))
              //{
            //   if (current !== last) {
              this.undoStackCurrent = last;
              this.restoreCheckpoint(last);
              this.redoStack.push(current);
           //} else {
               //this.undo();
             //}
      
              setTimeout(() => {
                this.undoOrRedoInProgress = false;
              }, 200);
            }
          }
    },
  };