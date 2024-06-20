<template>
    <el-dialog title="AdvanceSearch" :visible.sync="showAdvanceSearchDialog" width="fit-content" class="advance-search-modal">
        <p class="advance-search-title-filter">
            <el-button round text class="advance-search-back" size="small" @click="closeDialog">
                <i class="mdi mdi-close"></i>
            </el-button>
        </p>

        <el-divider class="custom-filter-title" content-position="left">Advance Search</el-divider>

        <div class="filters-container">
            <div class="filters-wrapper">
                <div class="filter-label-wrapper">
                    <div class="my-filter-label">My Filters</div>
                    <el-select
                        ref="select"
                        v-model="selectedMyFilter"
                        placeholder="Select my filter"
                        @change="onMyFilterChange"
                        class="saved-filter-dropdown"
                        size="small"
                        filterable clearable
                    >
                        <el-option
                            v-for="(item, index) in myFilterLabels"
                            :key="item.value"
                            :value="item.value"
                            :label="item.label"
                            class="my-filter-dropdown-option"
                        ></el-option>
                    </el-select>
                </div>

                <div class="filter-label-wrapper">
                    <div class="all-filter-label">Shared Filters</div>
                    <treeselect
                        class="all-filter-dropdown"
                        v-model="selectedSharedFilter"
                        :options="sharedFilterOptions"
                        :disable-branch-nodes="true"
                        :show-count="true"
                        v-on:input="onSharedFilterChange"
                        placeholder="Select shared filter"
                        :max-height="150"
                    >
                        <!-- <div slot="option-label" slot-scope="{ node }">
                            <el-tooltip :content="node.label" placement="right">
                                <span>{{ getNodeLabel(node) }}</span>
                            </el-tooltip>
                        </div> -->
                    </treeselect>
                </div>
            </div>
        </div>

        <el-divider/>

        <div class="query-builder-wrapper">
            <QueryBuilder
                cid="notification-rule-form-rule"
                @onQueryChange="onQueryChange"
                :query="form.rule"
                :labels="queryBuilderCustomLabels"
                :documentType="form.document_type"
                :dataToShow='["fieldsData", "whoColumnsData", "assignmentData", "stageData"]'
                :additionalFilter="additionalQueryBuilderFilter"
                :listViewColumns="listViewColumns"
                :additionalFields="additionalFields"
                :additionalOperators="additionalOperators">
            </QueryBuilder>
        </div>

        <el-dialog
            title="New Filter"
            width="fit-content"
            :visible.sync="isSaveFilterClicked"
            :append-to-body="true"
            :close-on-click-modal="false"
            custom-class="new-filter-popup"
        >

        <el-divider class="create-filter-title" content-position="left">New Filter</el-divider>
            <div class="filter-content">
                <div class="filter-row">
                    <div class="filter-label">Name<span class="mandatory"> *</span></div>
                    <div class="filter-input">
                        <el-input
                            v-model="enteredFilterName"
                            placeholder="Enter filter name..."
                            @change="validateName">
                        </el-input>
                    </div>
                </div>
                <div>
                    <div class="filter-label">Folder<span class="mandatory"> *</span></div>
                    <div class="filter-input">
                        <el-select v-model="selectedFolder" placeholder="Select folder" @blur="validateFolder">
                            <el-option label="My Filter" value="myFilter"><i class="mdi mdi-folder" style="color: rgba(90, 103, 216)"></i> My Filter</el-option>
                            <el-option label="Shared Filter" value="sharedFilter"><i class="mdi mdi-folder" style="color: rgba(90, 103, 216)"></i> Shared Filter</el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="save-filter-dialog-footer">
                <el-button size="small" @click="hideSaveFilterDialog">Cancel</el-button>
                <el-button size="small" type="primary" :disabled="validateName" @click="createFilter">Save</el-button>
            </div>
        </el-dialog>


        <footer class="dialog-footer">

            <el-button
                size="small"
                @click="clearFilter"
            ><i class="mdi mdi-cancel"></i> Reset</el-button>
            
            <el-button
                v-if="selectedMyFilter"
                size="small"
                type="primary"
                @click="shareFilter"
            ><i class="mdi mdi-share-variant"></i> Share</el-button>

            <el-button
                v-if="selectedSharedFilter || selectedMyFilter"
                size="small"
                type="primary"
                @click="deleteSelectedFilter"
            ><i class="mdi mdi-delete"></i> Delete</el-button>

            <el-button
                v-if="selectedSharedFilter || selectedMyFilter"
                size="small"
                type="primary"
                @click="updateFilter"
            ><i class="mdi mdi-sync"></i> Update</el-button>
                        
            <el-button
                v-if="!(selectedSharedFilter || selectedMyFilter)"
                size="small"
                type="primary"
                @click="showSaveFilterDialog"
                :disabled="hasNotSelectedChildren"
            ><i class="mdi mdi-content-save"></i> Save</el-button>
                        
            <el-button
                size="small"
                type="primary"
                @click="onSearch"
                :disabled="hasNotSelectedChildren"
            ><i class="mdi mdi-magnify"></i> Search</el-button>
        
        </footer>

    </el-dialog>
</template>

<script>

import {mapState} from 'vuex';
import EventBus from "@/EventBus";
import Treeselect from "@riophae/vue-treeselect";
import QueryBuilder from "@/idp/pages/QueryBuilder.vue";
import UserPreferenceService from "@/idp/services/UserPreferenceService";

export default {
    name: 'AdvanceSearchDialog',
    props: ["advanceSearchEventName", "docType", "listViewColumns"],
    components: {
        QueryBuilder,
        Treeselect
    },
    data() {
        return {
            form: {
                name: "",
                rule: { logicalOperator: "all", children: [] },
                document_type: this.docType,
            },
            enteredFilterName: "",
            additionalQueryBuilderFilter: {
                fields: {
                    field_type: {$in: ["header", "table"]},
                    move_to_document: true
                }
            },
            isSaveFilterClicked: false,
            selectedMyFilter: "",
            selectedSharedFilter: null,
            sharedFilterOptions: [],
            sharedFilters: [],
            myFilters: [],
            myFilterLabels: [],
            savedAdvanceFilters: [],
            hasNotSelectedChildren: true,
            showNameError: false,
            showFolderError: false,
            selectedFolder: "myFilter",
            queryBuilderCustomLabels: {
                matchType: "Match Type",
                matchTypes: [
                    { id: "all", label: "All should match" },
                    { id: "any", label: "Atleast one should match" },
                ],
                addRule: "Add Condition",
                removeRule: "&times;",
                addGroup: "Add Group",
                removeGroup: "&times;",
                textInputPlaceholder: "value",
            },
            additionalFields: [
                {
                    type: "text",
                    inputType: "text",
                    operators: ["True", "False"],
                    id: "has_errors",
                    label: "Has Errors"
                }
            ],
            additionalOperators: {
                TEXT: ["begins with (in)", "begins with (range)"],
                CURRENCY: []
            }
        }
    },
    computed: {
        ...mapState({
            showAdvanceSearchDialog: "showAdvanceSearchDialog",
            currentAdvanceFilter: "currentAdvanceFilter"
        }),

        validateName() {
            return this.enteredFilterName.trim() === '';
        }

    },    
    methods: {
        getNodeLabel(node){
            return node.label;
        },
        // Function to recursively scroll to the last added element (group or rule)
        scrollToLatestElement(element) {
            if (element) {
                // Get all groups and rules within the current element
                let elements = Array.from(element.querySelectorAll('.vqb-group, .vqb-rule'));
                //find last Element added (group/rule)
                let lastElement = elements[elements.length - 1];
                // Scroll to the last element
                lastElement && lastElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
                
            }
        },
        // Function to scroll to the current position after the DOM has been updated
        scrollToCurrentPosition() {
            this.$nextTick(() => {
                // Select the query builder element
                let queryBuilder = document.querySelector('.vue-query-builder');
                this.scrollToLatestElement(queryBuilder);
            });
        },

        validateFolder() {
            this.showFolderError = this.selectedFolder.trim() === '';
        },

        hideSaveFilterDialog() {
            this.isSaveFilterClicked = false;
        },

        showSaveFilterDialog() {
            this.enteredFilterName = "";
            this.isSaveFilterClicked = true;
        },

        clearFilter() {
            this.form.name = null;
            this.form.rule = { logicalOperator: "all", children: [] };
            this.selectedMyFilter = "";
            this.selectedSharedFilter = null;
        },

        /**
         * Handles the change event when a my filter is selected.
         * @param {string} filterName - The name of the selected my filter.
         */
        onMyFilterChange(filterName) {
            this.isSaveFilterClicked = false;

            // If no filter name is provided, reset the selected my filter and form rule
            if (!filterName) {
                this.selectedMyFilter = "";
                this.form.rule = { logicalOperator: "all", children: [] };
                return;
            }

            // If a my filter is selected while a shared filter is already selected, show an error message
            if (this.selectedSharedFilter) {
                this.selectedMyFilter = "";
                this.notifyError("Please clear shared filter before selecting my filter");
                return;
            }

            // Find the saved query corresponding to the selected my filter name
            const savedQuery = this.myFilters.find(query => query.name === filterName);

            // If a saved query is found, update the form data and selected my filter
            if (!_.isEmpty(_.get(savedQuery, "query"))) {
                this.form = _.cloneDeep(savedQuery);
                this.form.rule = savedQuery.query;
                this.selectedMyFilter = filterName;
            }
        },

        /**
         * Handles the change event when a shared filter is selected.
         * @param {string} filterName - The name of the selected shared filter.
         */
        onSharedFilterChange(filterName) {
            // Hide the my filter dropdown list
            if (_.get(this.$refs, 'select.visible')) {
               this.$refs.select.visible = false;
            }
            
            this.isSaveFilterClicked = false;
            
            // If no filter name is provided, reset the selected shared filter and form rule
            if (!filterName) {
                this.selectedSharedFilter = null;
                !this.selectedMyFilter ? this.form.rule = { logicalOperator: "all", children: [] } : null;
                return;
            }

            // If a shared filter is selected while a my filter is already selected, show an error message
            if (this.selectedMyFilter) {
                this.selectedSharedFilter = "";
                this.notifyError("Please clear my filter before selecting shared filter");
                return;
            }

            // Find the saved query corresponding to the selected shared filter name
            const savedQuery = this.sharedFilters.find(query => query.name === filterName);

            // If a saved query is found, update the form data and selected shared filter
            if (!_.isEmpty(_.get(savedQuery, "query"))) {
                this.form = _.cloneDeep(savedQuery);
                this.form.rule = savedQuery.query;
                this.selectedSharedFilter = filterName;
            }
        },

        /**
         * Creates a new filter based on the entered filter name, selected folder, and form data.
         * Displays an error message if the filter name already exists.
         */
        async createFilter() {
            // Determine the filter name to be used
            const filterName = this.enteredFilterName || this.selectedMyFilter || this.selectedSharedFilter;

            if (!filterName) { return; }

            // Check if the filter name already exists
            const filterNameAlreadyExists = this.verifyIfFilterNameExists(filterName);
            if (filterNameAlreadyExists) {
                this.notifyError(`Filter name '${filterName}' already exists`);
                return;
            }

            // Disable save button after user clicks on save, to prevent multiple clicks
            const enteredFilterName = _.cloneDeep(this.enteredFilterName);
            this.enteredFilterName = "";

            // Prepare the form data for creating the filter
            delete this.form._id;
            this.form.name = enteredFilterName;
            this.form.query = this.form.rule;
            this.form.document_type = this.docType;
            this.form.user_id = this.$store.state.user.id;
            this.form.shared = this.selectedFolder === "sharedFilter" ? true : false;

            // Call the API to create the filter
            const response = await UserPreferenceService.upsertAdvanceSearchQuery(this.form);
            if (response.status == 200 || response.status == 201) {
                this.form._id = _.get(response, "data._id");
                if (this.selectedFolder === "sharedFilter") {
                    const formData = _.cloneDeep(this.form);
                    this.sharedFilters.push(formData);
                    // Find the index of the 'my_shared_filters' option
                    const index = this.sharedFilterOptions.findIndex(option => option.value === 'my_shared_filters');
                    // Add a new child to the children array of the 'my_shared_filters' option
                    this.sharedFilterOptions[index].children.push({ 
                        id: enteredFilterName,
                        value: enteredFilterName,
                        label: _.startCase(enteredFilterName)
                    });

                    // Add shared filter in my filters dropdown
                    this.myFilters.push(formData);
                    const label = `${_.startCase(enteredFilterName)} (Shared)`;
                    this.myFilterLabels.push({ value: enteredFilterName, label: label });

                } else {
                    const formData = _.cloneDeep(this.form);
                    this.myFilters.push(formData);
                    this.myFilterLabels.push({ value: enteredFilterName, label: _.startCase(enteredFilterName) });
                }
                this.notifySuccess("Advance filter created successfully");
            } else {
                this.notifyError("Error while creating filter");
                console.log(response);
            }

            // Close the dialog after creating the filter
            this.closeDialog();
        },

        shareFilter() {
            // In case if user tried to share a already shared filter.
            if(_.get(this.form, "shared")) {
                this.$notify({
                    title: "Warning",
                    message: "Filter already shared",
                    type: "warning",
                });
                return;
            }

            this.$confirm(
                `Are you sure you want to share this filter?`,
                "Confirmation",
                {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning",
                    customClass: "update-filter-confirmation-box"
                }
            ).then(async () => {
                try {
                    const filterName = this.selectedMyFilter;

                    const myFilterIndex = this.myFilters.findIndex(filter => _.get(filter, "name", "") === filterName);
                    if (myFilterIndex == -1) { return; }

                    // Clone the filter from my filters which we are going to add in shared filters array.
                    const clonedFilter = _.cloneDeep(this.myFilters[myFilterIndex]);
                    // Set the shared flag as true
                    clonedFilter.shared = true;

                    // Update the filter
                    const response = await UserPreferenceService.upsertAdvanceSearchQuery(clonedFilter);
                    if (response.status == 200 || response.status == 201) {
                        // Find the selected filter options from my filter labels which we are showing on dropdown.
                        const filterLabelIndex = this.myFilterLabels.findIndex(option => _.get(option, "value", "") === filterName);
                        this.myFilterLabels[filterLabelIndex].label = `${_.startCase(filterName)} (Shared)`;
                        this.myFilters[myFilterIndex]["shared"] = true;
                        
                        // Add the my filter in shared filter
                        this.sharedFilters.push(clonedFilter);
                        const index = this.sharedFilterOptions.findIndex(option => option.value === 'my_shared_filters');
                        this.sharedFilterOptions[index].children.push({
                            id: filterName,
                            value: filterName,
                            label: _.startCase(filterName)
                        });
                        
                        this.notifySuccess("Filter shared successfully");
                        this.clearFilter();
                    }
                    else {
                        this.notifyError("Error while sharing filter");
                        console.log(response);
                    }
                } catch (error) {
                    console.log("Error:", error);
                    this.notifyError("Error while sharing filter");
                }
            }).catch(() => {
                // Handle cancel action here if needed
            });
        },

        /**
         * Updates the filter based on the current form data.
         */
         async updateFilter() {
            // Do not allow user to modify/update other shared filters
            if (this.isOtherSharedFilterSelected(this.selectedSharedFilter)) {
                this.notifyError("You can't update filters created by others");
                return;
            }

            this.$confirm(
                `Are you sure you want to update this filter?`,
                "Confirmation",
                {
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                    type: "warning",
                    customClass: "update-filter-confirmation-box"
                }
            ).then(async () => {
                try {
                    this.form.query = this.form.rule;
                    const response = await UserPreferenceService.upsertAdvanceSearchQuery(this.form);

                    // Check the status of the response and notify success or error accordingly
                    if (response.status === 200 || response.status === 201) {
                        const filterName = _.get(this.form, "name");
                        const isSharedFilter = _.get(this.form, "shared");
                        const targetFilters = isSharedFilter ? this.sharedFilters : this.myFilters;

                        // Find the filter with the given name
                        const updatedFilterIndex = targetFilters.findIndex(filter => _.get(filter, "name", "") === filterName);

                        if (updatedFilterIndex !== -1) {
                            const clonedRule = _.cloneDeep(this.form.rule);
                            targetFilters[updatedFilterIndex].query = clonedRule;
                        }
                        this.notifySuccess("Filter updated successfully");
                    }
                    else {
                        this.notifyError("Error while updating filter");
                        console.log(response);
                    }
                    this.closeDialog();
                } catch (error) {
                    console.error("Error:", error);
                    this.notifyError("Error while updating filter");
                    this.closeDialog();
                }
            }).catch(() => {
                // Handle cancel action here if needed
            });
        },

        /**
         * Checks if the provided filter name exists in the children of the 'other_shared_filters' option.
         * @param {string} filterName - The name of the filter to check.
         * @returns {boolean} - True if the filter name exists in 'other_shared_filters' children, otherwise false.
         */
        isOtherSharedFilterSelected(filterName) {
            // If the filter name is not provided, return false
            if (!filterName) {
                return false; 
            }

            filterName = filterName.toLowerCase();

            // Find the index of the other shared filters option
            const index = this.sharedFilterOptions.findIndex(option => option.value === 'other_shared_filters');

            // If the other shared filters option is found
            if (index !== -1) {
                const children = this.sharedFilterOptions[index].children;
                
                // Find the option with the provided filterName in the children array
                const option = children.find(child => {
                    const value = _.get(child, "value", "");
                    return value !== null && value.toLowerCase() === filterName;
                });
                return !_.isEmpty(option);
            }

            return false;
        },

        /**
         * Verifies if the provided filter name exists in either myFilterLabels or sharedFilterLabels.
         * @param {string} filterName - The filter name to verify.
         * @returns {boolean} - True if the filter name exists, otherwise false.
         */
        verifyIfFilterNameExists(filterName) {
            if (!filterName) { return; }

            filterName = filterName.toLowerCase();

            // Check if the filter name exists in myFilterLabels
            for (const myFilter of this.myFilterLabels) {
                const filterValue = _.get(myFilter, "value", "");
                if (filterValue !== null && filterName === filterValue.toLowerCase()) {
                    return true;
                }
            }

            // Check if the filter name exists in shared Filter Options
            for (const sharedFilterOption of this.sharedFilterOptions) {
                const childrens = sharedFilterOption.children || [];
                
                const option = childrens.find(children => {
                    const value = _.get(children, "value", "");
                    return value !== null && value.toLowerCase() === filterName;
                });

                if (!_.isEmpty(option)) {
                    return true;
                }
            }

            return false;
        },

        onQueryChange(input) {
            if (_.isEmpty(_.get(input, "val.children"))) {
                this.hasNotSelectedChildren = true;
            } 
            else {
                this.hasNotSelectedChildren = false;
            }
            this.scrollToCurrentPosition();
            this.form.rule = input.val;
        },

        onSearch() {
            this.$store.commit("setShowAdvanceSearchDialog", false);
            const filterName = this.form.name ? _.startCase(this.form.name) : "Unsaved filter";
            const advanceFilter = { name: filterName, query: this.form.rule, filterId: _.get(this.form, "_id") };
            EventBus.$emit("advanceSearchQuery__" + this.advanceSearchEventName, advanceFilter);
        },

        closeDialog() {
            this.isSaveFilterClicked = false;
            this.$store.commit("setShowAdvanceSearchDialog", false);
        },

        /**
         * Loads the saved advance filters for the current document type and user Id.
         * @param {string} userId - The ID of the user whose saved advance filters are to be loaded.
         */
        async loadSavedAdvanceFilters(userId) {
            // Retrieve all saved advance filters for the specified user and document type
            try {
                const savedAdvanceQuery = await UserPreferenceService.getAllSavedAdvanceQueryByDocType(this.docType);
                
                // In case of permission issue, display the error to user
                if (typeof savedAdvanceQuery === "object" && _.get(savedAdvanceQuery, "status") == 403) {
                    this.notifyError(savedAdvanceQuery.message);
                    throw new Error(savedAdvanceQuery.message);
                }
                this.savedAdvanceFilters = savedAdvanceQuery;
            } catch(error) {
                console.log(error);
                this.savedAdvanceFilters = [];
            }

            let mySharedFiltersChildren = [];
            let otherSharedFiltersChildren = [];

            for (const savedFilter of this.savedAdvanceFilters) {
                if (!savedFilter.name || savedFilter.name === null) {
                    continue;
                }

                // Check if the saved filter belongs to the current user and is not shared
                if (_.get(savedFilter, "user_id") === userId && !savedFilter.shared) {
                    this.myFilters.push(savedFilter);
                    this.myFilterLabels.push({ value: savedFilter.name, label: _.startCase(savedFilter.name) });
                }

                // Add shared filters in dropdown here
                else if (savedFilter.shared) {
                    this.sharedFilters.push(savedFilter);
                    
                    const option = { id: savedFilter.name, value: savedFilter.name };
                    
                    // If user id of saved filter is same as current user, show it is my shared filter menu
                    if (_.get(savedFilter, "user_id") === userId) {
                        option.label = _.startCase(savedFilter.name);
                        mySharedFiltersChildren.push(option);

                        // Show user shared filters in my filter dropdown also
                        this.myFilters.push(savedFilter);
                        const label = `${_.startCase(savedFilter.name)} (Shared)`;
                        this.myFilterLabels.push({ value: savedFilter.name, label: label });
                    }
                    // else show it in other shared filters menu
                    else {
                        const createdBy = _.get(savedFilter, "created_by", "");
                        const [firstName] = _.split(createdBy, ' ');
                        // Add user name in label in case of other shared filter
                        option.label = `${_.startCase(savedFilter.name)} (${firstName})`;
                        otherSharedFiltersChildren.push(option);
                    }
                }
            }

            // Sort filters by label
            this.myFilterLabels = _.sortBy(this.myFilterLabels, "label");
            mySharedFiltersChildren = _.sortBy(mySharedFiltersChildren, "label");
            otherSharedFiltersChildren = _.sortBy(otherSharedFiltersChildren, "label");

            // Example - [{id: 1, label: 'Parent 1', value: 'parent1', children: [{id: "2", label: 'Child 1', value: 'child1'}]}]
            this.sharedFilterOptions = [
                { id: 1, label: "My Shared Filters", value: "my_shared_filters", children: mySharedFiltersChildren },
                { id: 2, label: "Other Shared Filters", value: "other_shared_filters", children: otherSharedFiltersChildren }
            ];
        },

        /**
         * Sets the form rule and selected filter based on the currentAdvanceFilter.
         */
        setFormRuleAndSelectedFilter() {
            if (_.isEmpty(this.currentAdvanceFilter)) {
                return;
            }
            
            let { filterId, name, filterName, query } = this.currentAdvanceFilter;

            name = name ? name : filterName;

            // If saved filter was searched, keep the filter id and name
            if (filterId) {
                this.form._id = filterId;
                this.form.name = name;
            }
            query = typeof query === "string" ?  JSON.parse(query) : query;
            this.form.rule = query;

            // Find the filter label in myFilterLabels
            const myFilterLabel = _.find(this.myFilterLabels, { value: name });

            // Check if the filter label is found in myFilterLabels
            if (!_.isEmpty(myFilterLabel)) {
                // Set selectedMyFilter to the label value if found in myFilterLabels
                this.selectedMyFilter = myFilterLabel.label;
            } else {
                // If the filter label is not found in myFilterLabels, search in shared Filters
                for (const sharedFilterOption of this.sharedFilterOptions) {
                    const childrens = _.get(sharedFilterOption, "children") || [];
                    const option = childrens.find((child) => {
                        const filterName = _.get(child, "id", "").toLowerCase();
                        return filterName === name.toLowerCase();
                    });
                    if (!_.isEmpty(option)) {
                        this.selectedSharedFilter = option.id;
                        return;
                    }
                }
            }
        },

        /**
		* Function to delete the selected filter
         */
        deleteSelectedFilter() {
            // Check if the selected filter is created by another user
            // If it is, prevent the current user from deleting the record
            if (this.selectedSharedFilter && this.isOtherSharedFilterSelected(this.selectedSharedFilter)) {
                this.notifyError("You can't delete filter created by others");
                return;
            }
            let confirmationMsg = "";
            if(_.get(this.form, "shared")) {
                confirmationMsg = 'This is a shared filter. Are you sure you want to delete it?';
            } else {
                confirmationMsg = 'Are you sure you want to delete this filter?';
            }

            this.$confirm(confirmationMsg, "Confirmation", {
                confirmButtonText: "Confirm",
                cancelButtonText: "Cancel",
                type: "warning",
                customClass: "delete-filter-confirmation-box"
            })
            .then(async () => {
                this.form.active = false;
                // Send request to delete the filter
                const response = await UserPreferenceService.upsertAdvanceSearchQuery(this.form);
                
                // Check if the deletion request was successful
                if (response.status == 200 || response.status == 201) {
                    // Notify user about successful deletion
                    this.notifySuccess("Advance filter deleted successfully");
                    
                    // Reset selected filter variables
                    this.selectedMyFilter = '';
                    this.selectedSharedFilter = null;
                    this.form.rule = { logicalOperator: "all", children: [] };

                    const filterName = _.get(this.form, "name");
                    const isSharedFilter = _.get(this.form, "shared");

                    if (isSharedFilter) {
                        // Update shared filter lists
                        this.sharedFilters = this.sharedFilters.filter(item => item.value !== filterName);
                        const index = this.sharedFilterOptions.findIndex(option => option.value === 'my_shared_filters');
                        this.sharedFilterOptions[index].children = this.sharedFilterOptions[index].children.filter(item => item.value !== filterName);

                        // Remove deleted filter from my filter dropdown
                        this.myFilters = this.myFilters.filter(item => item.value !== filterName);
                        this.myFilterLabels = this.myFilterLabels.filter(item => item.value !== filterName);
                    } else {
                        // Update personal filter lists
                        this.myFilters = this.myFilters.filter(item => item.value !== filterName);
                        this.myFilterLabels = this.myFilterLabels.filter(item => item.value !== filterName);
                    }
                    this.closeDialog();
                } else {
                    this.notifyError("Error while deleting filter");
                    console.log(response);
                }
            });
        }
    },
    async beforeMount() {
        const userId = this.$store.state.user.id;
        // Step 1: Load the saved advance search filter
        await this.loadSavedAdvanceFilters(userId);

        // Step 2: In case if any filter is applied and window is reloaded
        // Set the applied filter on Advance search dialog
        this.setFormRuleAndSelectedFilter();

       
        // Incorporating additional classes into the wrappers of the new-filter-popup
        // and my-filter-dropdown-option elements, as direct access to their HTML code is unavailable. 
        // This adjustment is necessary for fine-tuning the styling and positioning of subsequent popups,
        // including the advance search popup, confirmation box, and new-filter popup.
        this.$nextTick(() => {
            try {
                const newFilterPopup = document.querySelector('.new-filter-popup');
                const newFilterWrapper = newFilterPopup.parentNode;
                var element = document.querySelector('.my-filter-dropdown-option');
                if(element){
                var parent = element.parentNode;
                var grandParent = parent.parentNode;
                grandParent.classList.add('advance-search-filter-option-wrapper');
                }
                newFilterWrapper.classList.add('new-filter-wrapper');   
            } catch(error) {
                console.log(error);
            }
        })
    }
}
</script>

<style lang="scss">
@import "../_idpVariables";
@import "../_idpGlobal";

.advance-search-modal{
    display: flex;
    align-items: center;
    justify-content: center;

    .vqb-children{
       max-height: 240px;
       overflow-y: auto;
    }
    

    .el-dialog__header {
        padding: 15px;
    }
    .el-dialog {
      padding: 2.8rem;
      margin-top: 0px !important;
      margin-bottom: 17vh !important;
    }
} 

 .new-filter-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
 }

.new-filter-popup{
    padding: 1rem 2.8rem 2.8rem 2.8rem !important;
    margin-top: 0px !important;
}

.advance-search-title-filter {
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
    margin: 0 0 -2rem 0;
    font-style: normal;
    font-weight: 600;
    font-size: 1.286rem;
    line-height: 27px;
    letter-spacing: 0.01em;
    color: var(--dark-02);
    position: relative;
}

.advance-search-back {
    position: absolute;
    border: 0;
    color: var(--dark-03);
    font-size: 1.2rem;
    vertical-align: text-top;
    // padding: 0 .7rem 0 .4rem;
    padding: 0 !important;
    right: -10px;
    top: -10px;
    z-index: 9999;
    transition: .15s all ease-in-out;
    transform-origin: center center;
    background: var(--dark-08);
    width: 25px;
    height: 25px;

    &:hover {
        background: transparent !important;
        transform: scale(1.2);
  }
}

.custom-filter-title, .create-filter-title {
    width: 97% !important;
    .el-divider__text{
        margin-bottom: 1.5rem;
        font-weight: 600;
    }
}

.create-filter-title {
    margin-bottom: 14px;
    font-size: 14px;
    font-weight: bold;
}

.query-builder-wrapper {
    margin-top: 20px;
}

.dialog-footer {
    margin-top: 20px;
    text-align: right;
    border-top: 1px solid #dcdfe6;
    padding-top: 1rem;
}

.save-filter-dialog-footer {
    margin-top: 20px;
    text-align: right;
}

.filters-wrapper {
  display: flex;
  align-items: center;
  gap: 8rem;
}

.filter-label-wrapper{
    display: flex;
    align-items: center;
}

.all-filter-label {
  font-size: 1rem;
}

.my-filter-label{
    font-size: 1rem;
}

.saved-filter-dropdown,
.all-filter-dropdown {
  width: 250px; /* Set the width of the dropdowns */
  margin-left: 20px
}

.saved-filter-dropdown{
    .el-input__inner{
        // height: 26px;
        border: 1px solid var(--dark-04);
    }

    .el-input__inner::placeholder{
        color: var(--dark-04);
    }

    .el-input .el-select__caret{
        color: var(--dark-04);
    }
}

.all-filter-dropdown{
    .vue-treeselect__placeholder {
        // display: flex;
        // align-items: center;
        color: var(--dark-04);
    }

    .vue-treeselect__placeholder{
        font-size: 13px !important;
    }

    .vue-treeselect__control{
        // height: 26px;
        border: 1px solid var(--dark-04);

    }
}

.mandatory {
    color: red;
    font-size: 12px;
}

.filter-row{
    margin-bottom: 2.4rem;
}

.filter-input{
    width: 32rem;
}

.advance-search-filter-option-wrapper{
    max-height: 150px !important;
}

.update-filter-confirmation-box, .new-filter-popup, .delete-filter-confirmation-box{
    margin-bottom: 17vh;
}

</style>