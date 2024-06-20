import _ from "lodash";
import moment from "moment";

export default {
    namespaced: true,
    state: {
        orgHierarchy:"",
        currentDashboard:"",
        defaultDateFilter:  {
            created_at: {
                $gte: moment().subtract(30, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                $lte: moment().endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            }
        },
        isDashboardLoaded:false,
        dashboardComponentStatus:{},
        error_analytics: {
            entityValuesList: []
        },
        headerFilters: {
            operations:{
                dateFilter:"",
                dateFilterName:"",
                document_type:"",
                file_type:[],
                business_unit:"",
                org:"",
                selectedVendors:[]
            },
            fraud_analytics:{
                dateFilter:"",
                dateFilterName:"",
                document_type:"",
                file_type:[],
                business_unit:"",
                org:"",
            },
            error_analytics:{
                dateFilter:"",
                dateFilterName:"",
                document_type:"",
                business_unit:"",
                org:""
            },
            vendor: {
                dateFilter:"",
                dateFilterName:"",
                document_type:"",
                file_type:[],
                business_unit:"",
                org:"",
            }
        },
    },
    actions: {
    },
    mutations: {
        setCurrentDashboard(state,value){
            state.currentDashboard = value;
        },
        // vendor methods
        setVendorDocType(state,value){
            state.headerFilters.vendor.document_type = value;
        },
        setVendorDateFilterName(state,value){
            state.headerFilters.vendor.dateFilterName = value;
        },
        setVendorDateFilter(state,value){
            state.headerFilters.vendor.dateFilter = value;
        },
        // operations methods
        setOperationsDocType(state,value){
            state.headerFilters.operations.document_type = value;
        },
        setOperationsFileType(state,value){
            state.headerFilters.operations.file_type = value;
        },
        setOperationsBusinessUnit(state,value){
            state.headerFilters.operations.business_unit = value;
        },
        setOperationsOrg(state,value){
            state.headerFilters.operations.org = value;
        },
        setOperationsDateFilterName(state,value){
            state.headerFilters.operations.dateFilterName = value;
        },
        setOperationsDateFilter(state,value){
            state.headerFilters.operations.dateFilter = value;
        },
        setOperationsVendorNames(state,value){
            state.headerFilters.operations.selectedVendors = value;
        },
        // fraud_analytics methods
        setFraudDateFilterName(state,value){
            state.headerFilters.fraud_analytics.dateFilterName = value;
        },
        setFraudDateFilter(state,value){
            state.headerFilters.fraud_analytics.dateFilter = value;
        },
        setFraudDocType(state,value){
            state.headerFilters.fraud_analytics.document_type = value;
        },
        setFraudFileType(state,value){
            state.headerFilters.fraud_analytics.file_type = value;
        },
        setFraudBusinessUnit(state,value){
            state.headerFilters.fraud_analytics.business_unit = value;
        },
        setFraudOrg(state,value){
            state.headerFilters.fraud_analytics.org = value;
        },
        // error_analytics methods
        setErrorDateFilterName(state,value){
            state.headerFilters.error_analytics.dateFilterName = value;
        },
        setErrorDateFilter(state,value){
            state.headerFilters.error_analytics.dateFilter = value;
        },
        setErrorDocType(state,value){
            state.headerFilters.error_analytics.document_type = value;
        },
        setErrorFileType(state,value){
            state.headerFilters.error_analytics.file_type = value;
        },
        setErrorBusinessUnit(state,value){
            state.headerFilters.error_analytics.business_unit = value;
        },
        setErrorOrg(state,value){
            state.headerFilters.error_analytics.org = value;
        },
        setErrorEntityValuesList(state,value){
            state.error_analytics.entityValuesList = value;
        },
        setOrgHierarchy(state,value){
            state.orgHierarchy = value;
        },
        setdashboardComponentStatus(state,componentName){
            state.dashboardComponentStatus[componentName] = true
        },
        setPermittedDashboardComponentStatus(state,dashboardComponentList){
            const jsonObject = dashboardComponentList.reduce((obj, componentName) => {
                obj[componentName] = false;
                return obj;
              }, {});
            state.dashboardComponentStatus = jsonObject
        },

    },
    getters: {
        getOrgHierarchy(state){
            return state.orgHierarchy
        },
        getCurrentDashboard(state){
            return state.currentDashboard;
        },
        getErrorEntityValuesList(state){
            return state.error_analytics.entityValuesList;
        },
        getCurrentDashboardDateFilter(state){
            return state.headerFilters[state.currentDashboard].dateFilter || state.defaultDateFilter;
        },
        getCurrentDashboardDateFilterName(state){
            return state.headerFilters[state.currentDashboard].dateFilterName;
        }, 
        getCurrentDashboardDocType(state){
            return state.headerFilters[state.currentDashboard].document_type;
        },
        getCurrentDashboardFilters(state){
            let filters = {};
            const currentDashboardFilter = state.headerFilters[state.currentDashboard];
            if(!currentDashboardFilter){
                return filters;
            }
            if(!currentDashboardFilter.dateFilter){
                filters["created_at"] = state.defaultDateFilter.created_at;
            }else{
                filters["created_at"] = currentDashboardFilter.dateFilter.created_at;
            }    
            // add filter key and data only value exist, otherwise we get error in query
            if(currentDashboardFilter.document_type) (filters["document_type"] = currentDashboardFilter.document_type);
            if(currentDashboardFilter.file_type && currentDashboardFilter.file_type.length!=0) (filters["file_type"] = {"$in" : currentDashboardFilter.file_type});
            if(currentDashboardFilter.business_unit) (filters["business_unit"] = currentDashboardFilter.business_unit);
            if(currentDashboardFilter.org) (filters["org"] = { "$regex": `^${currentDashboardFilter.org}`});
            if(currentDashboardFilter.selectedVendors && currentDashboardFilter.selectedVendors.length!=0) (filters["vendor_name"] = {"$in" : currentDashboardFilter.selectedVendors});

            return filters;
        },
        isDashboardLoaded(state){
            const allValuesTrue = Object.values(state.dashboardComponentStatus).every(value => value === true);
            state.isDashboardLoaded = allValuesTrue ? true : false;
            return state.isDashboardLoaded  
        }
    },
};
