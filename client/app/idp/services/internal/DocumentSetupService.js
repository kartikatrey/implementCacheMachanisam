export default class DocumentSetupService {
    //check if dynamic tabs list is empty or not
    static isEmptyDynamicTabsList(selectedTabs) {
        let isEmptyList = true;
        if (selectedTabs && selectedTabs.length >= 1) {
            isEmptyList = false
        }
        return isEmptyList;
    };

    static getTabValue(allTabsList,tab){
        return allTabsList.find(item => item.label == tab).value;
    };

    /**
    In getDestinationTabs(),
    We are adding 'order','value' both keys in slushbucket data as they were required for list view
    Also removing 'name' key from sluckbucket data as no further required
    Now the stages which are visible in list view will be stored in db like this-
    {
        "label" : "Inbox",
        "code"  : "Inbox",
        "value" : "Uploaded", //This will be stage/state value
        "order" :  0
    }
    */
    static getDestinationTabs(allTabsList, slushBucketDestination) {
        if (slushBucketDestination && slushBucketDestination.length) {
            for (let index = 0; index < slushBucketDestination.length; index++) {
                delete slushBucketDestination[index]['name'];
                slushBucketDestination[index].value = this.getTabValue(allTabsList, slushBucketDestination[index].label)
                slushBucketDestination[index].order = index;
            }
        }
        return slushBucketDestination;
    };

    //prepare selection fields for slushbucket
    static prepareSelectionFields(allFields, selectedFields = []) {
        const headerFields = {
            source: [],
            destination: [],
        };

        const prepareBucketField = (field) => {
            return {
                name: field.label + "".substring(0, 30),
                label: field.label,
                code: "" + field._id,
                width: field.list_view_column_width
            };
        };
        const isSelectedField = (field) => {
            return selectedFields.find(item => item == field._id);
        };
        const addField = (field) => {
            if (!field || !field._id) {
                return;
            }
            const fieldKey = isSelectedField(field) ? "destination" : "source";
            headerFields[fieldKey].push(prepareBucketField(field));
        };
        allFields.map(addField);
        return headerFields;
    };
    
    
    /**
     * Purpose - Prepare tabs options for a source-destination configuration
     * This function takes an array of all available tabs and an optional array of selected tabs
     * It organizes the tabs into source and destination groups
     * and sorts the destination tabs based on their order
     *
     * @param {Array} allTabs - An array of all available tabs
     * @param {Array} selectedTabs - An optional array of selected tabs
     * @returns {Object} - An object containing source and destination tab arrays
    */
    static prepareSourceDestinationTabs (allTabs, selectedTabs = []) {
        // Initialize source and destination tabs objects.
        const tabs = {
            source: [],
            destination: [],
        };

        // Function to prepare tab data
        const prepareTabData = (tab) => {
            return {
                name: tab.label.substring(0, 30),
                label: tab.label,
                code: "" + tab._id,
                width: tab.list_view_column_width,
                order: tab.order
            };
        };
        // Function to check if a tab is selected or not
        const isTabSelected = (tab) => {
            return selectedTabs.find(item => item.code == tab._id);
        };
        // Function to add a tab to the appropriate group
        const addTab = (tab) => {
            let tabKey = '';
            if (!tab || !tab._id) {
                return;
            }
            let tabData = isTabSelected(tab)
            if (tabData) {
                tabKey = "destination";
                tab["order"] = tabData.order;
            } else {
                tabKey = "source";
                tab["order"] = -1;
            }
            tabs[tabKey].push(prepareTabData(tab));
        };
        allTabs.map(addTab);
        //Sort destination tabs based on order
        tabs["destination"].sort((a, b) => a.order - b.order)
        return tabs;
    };

    //prepare data for slushbucket of dynamic tabs
    static prepareDynamicTabsSlushBucketData(allTabsList, selectedTabsList) {
        let tabsList = []
        for (let index = 0; index < allTabsList.length; index++) {
            tabsList.push({
                _id: allTabsList[index].label.replace(/ /g, "_"),
                label: allTabsList[index].label,
                value: allTabsList[index].value
            })
        }
       
        //Prepare slushBucketData for tabs
        const slushBucketData = this.prepareSourceDestinationTabs (tabsList, selectedTabsList);
        return slushBucketData;
    };
}
