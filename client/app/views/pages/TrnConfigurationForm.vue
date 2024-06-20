<template>
<el-main>
    <div class="kp-back-to-parent">
        <el-button class="kp-btn-back" icon="el-icon-back" v-on:click="displayList"></el-button>
        <h1 class="kp-page-title">{{pageTitle}}</h1>
    </div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/trn-configuration-list' }">Training configuration</el-breadcrumb-item>
        <el-breadcrumb-item>{{pageTitle}}</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- Form  Page -->

    <div class="kp-form-area">
        <div class="kp-form-panel">
            <el-row>
                <el-col>
                  <el-form :label-position="labelPosition" label-width="100px" :model="trn_configuration" :rules="validationRules" ref="ruleForm">
                       <!-- basic content -->
                      <ConfirmModel ref="model"></ConfirmModel>
                    <el-row :gutter="72">
                        <el-col :span="8">
                            <div class="kp-form-input-1 kp-form-field">
                               
                                <el-form-item  label="Domain" prop="domain" class="kp-form-field-label" >
                                            <el-input v-model="trn_configuration.domain" placeholder=""></el-input>
                                          </el-form-item>  
                            </div>

                          <div class="kp-form-input-1 kp-form-field">
                               
                             <el-form-item label="Max length"   prop="maxlen"  class="kp-form-field-label">
                             <el-input v-model="trn_configuration.maxlen"  placeholder=""></el-input>
                            </el-form-item>
                          </div>

                         <div class="kp-form-input-1 kp-form-field">
                              <el-form-item class="kp-form-field-label"
                                  label="Kernel size"
                                  prop="kernel_size"
                                >
                                  <el-input
                                    v-model="trn_configuration.kernel_size"
                                    placeholder=""
                                  ></el-input>
                                </el-form-item>
                         </div>

                         <div class="kp-form-input-1 kp-form-field">
                            <el-form-item class="kp-form-field-label"
                                  label="Activation"
                                  prop="activation"
                                >
                                  <el-input
                                    v-model="trn_configuration.activation"
                                    placeholder=""
                                  ></el-input>
                                </el-form-item>
                         </div>
                          <div class="kp-form-input-1 kp-form-field">
                           <el-form-item class="kp-form-field-label"
                              label="Num Classes"
                              prop="num_classes"
                            >
                              <el-input
                                v-model="trn_configuration.num_classes"
                                placeholder=""
                              ></el-input>
                            </el-form-item>
                          </div>
                            <div class="kp-form-input-1 kp-form-field">
                               <el-form-item class="kp-form-field-label"
                                    label="loss"
                                    prop="loss"
                                  >
                                    <el-input
                                      v-model="trn_configuration.loss"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                            </div>

                            <div class="kp-form-input-1 kp-form-field">
                             <el-form-item class="kp-form-field-label"
                                  label="Dim Char"
                                  prop="dim_char"
                                >
                                  <el-input
                                    v-model="trn_configuration.dim_char"
                                    placeholder=""
                                  ></el-input>
                                </el-form-item>
                            </div>
                          <div class="kp-form-input-1 kp-form-field">
                             <el-form-item class="kp-form-field-label"
                                    label="Buffer"
                                    prop="buffer"
                                  >
                                    <el-input
                                      v-model="trn_configuration.buffer"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                          </div>

                          <div class="kp-form-input-1 kp-form-field">
                              <el-form-item class="kp-form-field-label"
                                    label="LSTM Size"
                                    prop="lstm_size"
                                  >
                                    <el-input
                                      v-model="trn_configuration.lstm_size"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                          </div>

                        <div class="kp-form-input-1 kp-form-field">
                           <el-form-item class="kp-form-field-label"
                                  label="Batch Size"
                                  prop="batch_size"
                                >
                                  <el-input
                                    v-model="trn_configuration.batch_size"
                                    placeholder=""
                                  ></el-input>
                                </el-form-item>
                        </div>
                         <div class="kp-form-input-1 kp-form-field">
                             <el-form-item class="kp-form-field-label"
                                label="Embedding Dim"
                                prop="embedding_dim"
                              >
                                <el-input
                                  v-model="trn_configuration.embedding_dim"
                                  placeholder=""
                                ></el-input>
                              </el-form-item>
                         </div>
                           
                          <div class="kp-form-input-1 kp-form-field">
                            <el-form-item class="kp-form-field-label"
                                label="Evaluate Every"
                                prop="evaluate_every"
                              >
                                <el-input
                                  v-model="trn_configuration.evaluate_every"
                                  placeholder=""
                                ></el-input>
                              </el-form-item>
                            </div>

                            <div class="kp-form-input-1 kp-form-field">
                               <el-form-item  class="kp-form-field-label"
                                      label="Learning Rate"
                                      prop="learning_rate"
                                    >
                                      <el-input
                                        v-model="trn_configuration.learning_rate"
                                        placeholder=""
                                      ></el-input>
                                    </el-form-item>
                            </div>
                             <div class="kp-form-input-1 kp-form-field">
                                <el-form-item  class="kp-form-field-label"
                                    label="Max Grad Norm"
                                    prop="max_grad_norm"
                                  >
                                    <el-input
                                      v-model="trn_configuration.max_grad_norm"
                                      placeholder=""
                                    ></el-input>
                              </el-form-item>
                             </div>
                            <div class="kp-form-input-1 kp-form-field">
                                <el-form-item class="kp-form-field-label"
                                    label="Hops"
                                    prop="hops"
                                  >
                                    <el-input
                                      v-model="trn_configuration.hops"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                            </div>
                             <div class="kp-form-input-1 kp-form-field">
                             <el-form-item class="kp-form-field-label"
                                label="Embedding Size"
                                prop="embedding_size"
                              >
                                <el-input
                                  v-model="trn_configuration.embedding_size"
                                  placeholder=""
                                ></el-input>
                              </el-form-item>
                             </div>
                              <div class="kp-form-input-1 kp-form-field">
                                 <el-form-item class="kp-form-field-label"
                                            label="Task Id"
                                            prop="task_id"
                                          >
                                            <el-input
                                              v-model="trn_configuration.task_id"
                                              placeholder=""
                                            ></el-input>
                                          </el-form-item>
                              </div>
                              <div class="kp-form-input-1 kp-form-field">
                                 <el-form-item class="kp-form-field-label"
                                  label="Train"
                                  prop="train"
                                >
                                  <el-input
                                    v-model="trn_configuration.train"
                                    placeholder=""
                                  ></el-input>
                                </el-form-item>
                              </div>
                               <div class="kp-form-input-1 kp-form-field">
                                      <el-form-item class="kp-form-field-label"
                                      label="OOV"
                                      prop="OOV"
                                    >
                                      <el-input
                                        v-model="trn_configuration.OOV"
                                        placeholder=""
                                      ></el-input>
                                    </el-form-item>
                               </div>
                                  <div class="kp-form-input-1 kp-form-field">
                                      <el-form-item class="kp-form-field-label"
                                        label="Logger"
                                        prop="logger"
                                      >
                                        <el-input
                                          v-model="trn_configuration.logger"
                                          placeholder=""
                                        ></el-input>
                                      </el-form-item>
                                  </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                     <el-form-item class="kp-form-field-label"
                                          label="Word Idx"
                                          prop="word_idx"
                                        >
                                          <el-input
                                            v-model="trn_configuration.word_idx"
                                            placeholder=""
                                          ></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                       <el-form-item class="kp-form-field-label"
                                              label="Nepoch No Improve"
                                              prop="nepoch_no_imprv"
                                            >
                                              <el-input
                                                v-model="trn_configuration.nepoch_no_imprv"
                                                placeholder=""
                                              ></el-input>
                                            </el-form-item>
                                    </div>
                                         <div class="kp-form-input-1 kp-form-field">
                                         <el-form-item class="kp-form-field-label"
                                            label="Train Embeddings"
                                            prop="train_embeddings"
                                          >
                                            <el-input
                                              v-model="trn_configuration.train_embeddings"
                                              placeholder=""
                                            ></el-input>
                                          </el-form-item>
                                         </div>
                                           <div class="kp-form-input-1 kp-form-field">
                                          <el-form-item class="kp-form-field-label"
                                              label="Lr Method"
                                              prop="lr_method"
                                            >
                                              <el-input
                                                v-model="trn_configuration.lr_method"
                                                placeholder=""
                                              ></el-input>
                                            </el-form-item>
                                           </div>
                                            <div class="kp-form-input-1 kp-form-field">
                                            <el-form-item class="kp-form-field-label"
                                                label="Lr Decay"
                                                prop="lr_decay"
                                              >
                                                <el-input
                                                  v-model="trn_configuration.lr_decay"
                                                  placeholder=""
                                                ></el-input>
                                              </el-form-item>
                                            </div>
                                           <div class="kp-form-input-1 kp-form-field">
                                             <el-form-item class="kp-form-field-label"
                                                  label="reload"
                                                  prop="reload"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.reload"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                            </div>
                                            <div class="kp-form-input-1 kp-form-field">
                                             <el-form-item class="kp-form-field-label"
                                                    label="Char Hidden Size"
                                                    prop="char_hidden_size"
                                                  >
                                                    <el-input
                                                      v-model="trn_configuration.char_hidden_size"
                                                      placeholder=""
                                                    ></el-input>
                                                  </el-form-item>
                                            </div>
                                             <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label"
                                                    label="Chars"
                                                    prop="chars"
                                                  >
                                                    <el-input
                                                      v-model="trn_configuration.chars"
                                                      placeholder=""
                                                    ></el-input>
                                                  </el-form-item>
                                             </div>
                                              <div class="kp-form-input-1 kp-form-field">
                                              <el-form-item class="kp-form-field-label"
                                                  label="Hidden Size lstm"
                                                  prop="hidden_size_lstm"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.hidden_size_lstm"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                              </div>
                                          <div class="kp-form-input-1 kp-form-field">
                                             <el-form-item class="kp-form-field-label"
                                              label="Use Chars"
                                              prop="use_chars"
                                            >
                                              <el-input
                                                v-model="trn_configuration.use_chars"
                                                placeholder=""
                                              ></el-input>
                                            </el-form-item>
                                          </div>
                                           <div class="kp-form-input-1 kp-form-field">
                                          <el-form-item class="kp-form-field-label"
                                                label="Use Pretrained"
                                                prop="use_pretrained"
                                              >
                                                <el-input
                                                  v-model="trn_configuration.use_pretrained"
                                                  placeholder=""
                                                ></el-input>
                                              </el-form-item>
                                           </div>
                                            <div class="kp-form-input-1 kp-form-field">
                                             <el-form-item class="kp-form-field-label"
                                                  label="EPOCH Drop"
                                                  prop="epoch_drop"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.epoch_drop"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                            </div>
                                             <div class="kp-form-input-1 kp-form-field">
                                               <el-form-item class="kp-form-field-label"
                                                  label="Config File"
                                                  prop="config_file"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.config_file"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                             </div>
                                         <div class="kp-form-input-1 kp-form-field">
                                          <el-form-item class="kp-form-field-label"
                                                label="EVAL Traning Data"
                                                prop="eval_training_data"
                                              >
                                                <el-input
                                                  v-model="trn_configuration.eval_training_data"
                                                  placeholder=""
                                                ></el-input>
                                              </el-form-item>
                                            </div>
                                            <div class="kp-form-input-1 kp-form-field">
                                               <el-form-item class="kp-form-field-label"
                                                  label="Sample 1 of N eval on Train Example"
                                                  prop="sample_1_of_n_eval_on_train_examples"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.sample_1_of_n_eval_on_train_examples"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                            </div>
                                             <div class="kp-form-input-1 kp-form-field">
                                                         <el-form-item class="kp-form-field-label"
                                                            label="Run Once"
                                                            prop="run_once"
                                                          >
                                                            <el-input
                                                              v-model="trn_configuration.run_once"
                                                              placeholder=""
                                                            ></el-input>
                                                          </el-form-item>
                                             </div>
                                               <div class="kp-form-input-1 kp-form-field">
                                               <el-form-item class="kp-form-field-label"
                                                      label="Save Checkpoint Secs"
                                                      prop="save_checkpoint_secs"
                                                    >
                                                      <el-input
                                                        v-model="trn_configuration.save_checkpoint_secs"
                                                        placeholder=""
                                                      ></el-input>
                                                    </el-form-item>
                                               </div>
                                                  <div class="kp-form-input-1 kp-form-field">
                                                    <el-form-item class="kp-form-field-label"
                                                        label="Input shape"
                                                        prop="input_shape"
                                                      >
                                                        <el-input
                                                          v-model="trn_configuration.input_shape"
                                                          placeholder=""
                                                        ></el-input>
                                                      </el-form-item>
                                                  </div>
                                                    <div class="kp-form-input-1 kp-form-field">
                                                    <el-form-item class="kp-form-field-label"
                                                            label="Filter Length"
                                                            prop="filter_length"
                                                          >
                                                            <el-input
                                                              v-model="trn_configuration.filter_length"
                                                              placeholder=""
                                                            ></el-input>
                                                          </el-form-item>
                                                    </div>

                          </el-col>





                        <el-col :span="8">
                            <div class="kp-form-input-1 kp-form-field"> 
                                 <el-form-item label="Model type"  prop="model_type" class="kp-form-field-label" >
                                <el-input v-model="trn_configuration.model_type" placeholder="" ></el-input>
                                </el-form-item>
                            </div>

                             <div class="kp-form-input-1 kp-form-field"> 
                                 <el-form-item class="kp-form-field-label"
                                    label="Max words"
                                    prop="max_words"
                                  >
                                    <el-input
                                      v-model="trn_configuration.max_words"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                             </div>
                            
                            <div class="kp-form-input-1 kp-form-field"> 
                                 <el-form-item class="kp-form-field-label"
                                          label="Padding"
                                          prop="padding"
                                        >
                                          <el-input
                                            v-model="trn_configuration.padding"
                                            placeholder=""
                                          ></el-input>
                                        </el-form-item>
                            </div>
 
                            <div class="kp-form-input-1 kp-form-field"> 
                                <el-form-item class="kp-form-field-label"
                                    label="strides"
                                    prop="strides"
                                  >
                                    <el-input
                                      v-model="trn_configuration.strides"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                            </div>

                              <div class="kp-form-input-1 kp-form-field">
                                 <el-form-item class="kp-form-field-label"
                                    label="optimizer"
                                    prop="optimizer"
                                  >
                                    <el-input
                                      v-model="trn_configuration.optimizer"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                              </div>
                           <div class="kp-form-input-1 kp-form-field">
                               <el-form-item class="kp-form-field-label"
                                  label="Validation Split"
                                  prop="validation_split"
                                >
                                  <el-input
                                    v-model="trn_configuration.validation_split"
                                    placeholder=""
                                  ></el-input>
                                </el-form-item>
                           </div>
                          <div class="kp-form-input-1 kp-form-field">
                            <el-form-item class="kp-form-field-label"
                                  label="Num OOV Buckets"
                                  prop="num_oov_buckets"
                                >
                                  <el-input
                                    v-model="trn_configuration.num_oov_buckets"
                                    placeholder=""
                                  ></el-input>
                                </el-form-item>
                          </div>
                           <div class="kp-form-input-1 kp-form-field">
                              <el-form-item class="kp-form-field-label"
                                    label="Filters"
                                    prop="filters"
                                  >
                                    <el-input
                                      v-model="trn_configuration.filters"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                           </div>
                           <div class="kp-form-input-1 kp-form-field">
                                <el-form-item class="kp-form-field-label"
                                        label="No.Of Epochs"
                                        prop="num_epochs"
                                      >
                                        <el-input
                                          v-model="trn_configuration.num_epochs"
                                          placeholder=""
                                        ></el-input>
                                      </el-form-item>
                           </div>

                            <div class="kp-form-input-1 kp-form-field">
                                  <el-form-item class="kp-form-field-label"
                                    label="No.Of Filters"
                                    prop="num_filters"
                                  >
                                    <el-input
                                      v-model="trn_configuration.num_filters"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>

                            </div>
                            <div class="kp-form-input-1 kp-form-field">
                                 <el-form-item class="kp-form-field-label"
                                  label="L2 Reg Lambda"
                                  prop="l2_reg_lambda"
                                >
                                  <el-input
                                    v-model="trn_configuration.l2_reg_lambda"
                                    placeholder=""
                                  ></el-input>
                                </el-form-item>
                            </div>
                            
                             <div class="kp-form-input-1 kp-form-field">
                                <el-form-item class="kp-form-field-label"
                                    label="Dropout Keep Prob"
                                    prop="dropout_keep_prob"
                                  >
                                    <el-input
                                      v-model="trn_configuration.dropout_keep_prob"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                             </div>
                              <div class="kp-form-input-1 kp-form-field">
                                   <el-form-item class="kp-form-field-label"
                                    label="Epsilon"
                                    prop="epsilon"
                                  >
                                    <el-input
                                      v-model="trn_configuration.epsilon"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                              </div>
                                <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label"
                                    label="Evaluation Interval"
                                    prop="evaluation_interval"
                                  >
                                    <el-input
                                      v-model="trn_configuration.evaluation_interval"
                                      placeholder=""
                                    ></el-input>
                                  </el-form-item>
                                </div>
                                 <div class="kp-form-input-1 kp-form-field">
                                      <el-form-item class="kp-form-field-label"
                                              label="Epochs"
                                              prop="epochs"
                                            >
                                              <el-input
                                                v-model="trn_configuration.epochs"
                                                placeholder=""
                                              ></el-input>
                                            </el-form-item>
                                 </div>
                                  <div class="kp-form-input-1 kp-form-field">
                                      <el-form-item class="kp-form-field-label"
                                            label="Memory Size"
                                            prop="memory_size"
                                          >
                                            <el-input
                                              v-model="trn_configuration.memory_size"
                                              placeholder=""
                                            ></el-input>
                                          </el-form-item>
                                  </div>
                                 <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label"
                                                label="Random State"
                                                prop="random_state"
                                              >
                                                <el-input
                                                  v-model="trn_configuration.random_state"
                                                  placeholder=""
                                                ></el-input>
                                              </el-form-item>
                                 </div>
                                  <div class="kp-form-input-1 kp-form-field">
                                    <el-form-item class="kp-form-field-label"
                                        label="Is Interactive"
                                        prop="isInteractive"
                                      >
                                        <el-input
                                          v-model="trn_configuration.isInteractive"
                                          placeholder=""
                                        ></el-input>
                                      </el-form-item>
                                  </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                       <el-form-item class="kp-form-field-label"
                                              label="Network Embedding Size"
                                              prop="network_embedding_size"
                                            >
                                              <el-input
                                                v-model="trn_configuration.network_embedding_size"
                                                placeholder=""
                                              ></el-input>
                                            </el-form-item>
                                    </div>
                                    <div class="kp-form-input-1 kp-form-field">
                                      <el-form-item class="kp-form-field-label"
                                          label="Max Vocab Size"
                                          prop="_max_vocab_size"
                                        >
                                          <el-input
                                            v-model="trn_configuration._max_vocab_size"
                                            placeholder=""
                                          ></el-input>
                                        </el-form-item>
                                    </div>
                                     <div class="kp-form-input-1 kp-form-field">
                                         <el-form-item class="kp-form-field-label"
                                            label="Dropout"
                                            prop="dropout"
                                          >
                                            <el-input
                                              v-model="trn_configuration.dropout"
                                              placeholder=""
                                            ></el-input>
                                          </el-form-item>
                                     </div>
                                      <div class="kp-form-input-1 kp-form-field">
                                          <el-form-item class="kp-form-field-label"
                                              label="Dimension"
                                              prop="dim"
                                            >
                                              <el-input
                                                v-model="trn_configuration.dim"
                                                placeholder=""
                                              ></el-input>
                                            </el-form-item>
                                      </div>
                                       <div class="kp-form-input-1 kp-form-field">
                                         <el-form-item class="kp-form-field-label"
                                                  label="Nepochs"
                                                  prop="nepochs"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.nepochs"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                       </div>
                                        <div class="kp-form-input-1 kp-form-field">
                                           <el-form-item class="kp-form-field-label"
                                                  label="Lr"
                                                  prop="lr"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.lr"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                        </div>
                                        <div class="kp-form-input-1 kp-form-field">
                                           <el-form-item class="kp-form-field-label"
                                                label="Clip"
                                                prop="clip"
                                              >
                                                <el-input
                                                  v-model="trn_configuration.clip"
                                                  placeholder=""
                                                ></el-input>
                                              </el-form-item>
                                        </div>
                                         <div class="kp-form-input-1 kp-form-field">
                                            <el-form-item class="kp-form-field-label"
                                                  label="Hidden Size"
                                                  prop="hidden_size"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.hidden_size"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                         </div>
                                         <div class="kp-form-input-1 kp-form-field">
                                            <el-form-item class="kp-form-field-label"
                                                    label="CRF"
                                                    prop="crf"
                                                  >
                                                    <el-input
                                                      v-model="trn_configuration.crf"
                                                      placeholder=""
                                                    ></el-input>
                                                  </el-form-item>
                                        </div>
                                        <div class="kp-form-input-1 kp-form-field">
                                           <el-form-item class="kp-form-field-label"
                                              label="Hidden Size Char"
                                              prop="hidden_size_char"
                                            >
                                              <el-input
                                                v-model="trn_configuration.hidden_size_char"
                                                placeholder=""
                                              ></el-input>
                                            </el-form-item>
                                        </div>
                                           <div class="kp-form-input-1 kp-form-field">
                                              <el-form-item class="kp-form-field-label"
                                                  label="Use Crf"
                                                  prop="use_crf"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.use_crf"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                           </div>
                                            <div class="kp-form-input-1 kp-form-field">
                                               <el-form-item class="kp-form-field-label"
                                                  label="Max iter"
                                                  prop="max_iter"
                                                >
                                                  <el-input
                                                    v-model="trn_configuration.max_iter"
                                                    placeholder=""
                                                  ></el-input>
                                                </el-form-item>
                                            </div>
                                            <div class="kp-form-input-1 kp-form-field">
                                                <el-form-item class="kp-form-field-label"
                                                        label="Dim Word"
                                                        prop="dim_word"
                                                      >
                                                        <el-input
                                                          v-model="trn_configuration.dim_word"
                                                          placeholder=""
                                                        ></el-input>
                                                      </el-form-item>
                                            </div>
                                              <div class="kp-form-input-1 kp-form-field">
                                               <el-form-item class="kp-form-field-label"
                                                    label="Patience"
                                                    prop="patience"
                                                  >
                                                    <el-input
                                                      v-model="trn_configuration.patience"
                                                      placeholder=""
                                                    ></el-input>
                                                  </el-form-item>
                                              </div>
                                                <div class="kp-form-input-1 kp-form-field">
                                                  <el-form-item class="kp-form-field-label"
                                                    label="Num Train Step"
                                                    prop="num_train_steps"
                                                  >
                                                    <el-input
                                                      v-model="trn_configuration.num_train_steps"
                                                      placeholder=""
                                                    ></el-input>
                                                  </el-form-item>
                                                </div>
                                                 <div class="kp-form-input-1 kp-form-field">
                                                     <el-form-item class="kp-form-field-label"
                                                    label="Sample 1 of N eval Example"
                                                    prop="sample_1_of_n_eval_examples"
                                                  >
                                                    <el-input
                                                      v-model="trn_configuration.sample_1_of_n_eval_examples"
                                                      placeholder=""
                                                    ></el-input>
                                                  </el-form-item>
                                                 </div>
                                                 <div class="kp-form-input-1 kp-form-field">
                                                     <el-form-item class="kp-form-field-label"
                                                        label="HParams Overrides"
                                                        prop="hparams_overrides"
                                                      >
                                                        <el-input
                                                          v-model="trn_configuration.hparams_overrides"
                                                          placeholder=""
                                                        ></el-input>
                                                      </el-form-item>
                                                 </div>
                                                   <div class="kp-form-input-1 kp-form-field">
                                                      <el-form-item class="kp-form-field-label"
                                                          label="Keep Checkpoint max"
                                                          prop="keep_checkpoint_max"
                                                        >
                                                          <el-input
                                                            v-model="trn_configuration.keep_checkpoint_max"
                                                            placeholder=""
                                                          ></el-input>
                                                        </el-form-item>
                                                   </div>
                                                     <div class="kp-form-input-1 kp-form-field">
                                                    <el-form-item class="kp-form-field-label"
                                                          label="Input Type"
                                                          prop="input_type"
                                                        >
                                                          <el-input
                                                            v-model="trn_configuration.input_type"
                                                            placeholder=""
                                                          ></el-input>
                                                        </el-form-item>
                                                     </div>
                                                      <div class="kp-form-input-1 kp-form-field">
                                                      <el-form-item class="kp-form-field-label"
                                                        label="Write inference graph"
                                                        prop="write_inference_graph"
                                                      >
                                                        <el-input
                                                          v-model="trn_configuration.write_inference_graph"
                                                          placeholder=""
                                                        ></el-input>
                                                      </el-form-item>
                                                      </div>
                        </el-col>
                    </el-row>
                     
                    </el-form>
                </el-col>
            </el-row>
        </div>

        <el-button v-on:click.once="save" :key="buttonKey" class="kp-btn-form-primary" type="primary">Save</el-button>
        <el-button v-on:click="displayList" class="kp-btn-form-outline">Cancel</el-button>
        <div v-if="!isFormValid" class="kp-form-error">
            * Please check field with errors
        </div>

    </div>
</el-main>
</template>



<script>
import _ from "lodash";
import Json from "@/util/Json";
import Codemirror from "@/components/Codemirror";
import CommonService from "@/services/CommonService";
import constants from "@/resources/Constants";
import ConfirmModel from "@/components/ConfirmModel";

export default {
  name: "TrnConfigurationFrom",
  components: {
    Codemirror,
    ConfirmModel
  },
  data() {
    return {
      labelPosition: "top",
      isFormValid: true,
      cacheDataModal: {
        cachedForm: {},
        isFormEdited: false,
        isEditForm: false,
        isNewForm: false,
        watcherAlreadyCalled: true
      },
      requiredParam: {},
      buttonKey: 1,
      pageTitle: "New Configuration",
      editorOptions: { mode: "text/javascript", theme: "default" },
      trn_configuration: {},
      endpoint: constants.TRN_CONFIGURATION_ENDPOINT
      // validationRules: this.setValidationRules()
    };
  },
  watch: {
    trn_configuration: {
      handler(newVal, oldVal) {
        if (this.cacheDataModal.isNewForm || this.cacheDataModal.isEditForm) {
        this.cacheDataModal.isFormEdited =
            JSON.stringify(this.cacheDataModal.cachedForm) !=
            JSON.stringify(this.trn_configuration);
        }
      },
      deep: true
    }
  },
  methods: {
    async init() {
      const configId = this.getConfigIdFromUrl();
      if (configId) {
        let trn_configuration = await CommonService.fetchById(
          this.endpoint,
          configId
        ).catch(error => {
          this.notifyError("Error while fetching configuration data");
        });
        this.trn_configuration =
          (trn_configuration &&
            _.defaultsDeep(trn_configuration, this.trn_configuration)) ||
          this.schedular;
        this.cacheDataModal.isEditForm = true;
         this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.trn_configuration };
        this.pageTitle = "Edit configuration";
      } else {
        this.cacheDataModal.isNewForm = true;
        this.cacheDataModal.isFormEdited = false;
        this.cacheDataModal.cachedForm = { ...this.trn_configuration };
      }
    },
    getConfigIdFromUrl() {
      return this.$route.query.id || "";
    },

    async save() {
      this.cacheDataModal.isFormEdited = false;
      let isValid = await this.$refs.ruleForm.validate().catch(error => {});
      let trn_configuration =
        isValid &&
        (await CommonService.save(this.endpoint, this.trn_configuration).catch(
          error => {
            this.isFormValid = false;
            this.notifyError("Error while saving configuration!!");
          }
        ));
      if (trn_configuration) {
        this.trn_configuration._id = trn_configuration._id; // add service id after first request to existing service object to avoid duplicate service entries
        this.notifySuccess("configuration saved successfully!!");
        this.displayList();
      }
      this.buttonKey++;
    },

    displayList() {
      this.$router.push({ path: "/trn-configuration-list" });
    },
    // setValidationRules() {
    //   return {
    //     model_name: [
    //       {
    //         required: true,
    //         message: "Please input model name",
    //         trigger: "blur"
    //       }
    //     ],
    //     request_body: [
    //       {
    //         required: true,
    //         message: "Please input request body",
    //         trigger: "blur"
    //       }
    //     ],
    //     response_body: [
    //       {
    //         required: true,
    //         message: "Please input response body",
    //         trigger: "blur"
    //       }
    //     ],
    //   };
    // },
  },

  beforeMount() {
    let user = this.$store.getters.user;
    if (user.roles.includes("admin")) {
      this.showList = true;
    }
    this.init();
    window.addEventListener("beforeunload", event => {
      if (!this.cacheDataModal.isFormEdited) return;
      event.preventDefault();
      event.returnValue = "";
    });
  },
  beforeRouteLeave: function(to, from, next) {
    if (this.cacheDataModal.isFormEdited) {
      //    return window.confirm('Do you really want to leave? you have unsaved changes!')
      return this.$refs.model.open(next);
    } else {
      return next();
    }
  }
};
</script>

<style lang="scss">
// Global Components

@import "../../assets/scss/_variables";
</style>