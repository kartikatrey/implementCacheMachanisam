<template>
  <el-container>
    <el-header>
      <!--  Header -->

      <el-row>
        <el-col :span="6">
          <div class="left-block">
            <h5>LOGO</h5>
          </div>
        </el-col>

        <el-col :offset="6" :span="12">
          <el-row class="right-block" :gutter="20" type="flex" justify="end">
            <el-col :span="12">
              <el-select class="kp-topnav-select" v-model="value" placeholder="Select Customer">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>

            <el-col :span="6">
              <el-dropdown>
                <span class="el-dropdown-link">
                  Admin
                  <i class="mdi mdi-account" ></i>
                  <!-- <el-button class="mdi mdi-account" type="default"></el-button> -->
                </span>

                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>Action 1</el-dropdown-item>

                  <el-dropdown-item>Action 2</el-dropdown-item>

                  <el-dropdown-item>Action 3</el-dropdown-item>

                  <el-dropdown-item disabled>Action 4</el-dropdown-item>

                  <el-dropdown-item divided>Action 5</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-header>
    <!--  Header Ends -->

    <el-container>
      <el-aside width="200px">
        <!--  SideNav -->

        <el-row class="tac">
          <el-col :span="24">
            <el-menu
              default-active="2"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>

                  <span>Workflow</span>
                </template>

                <el-menu-item-group title="Group One">
                  <el-menu-item index="1-1">item one</el-menu-item>

                  <el-menu-item index="1-2">item one</el-menu-item>
                </el-menu-item-group>
              </el-submenu>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>QA Automation</span>
              </el-menu-item>

              <el-menu-item index="4" class="active">
                <i class="el-icon-setting"></i>

                <span>API Transactions</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Entities</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Suggestions</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Help Section</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Reported Issues</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>

              <el-menu-item index="4">
                <i class="el-icon-setting"></i>

                <span>Customer Users</span>
              </el-menu-item>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <!--  SideNav Ends -->

      <el-main style="background: #F4F5F9;">
        <!--  Main Body -->

        <h1 class="kp-page-title">Customers</h1>

        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>

          <el-breadcrumb-item>Customers</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- top head -->

        <div class="kp-top-section-container">
          <div class="section-labels">
            <h2>All Commands</h2>

            <p>
              12343
              <i class="label-icon el-icon-user-solid kp-label-info1"></i>
            </p>
          </div>

          <div class="section-labels">
            <h2>Success</h2>

            <p>
              12343
              <i class="label-icon el-icon-check kp-label-info2"></i>
            </p>
          </div>

          <div class="section-labels">
            <h2>Failure</h2>

            <p>
              12343
              <i class="label-icon el-icon-close kp-label-info3"></i>
            </p>
          </div>

          <div class="section-labels">
            <h2>Cancelld</h2>

            <p>
              12343
              <i class="label-icon el-icon-minus kp-label-info4"></i>
            </p>
          </div>
        </div>

        <!-- end top head -->

        <!-- <el-page-header @back="goBack" content="Page Title"></el-page-header> -->

        <!--  Table Toolbar -->

        <el-menu class="kp-table-toolbar" @select="handleSelect">
          <el-row>
            <el-col :span="10">
              <div class="left-block">
                <el-button class="kp-btn-primary" type="primary">
                  <i class="el-icon-plus"></i> Add Customer
                </el-button>
              </div>
            </el-col>

            <el-col :span="14">
              <el-row class="right-block" :gutter="20" type="flex" justify="end">
                <el-col :span="14">
                  <el-input class="kp-toolbar-input" placeholder="Please input" v-model="input"></el-input>
                </el-col>

                <el-col :span="10">
                

                  <el-button class="kp-btn-toolbar" style="display: inline-block;">
                    <!-- <i class="el-icon-s-operation"></i> -->
                    <span class="mdi mdi-filter"></span>
                  </el-button>

                    <el-button class="kp-btn-toolbar" style="display: inline-block;">
                    <i class="mdi mdi-arrow-down-thin-circle-outline"></i>
                  </el-button>

                  <el-button class="kp-btn-toolbar" style="display: inline-block;">Export</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-menu>

        <!--  Table Toolbar Ends -->

        <!-- Toolbar Filters -->

        <div class="kp-form-panel kp-toolbar-filter">
          <el-row>
            <el-col>
              <el-row :gutter="72">
                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <div class="kp-form-field-label">Field Label</div>

                    <el-input placeholder="Please input" v-model="input"></el-input>
                  </div>

                  <div class="kp-form-select-1 kp-form-field">
                    <div class="kp-form-field-label">Field Label</div>

                    <el-select v-model="value" placeholder="Select">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>

                  <el-checkbox v-model="checked">Check Box</el-checkbox>

                  <el-button
                    style="display: block; margin-top:32px;"
                    class="kp-btn-form-outline"
                  >Apply Filter</el-button>
                </el-col>

                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <div class="kp-form-field-label">Field Label</div>

                    <el-input placeholder="Please input" v-model="input"></el-input>
                  </div>

                  <div class="kp-form-select-1 kp-form-field">
                    <div class="kp-form-field-label">Field Label</div>

                    <el-select v-model="value" placeholder="Select">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>

        <el-button class="kp-btn-form-disabled" disabled>Previous</el-button>

        <el-button class="kp-btn-form-outline">Next</el-button>

        <el-button class="kp-btn-form-primary" type="primary">Save</el-button>

        <div class="kp-form-error">* Please check field with errors</div>

        <!-- </div> -->

        <el-table
          class="kp-main-table"
          ref="multipleTable"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column label="Date" width="100%">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>

          <el-table-column property="name" label="Name" width="100%"></el-table-column>

          <el-table-column property="address" label="Address" show-overflow-tooltip></el-table-column>

          <el-table-column property="address" label="Email" show-overflow-tooltip></el-table-column>

          <el-table-column property="address" label="Website" show-overflow-tooltip></el-table-column>

          <el-table-column property="address" label="Vehicle" show-overflow-tooltip></el-table-column>

          <el-table-column property="address" label="Registration" show-overflow-tooltip></el-table-column>

          <el-table-column property="address" label="Pending Amount" show-overflow-tooltip></el-table-column>

          <el-table-column property="address" label="Penalty Amount" show-overflow-tooltip></el-table-column>

          <el-table-column label="Actions" width="100%" fixed="right">
            <template slot-scope="props">
              <!-- <p-switch v-model="props.row.active" color="black"></p-switch> -->

              <button class="kp-blank-btn el-icon-edit el-button--default"></button>

              <button class="kp-blank-btn el-icon-delete el-button--default"></button>
            </template>
          </el-table-column>
        </el-table>

        <div class="block kp-table-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage4"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          ></el-pagination>
        </div>

        <!-- Form Header Page -->

        <div class="kp-back-to-parent">
          <el-button class="kp-btn-back" icon="el-icon-back"></el-button>

          <h1 class="kp-page-title">Customers</h1>
        </div>

        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>

          <el-breadcrumb-item>Add Customer</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- Form  Page -->

        <div class="kp-form-area">
          <div class="kp-form-panel">
            <el-row>
              <el-col>
                <el-row :gutter="72">
                  <button class="kp-from-actions kp-blank-btn el-icon-delete el-button--default"></button>

                  <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                      <div class="kp-form-field-label">Field Label</div>

                      <el-input placeholder="Please input" v-model="input"></el-input>
                    </div>

                    <div class="kp-form-input-1 kp-form-field kp-form-field-invalid">
                      <div class="kp-form-field-label">Field Label</div>

                      <el-input placeholder="Please input" v-model="input"></el-input>

                      <div class="kp-form-field-invalid-label">Invalid Input</div>
                    </div>

                    <div class="kp-form-select-1 kp-form-field">
                      <div class="kp-form-field-label">Field Label</div>

                      
                      
                      <el-select v-model="value" placeholder="Select">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                    <!-- <el-checkbox class="kp-form-field-checkbox11" v-model="checked">Check Box</el-checkbox> -->
                    <el-checkbox class="kp-form-field-checkbox11" v-model="checked">Check Box</el-checkbox>
                  </el-col>

                  <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                      <div class="kp-form-field-label">Field Label</div>

                      <el-input placeholder="Please input" v-model="input"></el-input>
                    </div>

                    <div class="kp-form-input-1 kp-form-input-template kp-form-field">
                      <div class="kp-form-field-label">Field Label</div>
                      <el-input placeholder="Please input" v-model="input2">
                        <template slot="append">.com</template>
                      </el-input>
                    </div>

                    <div class="kp-form-select-1 kp-form-field">
                      <div class="kp-form-field-label">Field Label</div>

                      <el-select v-model="value" placeholder="Select">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>

                    <el-checkbox class="kp-form-field-checkbox1" v-model="checked">Check Box</el-checkbox>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>

          <el-button class="kp-btn-form-disabled" disabled>Previous</el-button>

          <el-button class="kp-btn-form-outline">Next</el-button>

          <el-button class="kp-btn-form-primary" type="primary">Save</el-button>

          <div class="kp-form-error">* Please check field with errors</div>
        </div>

        <!-- Tab -->
        <div class="kp-form-area kp-tabs">
          <el-tabs class="kp-form-tabs-panel" type="card" @tab-click="handleClick">
            <el-tab-pane class="kp-tabs-body" label="User">
              <el-row>
                <el-col>
                  <el-row :gutter="72">
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <div class="kp-form-field-label">Field Label</div>

                        <el-input placeholder="Please input" v-model="input"></el-input>
                      </div>
                    </el-col>

                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <div class="kp-form-field-label">Field Label</div>

                        <el-input placeholder="Please input" v-model="input"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-tab-pane>

            <el-tab-pane label="Config">
              <el-row>
                <el-col>
                  <el-row :gutter="72">
                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <div class="kp-form-field-label">Field Label</div>

                        <el-input placeholder="Please input" v-model="input"></el-input>
                      </div>
                    </el-col>

                    <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <div class="kp-form-field-label">Delete Label</div>
                        <el-input placeholder="Please input" v-model="input"></el-input>
                      </div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </el-tab-pane>
          </el-tabs>

          <el-button class="kp-btn-form-disabled" disabled>Previous</el-button>

          <el-button class="kp-btn-form-outline">Next</el-button>

          <el-button class="kp-btn-form-primary" type="primary">Save</el-button>

          <div class="kp-form-error">* Please check field with errors</div>
        </div>
    <!-- Tab end -->


    <!-- suggestion -->
     <div class="kp-form-area add-suggestion-wrap">
          <div class="kp-form-panel">

                <div class="object-name-wrap">
                  <el-row :gutter="72">
                   <el-col :span="8">
                      <div class="kp-form-input-1 kp-form-field">
                        <div class="kp-form-field-label">Object</div>

                         <el-select
                          v-model="value10"
                          multiple
                          filterable
                          allow-create
                          default-first-option
                          placeholder="Choose tags for your article">
                          <el-option
                            v-for="item in options5"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>


                      </div>
                    </el-col>
                  </el-row>
                </div>
           
                <el-row :gutter="72" class="mt-10">
                  <h4>Suggesion 1</h4>
                
                  <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                      <div class="kp-form-field-label">Value</div>
                      <el-input placeholder="Please input" v-model="input"></el-input>
                    </div>
                  </el-col>
                  <el-button round class="kp-from-actions kp-blank-btn el-icon-delete el-button--default"></el-button>
                </el-row>

                <el-row :gutter="72">
                  <h4>Suggesion 2</h4>
                  <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                      <div class="kp-form-field-label">Tag</div>
                      <el-input placeholder="Please input" v-model="input"></el-input>
                    </div>
                  </el-col>

                  <el-col :span="8">
                    <div class="kp-form-input-1 kp-form-field">
                      <div class="kp-form-field-label">Value</div>
                      <el-input placeholder="Please input" v-model="input"></el-input>
                    </div>
                  </el-col>
                  <el-button round class="kp-from-actions kp-blank-btn el-icon-delete el-button--default"></el-button>
              </el-row>
           

           <el-button
                    style="display: block; margin-top:32px;"
                    class="kp-btn-form-outline"
                  >+ Add Suggestion</el-button>
          </div>
        </div>
    <!-- end suggestion -->

    <!-- Start NER Model Page -->
    <div class="NER-model-wrap">
    <el-row :gutter="10">
      <el-col :span="14">
        <div class="kp-form-area">
       <div class="kp-form-panel no-m">
            <div class="kp-form-select-1 kp-form-field no-m">
              <div class="kp-form-field-label">Field Label</div>

              <el-select v-model="value" placeholder="Select">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
        </div>
      </div>
      </el-col>
    </el-row>
   
    

    <div class="kp-command-wrap no-p">
        <!-- <el-row :gutter="10"> -->
          <!-- left site -->
          <div class="left-col" :span="14">
            <!--  inner -->
            <div class="kp-inner">
             <div class="kp-form-input-1 kp-form-input-template kp-form-field">
                <div class="kp-form-field-label kp-command-title">Command 1  
                  <el-button class="kp-blank-btn el-icon-delete el-button--default"></el-button>
                </div>
                <el-input placeholder="Please input" v-model="input2">
                  <template slot="append">FIND NER</template>
                </el-input>
                <div class="kp-ner-tag-wrap">
                  <p class="m-7">NER</p>
                  <span>O : S</span> <span>undefined : undefined</span>
                </div>
            </div>

             <div class="kp-form-input-1 kp-form-input-template kp-form-field">
                <div class="kp-form-field-label kp-command-title">Command 1  
                  <el-button class="kp-blank-btn el-icon-delete el-button--default"></el-button>
                </div>
                <el-input placeholder="Please input" v-model="input2">
                  <template slot="append">FIND NER</template>
                </el-input>
                <div class="kp-ner-tag-wrap">
                  <p class="m-7">NER</p>
                  <span>O : S</span> <span>undefined : undefined</span>
                </div>
            </div>

             <div class="kp-form-input-1 kp-form-input-template kp-form-field">
                <div class="kp-form-field-label kp-command-title">Command 1  
                  <el-button class="kp-blank-btn el-icon-delete el-button--default"></el-button>
                </div>
                <el-input placeholder="Please input" v-model="input2">
                  <template slot="append">FIND NER</template>
                </el-input>
                <div class="kp-ner-tag-wrap">
                  <p class="m-7">NER</p>
                  <span>O : S</span> <span>undefined : undefined</span>
                </div>
            </div>

             <div class="kp-form-input-1 kp-form-input-template kp-form-field">
                <div class="kp-form-field-label kp-command-title">Command 1  
                  <el-button class="kp-blank-btn el-icon-delete el-button--default"></el-button>
                </div>
                <el-input placeholder="Please input" v-model="input2">
                  <template slot="append">FIND NER</template>
                </el-input>
                <div class="kp-ner-tag-wrap">
                  <p class="m-7">NER</p>
                  <span>O : S</span> <span>undefined : undefined</span>
                </div>
            </div>
            </div> <!-- end inner -->
             <div class="kp-addbtn-wrap">
              <el-button class="kp-btn-form-outline">+ Add Another Command</el-button>
            </div>
          </div> <!-- left site end -->

          <!-- right site -->
          <div class="right-col" :span="10">
              <!--  inner -->
            <div class="kp-inner">
              <p class="kp-title-ner mb-10">NER / Command 1</p>
              <el-row :gutter="10">
                <el-col :span="12">
                  <div class="kp-form-input-1 kp-form-input-template kp-form-field">
                    <el-input placeholder="Please input" v-model="input2"></el-input>
                  </div>
                </el-col>
                <el-col :span="12">
                    <div class="kp-form-select-1 kp-form-field">
                      <el-select v-model="value" placeholder="Select">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                </el-col>
              </el-row>
               <el-row :gutter="10">
                <el-col :span="12">
                  <div class="kp-form-input-1 kp-form-input-template kp-form-field">
                    <el-input placeholder="Please input" v-model="input2"></el-input>
                  </div>
                </el-col>
                <el-col :span="12">
                   <div class="kp-form-select-1 kp-form-field">
                      <el-select v-model="value" placeholder="Select">
                        <el-option
                          v-for="item in options"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                    </div>
                    
                </el-col>
              </el-row>
              </div> <!-- end inner -->
              <div class="kp-addbtn-wrap">
                <el-button class="kp-btn-form-outline">+ Add Tag</el-button>
              </div>
          </div><!-- end right site -->
            
    </div>

  </div><!-- end NER Model page -->
    

    <!-- service configuration -->

        <div class="kp-form-panel kp-toolbar-filter">
         
         <!-- kp-attribute-wrap -->
          <div class="kp-attribute-wrap">
              <div class="kp-title">
                <el-row >
                  <el-col :span="18">
                    <span>Attribute 1</span> 
                  </el-col>
                  <el-col :span="4">
                    <el-button class="kp-blank-btn el-icon-minus el-button--default"></el-button>
                    <el-button class="kp-blank-btn el-icon-delete el-button--default"></el-button>
                  </el-col>
                </el-row>
              </div>
              <el-row :gutter="72">
                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <div class="kp-form-field-label">Field Label</div>

                    <el-input placeholder="Please input" v-model="input"></el-input>
                  </div>

                  <div class="kp-form-select-1 kp-form-field">
                    <div class="kp-form-field-label">Field Label</div>

                    <el-select v-model="value" placeholder="Select">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>

                </el-col>

                <el-col :span="8">
                  <div class="kp-form-input-1 kp-form-field">
                    <div class="kp-form-field-label">Field Label</div>

                    <el-input placeholder="Please input" v-model="input"></el-input>
                  </div>

                  <div class="kp-form-select-1 kp-form-field">
                    <div class="kp-form-field-label">Field Label</div>

                    <el-select v-model="value" placeholder="Select">
                      <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </el-col>
              </el-row>
            </div> <!-- kp-attribute-wrap -->

             <!-- kp-attribute-wrap -->
          <div class="kp-attribute-wrap">
              <div class="kp-title">
                <el-row >
                  <el-col :span="18">
                    <span>Attribute 2</span> 
                  </el-col>
                  <el-col :span="4">
                    <el-button class="kp-blank-btn el-icon-minus el-button--default"></el-button>
                    <el-button class="kp-blank-btn el-icon-delete el-button--default"></el-button>
                  </el-col>
                </el-row>
              </div>
             
            </div> <!-- kp-attribute-wrap -->

                  <el-button
                    style="display: block; margin-top:32px;"
                    class="kp-btn-form-outline"
                  >+ Add Attribute</el-button>
        </div><!-- end service configuration -->

    

    <!-- qna page start -->
    <div class="kp-qna-model-wrap">

      <el-row :gutter="20" class="kp-header">
        <el-col :span="8">Questions</el-col>
        <el-col :span="10">Response</el-col>
        <el-col :span="5">Buttons</el-col>
        <el-col :span="1"></el-col>
      </el-row>

      <el-row :gutter="20" class="kp-dada-wrap">
        <el-col :span="8" class="kp-question-wrap">
            <div class="kp-question">
                How do i look a demo for kanverse?
                <i class="el-icon-edit"></i>
                <i class="el-icon-circle-close"></i>
            </div>
            <div class="kp-form-input-1 kp-form-field">
              <el-input placeholder="Please input" v-model="input5" class="input-with-select kp-add-question">
                <el-button slot="append" icon="el-icon-circle-plus"></el-button>
              </el-input>
            </div>
        </el-col>
        <el-col :span="10">
          <div class="kp-form-input-1 kp-form-field">
            <el-input placeholder="Please input" v-model="input"></el-input>
          </div>
        </el-col>
        <el-col :span="5" class="kp-buttons-wrap">
            <el-dropdown>
              <el-button type="primary">
                Demo Request<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>Action 1</el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
                <el-dropdown-item>Action 4</el-dropdown-item>
                <el-dropdown-item>Action 5</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> 

             <el-dropdown>
              <el-button type="primary">
                Email Jade Global<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>Action 1</el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
                <el-dropdown-item>Action 4</el-dropdown-item>
                <el-dropdown-item>Action 5</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown> 

             <el-button class="kp-btn-form-outline"  @click="dialogTableVisible = true">+ Add Button</el-button>
        </el-col>
        <el-col :span="1">
           <button class="kp-blank-btn el-icon-delete el-button--default"></button>
        </el-col>
      </el-row>

       <!-- qna modal -->
    <el-dialog class="kp-modal-wrap" title="Add Button" :visible.sync="dialogTableVisible">
     <el-row>
       <el-col :span="12">
           <div class="kp-form-input-1 kp-form-field">
              <div class="kp-form-field-label">Display Text</div>
              <el-input placeholder="Schedule a demo" v-model="input"></el-input>
            </div>
      </el-col>
     </el-row>
      <el-row>
      <el-col :span="12">
           <div class="kp-form-input-1 kp-form-field">
              <div class="kp-form-field-label">Text Type</div>
                <el-radio v-model="radio" label="1">NER</el-radio>
                <el-radio v-model="radio" label="2">QnA</el-radio>
            </div>
      </el-col>
     </el-row>
      <el-row>
      <el-col :span="12">
           <div class="kp-form-input-1 kp-form-field">
              <div class="kp-form-field-label">Link to</div>
              <el-input type="textarea" placeholder="Please input" v-model="input"></el-input>
            </div>
      </el-col>
     </el-row>
     <el-row>
       <el-col>
          <el-button class="kp-btn-form-primary" type="primary">Save</el-button>
          <el-button class="kp-btn-form-outline">Cancel</el-button>
          <div class="kp-form-error">* Please check field with errors</div>
      </el-col>
    </el-row>
    </el-dialog>
    <!-- end qna modal -->

    </div>
     <el-button class="kp-btn-form-primary" type="primary">+ Add Question</el-button>
    <!-- end qna page -->

   

      </el-main>
      <!--  Main Ends -->
    </el-container>
  </el-container>
</template>

 

<script>
export default {
  name: "Structure",

  data() {
    return {
      tableData: [
        {
          date: "2016-05-03",

          name: "Tom",

          address: "No. 189, Grove St, Los Angeles"
        },

        {
          date: "2016-05-02",

          name: "Tom",

          address: "No. 189, Grove St, Los Angeles"
        },

        {
          date: "2016-05-04",

          name: "Tom",

          address: "No. 189, Grove St, Los Angeles"
        },

        {
          date: "2016-05-01",

          name: "Tom"
        }
      ],

      options: [
        {
          value: "Option1",

          label: "Option1"
        },

        {
          value: "Option2",

          label: "Option2"
        },

        {
          value: "Option3",

          label: "Option3"
        },

        {
          value: "Option4",

          label: "Option4"
        },

        {
          value: "Option5",

          label: "Option5"
        }
      ],
      dialogTableVisible: false,
      dialogFormVisible: false
    };
  }
};
</script>

 

<style lang="scss">
// Global Components
.layout-container .container .main {
    overflow: auto;
}
// .vertical-nav  {
//     display:none;
// }
//@at-root
// Global 
.el-select {
  width:100%;
}
.el-checkbox__inner {
  width:20px;
  height:20px;
}
.el-checkbox__inner::after  {
  height: 11px;
  left: 7px;
}
// Global 


.kp-page-title {
  font-size: 28px;
  color: #005da6;
  margin: 0;
  display: inline-block;
}

.kp-toolbar-input {
  input {
    border-radius: 28px;
    background-color: #f1f3fb;
    border: none;
  }
}

.kp-form-input-template {
  .el-input-group__append {
    background-color: #a8b4e7;
    color: #ffffff;
  }
}
/* topnav dropdown */
.kp-topnav-select {
  input {
    border-radius: 28px;
    background-color: #f1f3fb;
    border: none;
  }
  .el-input--suffix .el-input__inner {
      background: #E3F5FC;
      border: .5px solid #00A7E0;
      &::placeholder {
        color: #008ABF;
      }
  }

 .el-input .el-select__caret {
  color:#000000;
}

  el-options {
    .el-select-dropdown {
      background-color: #00a7e0;
    }
  }
}
.el-scrollbar {
  background: #E3F5FC;
}
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background: #CCECFE;
  }
/* Topnav dropdown */

.el-dropdown-link {
    i {
        font-size: 18px;
        font-size: 18px;
        border: .5px solid #707070;
        border-radius: 100px;
        padding: 5px;
    }
}

.kp-blank-btn {
  border: none;
  background: transparent;
}

.kp-btn-back {
  background: transparent;
  border-color: #005da6;
  color: #005da6;
  padding: 12px;
}

.kp-back-to-parent {
  margin-bottom: 8px;
  // margin-top: 32px; // Temporary

  .kp-page-title {
    margin-left: 8px;
    vertical-align: middle;
  }
}

// form style 
.kp-form-panel {
  background: #fff;
  padding: 32px;
  border-radius: 7px;
  margin-top: 32px;
  -webkit-box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
  box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
  margin-bottom: 32px;
}


.kp-form-field {
  margin-bottom: 22px;

  input,
  select,
  textarea {
    background: #f5f6fa;
  }
}

.kp-form-field-invalid {
  input,
  select {
    border: 1px solid #ff4343;
  }

  .kp-form-field-invalid-label {
    color: #ff4343;
    font-size: 12px;
    margin-top: 4px;

    &:before {
      content: "* ";
    }
  }
}

.kp-form-field-label {
  color: #77787b;
  font-size: 14px;
  margin-bottom: 8px;
}

.kp-form-field-checkbox1 {
  .el-checkbox__inner {
    width: 22px;
    height: 22px;
    background: #f5f6fa;
  }

  .el-checkbox__label {
    color: #77787b;
  }
}

.kp-btn-form-primary {
  background: #005da6;
  color: #ffffff;
  font-weight: bold;
}

.kp-btn-form-outline {
  background: transparent;
  border-color: #005da6;
  color: #005da6;
}

.kp-btn-form-disabled {
  background: transparent;
  border-color: rgba(0, 93, 166, 0.4);
  color: rgba(0, 93, 166, 0.4);
}

.kp-form-error {
  display: inline-block;
  margin-left: 16px;
  color: #ff4343;
  font-size: 14px;
}
// end form style 

.kp-form-tabs-panel {
  margin-top: 32px;
  margin-bottom: 32px;
  box-shadow: 0 0px 6px 1px rgba(0, 0, 0, 0.1);
  background: transparent;
  border-radius: 7px;
  .el-tabs:not(.el-tabs--border-card) .el-tabs__item:not(.is-active) {
    background: green;
  }
}

.kp-from-actions {
  margin-top: 40px;
}

// Global Ends

/// breadcome style

.el-breadcrumb {
  line-height: 21px;
  .el-breadcrumb__inner.is-link,
  .el-breadcrumb__inner a {
    color: #bcbec0;
    font-weight: 300;
    &:hover {
      color: #000;
    }
  }
  span {
    color: #bcbec0;

    .el-breadcrumb__inner {
      color: #bcbec0 !important;
    }
  }
}

// end breadcome style

// top section

.kp-top-section-container {
  margin-top: 20px;
  .section-labels {
    display: inline-block;
    width: 19%;
    margin: 0 10px 0 0;
    background: #fff;
    box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
    padding: 16px;
    border-radius: 5px;
    &:last-child {
      margin: 0 0px 0 0;
    }
    h2,
    p {
      margin: 0;
    }
    h2 {
      font-weight: normal;
      font-size: 16px;
      color: rgba(33, 33, 33, 0.6);
    }
    p {
      font-weight: bold;
      color: #212121;
      font-size: 28px;
    }
    .label-icon {
      display: inline-block;
      float: right;
      border-radius: 100px;
      padding: 10px;
      font-size: 18px;
    }
    .kp-label-info1 {
      color: #00a7e0;
      background: #e3f5fc;
    }
    .kp-label-info2 {
      color: #006c0a;
      background: #d5ffd8;
    }
    .kp-label-info3 {
      color: #945707;
      background: #ffedd5;
    }
    .kp-label-info4 {
      color: #ee3b3b;
      background: #ffd5d5;
    }
  }
}

// end top section

.kp-table-toolbar {
  margin-top: 26px;
  // padding: 12px;
  border-radius: 10px;
  .kp-btn-primary {
    background: #005da6;
    color: #ffffff;
    i {
      color: #ffffff;
      font-size: 16px;
    }
  }
  .right-block {
    .kp-toolbar-input {
      input {
        border-radius: 28px;
        background-color: #f1f3fb;
        border: none;
      }
    }

    .kp-btn-toolbar {
      border: none;
      color: #00a7e0;
      border: none;
      font-size: 17px;
      margin-left: 0px;
      padding: 10px 10px;
    }
  }
}

.kp-toolbar-filter {
  margin-top: 16px;
}

.kp-main-table {
  margin-top: 32px;
    -webkit-box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
    box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
    border-radius: 7px;
    overflow: hidden;
}

.el-table th {
  background: #f7f7f7;
  color: #00a7e0;
  font-weight: 300;
  vertical-align: top;
}

.kp-table-pagination {
  margin-top: 16px;
}

.el-header {
  h5 {
    font-size: 28px;
    color: #005da6;
    margin: 0;
  }
}

.active {
  background: #00a7e0;
  box-shadow: 0px 0px 8px 4px rgba(0, 0, 0, 0.1);
  color: #fff;
  margin: 0 10px;
  border-radius: 6px;
  i {
    color: #fff;
  }
  &:hover {
    background: #00beff;
  }
}

// Sidebar

el-menu-item {
  font-weight: bold;
  color: #212121;
}




// Tabs Style
.kp-tabs {
    .el-tabs--card > .el-tabs__header {
        background: transparent;
        margin: 0;
        border: 0;
    }
    .kp-form-tabs-panel{
        background:transparent;
    }
    .el-tabs__content {
        background: #ffffff;
         box-shadow: 0 0px 11px rgba(0, 0, 0, 0.1);
         border-radius: 0 7px 7px 7px;
         padding:20px;
    }
    .el-tabs__nav {
        padding-top: 10px;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item {
        margin-right: 5px;
        border-radius: 10px 10px 0 0;
        border:0;
        box-shadow: 0 0px 11px rgba(0, 0, 0, 0.1);
        background: #ffffff;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border:0;
    }
    .kp-form-tabs-panel {
        box-shadow: none;
    }
    .el-tabs:not(.el-tabs--border-card) .el-tabs__item:not(.is-active) {
        color: #00A7E0;
        background: #F7F7F7;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
        font-weight: bold;
        color: #00A7E0;
    }
}
// end tabs style

// add suggestion  style
.add-suggestion-wrap {
  .object-name-wrap {
    .el-row {
      border-bottom: .5px solid rgba(0, 0, 0, 0.2);
      margin-left: -32px !important;
      margin-right: -32px !important; 
      margin-bottom: 10pxl
    }
  }

  h4 {
    padding-left: 34px;
    margin: 10px 0;
    font-size: 14px;
  }
  .el-icon-delete {
    padding:5px;
  }
}
// end add suggestion style



// Ner Model style
.kp-command-wrap {
 background: #fff;
  padding: 32px;
  border-radius: 7px;
  margin-top: 32px;
  -webkit-box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
  box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
  margin-bottom: 32px;

  .kp-addbtn-wrap {
    background: #ffffff;
    padding:15px 30px;
    width: 100%;
  }
  .left-col {
     
      width: 59.3%;
      display: inline-block;
       .kp-form-field { 
         margin-bottom: 40px;
       }
  }
  .right-col {
      background: #F7F7F7;
      display: inline-block;
      width: 40%;
      .kp-title-ner {
            font-weight: 700;
          color: #212121;
          font-size: 14px;
          margin: 0;
          margin-bottom: 10px;
      }
       .kp-addbtn-wrap {
          background: transparent !important;
        }
  }
    .left-col, .right-col {
     position: relative;
     .kp-inner {
      height: 300px;
      overflow-x: hidden;
      padding:32px 32px 0px 32px !important;
      overflow-y: auto;
     }
      .kp-ner-tag-wrap {
      padding: 0 0 0 16px;
      border-left: 1px dashed #CBCBCB;
      color: #77787B;
      p {
        font-size: 14px;
        font-style: italic;
        font-weight: 300;
      }
      span {
        font-size: 14px;
        font-weight: 300;
        background: #F5F6FA;
        border:.5px solid #EBEBEB;
        padding: 5px;
        border-radius: 5px;
      }
    }
    }
    .kp-form-field {
        .kp-command-title {
          font-weight: 700;
          color:#212121;
          clear: both;
          position: relative;
          &::after {
           content: "";
            position: absolute;
            height: .5px;
            width: 65%;
            top: 9px;
            left: 90px;
            background: #A8A8A8;
          }
          .el-icon-delete {
            float: right;
            padding: 7px;
            margin-top: -5px;
          }
        }
    }
}// end ner model style


// service configuration 
.kp-attribute-wrap {
  .kp-title {
    background:#FAFAFA;
    border-top:.5px solid rgba(196,196,196,.5);
    border-bottom:.5px solid rgba(196,196,196,.5);
    margin-bottom: 16px;
      span {
        font-weight:700;
         font-size:14px;
         display: inline-block;
         padding: 10px;
        
      }
    button {
      display: inline-block;
      padding:12px 8px;
      margin:0;
    }
  }
}
// end ner model



// qna style 
.kp-qna-model-wrap {
  -webkit-box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
  box-shadow: 0 0px 11px rgba(0, 0, 0, 0.02);
  background:#ffffff;
  border-radius: 7px;
  overflow: hidden;
  margin-bottom: 30px;
    .kp-header {
      background: #F7F7F7;
      padding: 20px 36px;
      color:#00A7E0;
    }
    .kp-dada-wrap {
       padding: 20px 36px;
    }
    .kp-question-wrap {
      .kp-question {
        border: 1px solid #dcdfe6;
        border-radius: 5px;
        padding:9px;
        position: relative;
        margin-bottom: 16px;
        padding-right: 65px;
          .el-icon-circle-close {
            position:absolute;
            right: 10px;
            top:16px;
            color:#00A7E0;
          }
          .el-icon-edit {
            position:absolute;
            right: 36px;
            top:16px;
            color:#00A7E0;
          }
      }
      .kp-add-question {
        .el-input-group__append {
          padding:9px;
        }
        .el-icon-circle-plus {
          color:#00A7E0;
          font-size: 16px;
        }
      }
    
    }
    .kp-buttons-wrap {
      .el-dropdown {
        width:100%;
        margin-bottom: 10px;
      }
      .el-button {
          width:100%;
        }
    }
    .el-icon-delete {
      color:#00A7E0;
    }
      .el-dialog__header .el-dialog__title {
       font-size: 16px;
        color: #1B3668;
        padding: 12px;
      }
    .el-radio__label {
      font-weight: 700;
    }

}// end qna style

</style>