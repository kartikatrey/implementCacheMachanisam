import _ from "lodash";
import moment from "moment";
import constants from "@/resources/Constants";
import store from "@/store/store";
import IdpDashboardService from "@/idp/services/IdpDashboardService";
export default class DashboardDrillDownService {

	static findBaseUrlByChartName(chartName, child, options) {
		const chartNameMap = {
			"total_document_count_by_stages": "/idp/all-document-list",
			"document_count_by_stages": {
				"invoice": "/idp/all-document-list",
				"po": "/idp/all-document-list",
				"quote": "/idp/all-document-list",
				"other": "/idp/all-document-list"
			},
			"document_volume_by_type": {
				"invoice": "/idp/all-document-list",
				"purchase order": "/idp/all-document-list",
				"sales order": "/idp/all-document-list",
				"quote": "/idp/all-document-list",
				"other":"/idp/all-document-list"
			},
			"document_count_by_channel": "/idp/all-document-list",
			// "accurcy_by_vendor": "/idp/all-document-list",
			"volume_by_entity": "/idp/all-document-list",
			"document_by_subtype": "/idp/insurance-document-list",
			"entity_document_count_by_stages": "/idp/all-document-list",
			"document_by_classification": {
				"invoice": "/idp/all-document-list",
				"po": "/idp/all-document-list",
				"quote": "/idp/all-document-list",
				"other": "/idp/all-document-list"
			},
			"publish_count":  "/idp/all-document-list",
			"automation_lever":  "/idp/all-document-list",
			"error_analytics":"/idp/error-analytics",
			"document_by_extraction_bucket":"/idp/all-document-list",
			"productivity_staff": "/idp/insurance-document-list",
			"submissions_lobs_wise": "/idp/insurance-document-list",
			"orphan_document_by_subtype": "/idp/insurance-document-list",
			"submissions_pending_actions": "/idp/insurance-document-list",
			"submissions_online_offline_wrapper": "/idp/insurance-document-list",
			"due_date_wrapper": "/idp/all-document-list",
			"early_discount_wrapper": "/idp/all-document-list",
			"approval_pending_wrapper": "/idp/all-document-list",
			"invoice_processed_per_employee": "/idp/all-document-list",
			"invoice_in_progress_per_employee": "/idp/all-document-list",
			"paid_status_wrapper": "/idp/all-document-list",
			"published_touched_untouched_documents": "/idp/all-document-list"
		};
		return child && _.isObject(chartNameMap[chartName]) ? chartNameMap[chartName][child] : chartNameMap[chartName];
	}

	static findDateRangeByActiveTab(activeFilterTabName) {
		const rangeMap = {
			0: {
				created_at: {
					$gte: moment()
						.subtract(1, "days")
						.startOf("day")
						.utc()
						.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
					$lte: moment().startOf('day')
						.utc()
						.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
				}
			},
			1: {
				created_at: {
					$gte: moment()
						.subtract(7, "days")
						.startOf("day")
						.utc()
						.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
					$lte: moment().endOf('day').utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				},
			},
			2: {
				created_at: {
					$gte: moment()
						.subtract(30, "days")
						.startOf("day")
						.utc()
						.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
					$lte: moment().endOf('day').utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				},
			},
			3: {
				created_at: {
					$gte: moment()
					.subtract(1, "year")
					.startOf("day")
					.utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
					$lte:moment()
					.endOf("day")
					.utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				},
			},
			4: {
				created_at: {
					$gte: moment().startOf("year").utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
					$lte: moment().endOf('day').utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				},
			},
		};

		if (activeFilterTabName == 4) {
			const dashboardFilter = DashboardDrillDownService.findCurrentFilter();
			if (dashboardFilter.dateFilter) return dashboardFilter.dateFilter;
		}
		return rangeMap["" + (activeFilterTabName || "2")];
	}

	static findSelectedTab(selectedSliceName) {
		const stagesMap = {
			"Inbox": {"stage":constants.DOCEX.STAGE.UPLOADED},
			"Errored": {"state":constants.DOCEX.STATE_UPLOADED.FAILED},
			"Failed": {"state":constants.DOCEX.STATE_UPLOADED.FAILED},
			"Published": {"stage":constants.DOCEX.STAGE.PUBLISHED},
			"Approved": {"stage":constants.DOCEX.STAGE.APPROVED},
			"Rejected": {"stage":constants.DOCEX.STAGE.REJECTED},
			"Confirmed":{"stage":constants.DOCEX.STAGE.CONFIRMED} ,
			"Deleted":{"stage":constants.DOCEX.STAGE.DELETED} ,
			"Cancelled": {"stage":constants.DOCEX.STAGE.CANCELLED},
			"Waiting for approval":{"stage":constants.DOCEX.STAGE.WAITING_FOR_APPROVAL},
			"Pending approval":{"stage":constants.DOCEX.STAGE.WAITING_FOR_APPROVAL},
			"Approval rejected": {"stage":"Approval rejected"},
			"Fraud confirmed": {"stage":constants.DOCEX.STAGE.FRAUD_CONFIRMED},
			"Fraud flagged": {"stage":constants.DOCEX.STAGE.FRAUD_FLAGGED},
			"Suspected Fraud": {"stage":constants.DOCEX.STAGE.FRAUD_CONFIRMED},
			"Paid": {"stage":constants.DOCEX.STAGE.PAID},
			"Cancelled": {"stage":constants.DOCEX.STAGE.CANCELLED},
			"Touched": {"stage":constants.DOCEX.STAGE.PUBLISHED},
			"Untouched": {"stage":constants.DOCEX.STAGE.PUBLISHED}
		};
		return selectedSliceName ? stagesMap[selectedSliceName] : null;

	}

	static getGraphQueryFunction(chart) {
		const chartQueryFunctionMap = {
			'document_volume_by_type': DashboardDrillDownService.documentVolumeByType,
			'document_count_by_channel': DashboardDrillDownService.documentCountByChannel,
			'entity_document_count_by_stages': DashboardDrillDownService.documentsByEntity,
			'document_by_classification': DashboardDrillDownService.documentsByClassification,
			'publish_count': DashboardDrillDownService.documentByPublishCount,
			// 'accurcy_by_vendor': DashboardDrillDownService.documentsAccurcyByVendor,
			'volume_by_entity': DashboardDrillDownService.documentsVolumeByEntity,
			'document_by_subtype': DashboardDrillDownService.documentsBySubtype,
			'total_document_count_by_stages': DashboardDrillDownService.totalDocumentCountByStage,
			'document_count_by_stages':DashboardDrillDownService.documentCountByStage,
			'error_analytics': DashboardDrillDownService.errorAnalytics,
			'document_by_extraction_bucket':DashboardDrillDownService.errorAnalytics,
			'productivity_staff': DashboardDrillDownService.productivityStaffDocuments,
			'submissions_lobs_wise':  DashboardDrillDownService.submissionLobsWiseDocuments,
			'orphan_document_by_subtype':DashboardDrillDownService.getOrphandocuments,
			'submissions_online_offline_wrapper': DashboardDrillDownService.getOnlineOfflineSubmissions,
			'submissions_pending_actions': DashboardDrillDownService.getPendingSubmissionsData,
			'due_date_wrapper': DashboardDrillDownService.createQueryforGettingDates,
			'early_discount_wrapper': DashboardDrillDownService.createQueryforGettingDates,
			'approval_pending_wrapper': DashboardDrillDownService.createQueryforApprovalPending,
			'invoice_processed_per_employee': DashboardDrillDownService.createQueryForEmployeeProductivity,
			'invoice_in_progress_per_employee': DashboardDrillDownService.createQueryForEmployeeProductivity,
			'paid_status_wrapper': DashboardDrillDownService.createQueryToGetPaidStatusDocs,
			'automation_lever': DashboardDrillDownService.automationLever,
			'published_touched_untouched_documents': DashboardDrillDownService.publishedTouchedUntouchedDocuments
		};
		return chartQueryFunctionMap[chart] ? chartQueryFunctionMap[chart] : null;
	}
	// Naming convention to chartToColorMap function : set + chartName + color
	static getWidgetColorByChartName(chartName , chartData) {
		const chartToColorMap = {
			'extractionBucket' : setExtractionBucketColor,
			'topErrorByVendor' : setErrorColor,
			'errorsByType' : setErrorColor,
			'FieldsByErrorType' : setFieldsByErrorTypeColor,
			'VendorWiseErrorCodeWrapper' : setVendorWiseErrorCodeWrapperColor,
			'VendorWiseErrorWrapper' : setVendorWiseErrorWrapperColor,
			'VendorWiseErrorWrapper' : setErrorByTypesColor,
			'FraudByAmountWrapper' : setFraudByAmountWrapperColor,
			'FraudByActivityWrapper' : setFraudByActivityWrapperColor,
			'FraudByVendoryWrapper' : setFraudByVendorWrapperColor,
			'FraudByCodeWrapper' : setFraudByCodeWrapperColor,
			'ApprovalPendingWrapper' : setWrapperColor,
			'AutomationLeverWrapper' : setAutomationLeverWrapperColor,
			'AverageApproveTimeWrapper' : setWrapperColor,
			'AvgProcessingTimePerVendorWrapper' : setAvgProcessingTimePerVendorWrapperColor,
			'DocumentByChannelWrapper' : setDocumentByChannelWrapperColor,
			'DocumentByEntityWrapper' : setDocumentByEntityWrapperColor,
			'DueDateWrapper' : setDueDateWrapperColor,
			'EarlyDiscountWrapper' : setWrapperColor,
			'InvoiceInProgressWrapper' : setWrapperColor,
			'InvoiceProcessedWrapper' : setInvoiceProcessedWrapperColor,
			'PaidStatusWrapper' : setPaidStatusWrapperColor,
			'ProcessingTimeWrapper' : setProcessingTimeWrapperColor,
			'StackedLineChartWrapper' : setStackedLineChartWrapperColor,
			'TotalDocumentCountWrapper' : setTotalDocumentCountWrapperColor,
			'VolumeByEntityWrapper' : setWrapperColor,
			'TotalDocumentCountCard' : setTotalDocumentCountCardColor,
			'DocumentByVolumeCard' : setDocumentByVolumeCardColor,
			'TotalDocumentCountByCustomerWrapper' : setTotalDocumentCountByCustomerWrapperColor,
			'CustomerThresholdCard' : setCustomerThresholdCardColor,
			'CustomerMontlyProcessingCard' : setCustomerMontlyProcessingCardColor,
			'AllCustomersMonthlyProcessingCard' : setAllCustomersMonthlyProcessingCardColor,
			'DocumentsProcessedBySystem' : setDocumentsProcessedBySystemColor,
			'PublishedTouchedUntouchedDocuments' : setPublishedTouchedUntouchedDocumentsColor
 			

		};
		const colorHandler = chartToColorMap[chartName];
		colorHandler();
	}
	static setAllCustomersMonthlyProcessingCardColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.series[0].markLine.lineStyle.color = "#DB210F";
				chartData.series[0] = {
					...chartData.series[0],  // Spread existing properties
					markLine: {
					  ...chartData.series[0].markLine,
					  label: {
						...chartData.series[0].markLine.label,
						textBorderColor: { color: "#000000" },
						textStyle: { color: "#bebebe" },
					  },
					},
				  };
		}
	}

	static setCustomerMontlyProcessingCardColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.series[0].lineStyle.color = "#bebebe";
				chartData.xAxis.data[0] = { color: "#bebebe" };
		}
	}

	static setCustomerThresholdCardColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.title.textStyle.color = "#bebebe";

				const seriesItem = chartData.series[0].label.rich;
				['b', 'c'].forEach(key => { seriesItem[key].color = "#bebebe"; });

				chartData.series[0].data.forEach(dataItem => {
					dataItem.itemStyle.color = "#bebebe";
				});
						}
	}

	static setTotalDocumentCountByCustomerWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.legend.textStyle.color = "#bebebe";
				chartData.title.textStyle.color = "#bebebe";
		}
	}

	static setDocumentByVolumeCardColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				const darkColors = ["#2968CF", "", "", "", "", "", "", "#CC7C00", ""];
				chartData.legend.textStyle.color = "#bebebe";
				chartData.color = ["#2968CF", "#CC7C00", "#CB2F22", "#D29E04"];
				chartData.title.textStyle.color = "#bebebe";

				chartData.series.forEach(serie => {
					serie.data.forEach((dataItem, itemIndex) => {
						dataItem.itemStyle.color = darkColors[itemIndex % darkColors.length];
					});
				});
		}
	}

	static setTotalDocumentCountCardColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				const darkColors = ["#DB210F", "#0037C7", "#16a085", "#CB2F22", "#CC7C00", "#A6BA26", "#e03826", "#58982C", "#DDAE7E"];
				chartData.title.textStyle.color = "#bebebe";

				const seriesItem = chartData.series[0].label.rich;
				seriesItem.a.color = "#bebebe";
				seriesItem.b.color = "#bebebe";
				seriesItem.c.color = "#bebebe";

				chartData.series.forEach(serie => {
					serie.data.forEach((dataItem, itemIndex) => {
						dataItem.itemStyle.color = darkColors[itemIndex % darkColors.length];
					});
				});
		}
	}

	static setFraudByVendorWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.series[0].areaStyle.color = "#0672D2";
				chartData.series[0].itemStyle.color = "#0672D2";
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
		}
	}

	static setTotalDocumentCountWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle.color = "#bebebe";
				const darkColors = ["#DB210F", "#A91DA9", "#2968CF", "#D29E04", "#58982C", "#0E8B73", "#DDAE7E", "#A6BA26", "#0037C7", "#CF4848"];
				chartData.title.textStyle.color = "#bebebe";
				const seriesItem = chartData.series[0].label.rich;
				['a', 'b', 'c'].forEach(key => { seriesItem[key].color = "#bebebe"; });
				chartData.series.forEach(serie => {
					serie.data.forEach((dataItem, itemIndex) => {
						dataItem.itemStyle.color = darkColors[itemIndex % darkColors.length];
					});
				});
		}
	}
	static setStackedLineChartWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.title.textStyle.color = "#bebebe";
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.color = ["#0672D2", "#CC7C00", "#A6BA26", "#58982C"];
		}
	}

	static setProcessingTimeWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				if (!chartData) {
					return;
				}
				//Added backgroundColor property to tooltip
				if(chartData.tooltip){
					chartData.tooltip.backgroundColor = "#242729";
				}
				if (chartData.tooltip && chartData.tooltip.textStyle) {
					chartData.tooltip.textStyle.color = "#bebebe";
				}
				if (chartData.title && chartData.title.textStyle) {
					chartData.title.textStyle.color = "#bebebe";
				}
				chartData.color = ["#2968CF", "#CC7C00", "#CB2F22", "#D29E04"];
				const itemStyleColors = ["#0672D2", "#CC7C00", "#A6BA26"];
				itemStyleColors.forEach((color, index) => {
					if (chartData.series && chartData.series[index] && chartData.series[index].itemStyle) {
						chartData.series[index].itemStyle.color = color;
					}
				});
				if (chartData.legend && chartData.legend.textStyle) {
					chartData.legend.textStyle.color = "#bebebe";
				}
		}
	}

	static setPaidStatusWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle.color = "#bebebe";
				chartData.title.textStyle.color = "#bebebe";
				let color = "#bebebe";
				const keys = ['a', 'b', 'c'];
				keys.forEach(key => {
					chartData.series[0].label.rich[key] = color;
				});
				chartData.series[0].data.forEach((dataPoint, index) => {
					chartData.series[0].data[index].label = {
					  ...dataPoint.label,  // Spread existing label properties
					  backgroundColor: "#101111",
					  textStyle: {
						color: "#bebebe",
					  },
					};
				  });
		}
	}

	static setInvoiceProcessedWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle.color = "#bebebe";
				chartData.legend.textStyle.color = "#bebebe";
				chartData.series[0].itemStyle.color = "#58982C";
		}
	}

	static setWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				if (!chartData) {
					return;
				}
				//Added backgroundColor property to tooltip
				if(chartData.tooltip){
					chartData.tooltip.backgroundColor = "#242729";
				}
				if (chartData.tooltip && chartData.tooltip.textStyle) {
					chartData.tooltip.textStyle.color = "#bebebe";
				}
				if (chartData.legend && chartData.legend.textStyle) {
					chartData.legend.textStyle.color = "#bebebe";
				}
				if (chartData.series && chartData.series[0] && chartData.series[0].itemStyle) {
					chartData.series[0].itemStyle.color = "#0672D2";
				}
		}
	}

	static setDueDateWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.title.textStyle.color = "#bebebe";
				chartData.color = ["#BF2D2D", "#D9A353"];
				chartData.series[0].itemStyle.color = "#0672D2";
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle.color = "#bebebe";
		}
	}

	static setDocumentByChannelWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle.color = "#bebebe";
				chartData.title.textStyle.color = "#bebebe";
				let color = "#bebebe";
				const keys = ['a', 'b', 'c'];
				keys.forEach(key => {
					chartData.series[0].label.rich[key].color = color;
				});
		}
	}
	//Function to set dark theme color for "Document Processed By System" widget
	static setDocumentsProcessedBySystemColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				if(!chartData){
					return;
				}
				if(chartData.tooltip){
					chartData.tooltip.backgroundColor = "#242729";
				}
				if(chartData.tooltip && chartData.tooltip.textStyle){
					chartData.tooltip.textStyle.color = "#bebebe";
				}
				if(chartData.title && chartData.title.textStyle){
					chartData.title.textStyle.color = "#bebebe";
				}
				const color = "#bebebe";
				const keys = ['a', 'b', 'c'];
				keys.forEach(key => {
					if (chartData.series[0].label && chartData.series[0].label.rich && chartData.series[0].label.rich[key]) {
						chartData.series[0].label.rich[key].color = color;
					}
				});
		}
	}
	

	static setAvgProcessingTimePerVendorWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle.color = "#bebebe";
				chartData.title.textStyle.color = "#bebebe";
				const itemStyleColors = ["#0672D2", "#CC7C00", "#ACBA26"];
				chartData.series.forEach((series, index) => {
					series.itemStyle.color = itemStyleColors[index];
				});
				chartData.legend.textStyle.color = "#bebebe";
		}
	}

	static setFraudByCodeWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.title.textStyle.color = "#bebebe";
				chartData.color = ["#0037C7", "#16a085", "#BF2D2D", "#58982C", "#A6BA26", "#CF4848", "#CC7C00", "#DB210F"];
				const richProperties = ['a', 'b', 'c'];
				richProperties.forEach(property => {
					chartData.series[0].label.rich[property].color = "#bebebe";
				});
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
		}
	}

	static setFraudByActivityWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.color = ["#A94DA9", "#2968CF", "#CC7C00", "#CB2F22"];
				chartData.series[0].areaStyle.color = "#0672D2";
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.legend.textStyle.color = "#bebebe";
				chartData.series[0].lineStyle.color = "#1249db";
				chartData.series[0].itemStyle.color = "#0672D2";
		}
	}

	static setFraudByAmountWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.legend.textStyle.color = "#bebebe";
				chartData.color = ["#A94DA9", "#2968CF", "#CC7C00", "#CB2F22"];
				chartData.series[0].areaStyle.color = "#0672D2";
				chartData.series[0].lineStyle.color = "#1249db";
		}
	}

	static setErrorByTypesColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.legend.textStyle.color = "#bebebe";
				chartData.color = ["#BF2D2D", "#D9A353"];
		}
	}

	static setVendorWiseErrorWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.tooltip.backgroundColor = "#242729";
				chartData.legend.textStyle.color = "#bebebe";
				chartData.color = ['#0672D2', '#1B7ED6', '#5B88AF', '#CC7C00', '#CF8A1E', '#BB8D45', '#96A81E', '#ABB853', '#C4D16A'];
		}
	}

	static setExtractionBucketColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.color = "#0BB476";
				chartData.legend.textStyle.color = "#bebebe";
				chartData.xAxis.textStyle = { color: "#bebebe" };
		}
	}

	static setErrorColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.color = ["#e38b07", "#BF2D2D"];
				chartData.series[0].itemStyle.color = "#0672D2";
				chartData.legend.textStyle.color = "#bebebe";
				chartData.series[0].areaStyle.color = "#0672D2";
				chartData.series[0].lineStyle.color = "#194dd4";
				chartData.title.textStyle.color = "#bebebe";
		}
	}

	static setFieldsByErrorTypeColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.legend.textStyle.color = "#bebebe";
				chartData.title.textStyle.color = "#bebebe";
				chartData.color = ['#0672D2', '#1B7ED6', '#5B88AF', '#CC7C00', '#CF8A1E', '#BB8D45', '#96A81E', '#ABB853', '#C4D16A'];
				chartData.series[0].data.forEach((dataPoint, index) => {
					chartData.series[0].data[index] = {
					  ...dataPoint,  // Spread existing properties
					  label: {
						...dataPoint.label,
						backgroundColor: "#101111",
						textStyle: {
						  color: "#bebebe",
						},
					  },
					};
				  });
		}
	}

	static setVendorWiseErrorCodeWrapperColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");

		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				chartData.tooltip.backgroundColor = "#242729";
				chartData.tooltip.textStyle = { color: "#bebebe" };
				chartData.color = "#0BB476";
				chartData.legend.textStyle.color = "#bebebe";
				chartData.series[0].areaStyle.color = "#0672D2";
				chartData.series[0].itemStyle.color = "#0672D2";
		}
	}

	// Function to set dark theme color for "Touched vs Non touched" widget
	static setPublishedTouchedUntouchedDocumentsColor(chartData) {
		const kanvTheme = _.get(store, 'state.selectedTheme', "");
		switch (kanvTheme) {
			case constants.DOCEX.THEMES.DARK:
				if(!chartData){
					return;
				}
				if(chartData.tooltip){
					chartData.tooltip.backgroundColor = "#242729";
				}
				if(chartData.tooltip && chartData.tooltip.textStyle){
					chartData.tooltip.textStyle.color = "#bebebe";
				}
				if(chartData.title && chartData.title.textStyle){
					chartData.title.textStyle.color = "#bebebe";
				}
				const color = "#bebebe";
				const keys = ['a', 'b', 'c'];
				keys.forEach(key => {
					if (chartData.series[0].label && chartData.series[0].label.rich && chartData.series[0].label.rich[key]) {
						chartData.series[0].label.rich[key].color = color;
					}
				});
		}
	}

	static createQueryToGetPaidStatusDocs(graphData, chartName, childChartName, options = {}, dashboardFilter){
		let query = {};
		if(graphData.name == "Unpaid"){ graphData.name = "Published"}
		query["secondary"] = {
			...dashboardFilter,
			stage: graphData.name,
		};
		query["_extraParams"] = {
			"selected_stage" : graphData.name
		}
		return query;
	}

	static createQueryForEmployeeProductivity(graphData, chartName, childChartName, options = {}, dashboardFilter){
		let query = {};
		if(chartName == "invoice_in_progress_per_employee"){
			query["secondary"] = {
				assigned_user_name: graphData.name,
				stage: graphData.seriesName,
				...dashboardFilter,
			};
			query["_extraParams"] = {
				"selected_stage" : "Uploaded"
			}
		}
		else if(chartName == "invoice_processed_per_employee"){
			query["secondary"] = {
				published_by: graphData.name,
				stage: graphData.seriesName,
				...dashboardFilter,
			};
			query["_extraParams"] = {
				"selected_stage" : "Published"
			}
		}

		return query;
	}

	static createQueryforApprovalPending(graphData, chartName, childChartName, options = {}, dashboardFilter){
		let query = {};
		const dateFilterMapping = {
			"< 7 days": {
				$lte: moment().endOf('day').utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                $gte: moment().subtract(6, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"8 - 14 days": {
				$lte: moment().subtract(7, "days").endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                $gte: moment().subtract(13, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"15 - 21 days": {
				$lte: moment().subtract(14, "days").endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				$gte: moment().subtract(20, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"22 - 28 days": {
				$lte: moment().subtract(21, "days").endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                $gte: moment().subtract(27, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"> 28 days": {
				$lte: moment().subtract(28, "days").endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
			}
		}
		// Initially, we were using delete dashboardFilter["created_at"] to remove the object from dashboardFilter.
		// However, we are now using _omit(), which locally removes the value from the object.
		dashboardFilter = _.omit(dashboardFilter, "created_at") // consider selected drilldown dateFilter and not from header filters

		query["secondary"] ={
			...dashboardFilter,
			lookupKey: {
				"lookup": {
					from: "approval",
					localField: "_id",
					foreignField: "document_id",
					as: "approvalDocs"
				},
				"match": {
					"approvalDocs.approval_status": "Requested",
					"approvalDocs.created_time": dateFilterMapping[graphData.data["name"]]
				}
			},
			"stage": {"$in": ["Waiting for approval"]}
		}
		query["_extraParams"] = {
			"selected_stage": "Waiting for approval"
		}
		// added to filter according to drill down.. If we wont add it take the default created_at
		query['dateFilter'] = ""
		query['dateFilterName'] = ""
		return query;
	}

	static createQueryforGettingDates(graphData, chartName, childChartName, options = {}, dashboardFilter){
		let query = {};
		const dateFilterMapping = {
			"Overdue": dashboardFilter["created_at"],
			"< 7 days": {
				$gte: moment().startOf('day').utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
                $lte: moment().add(6, "days").endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"8 - 14 days": {
				$gte: moment().add(7, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				$lte: moment().add(13, "days").endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"15 - 21 days": {
				$gte: moment().add(14, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				$lte: moment().add(20, "days").endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"22 - 28 days": {
				$gte: moment().add(21, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				$lte: moment().add(27, "days").endOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"> 28 days": {
				$gte: moment().add(28, "days").startOf("day").utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			}
		}

		let dashboardFilterCloned = _.cloneDeep(dashboardFilter)
		delete dashboardFilterCloned["created_at"]  // consider selected drilldown dateFilter and not from header filters
		if(chartName == "due_date_wrapper"){
			query["secondary"] = {
				"due_date": dateFilterMapping[graphData.data["name"]],
				stage:{$nin:[constants.DOCEX.STAGE.PUBLISHED, constants.DOCEX.STAGE.DELETED]},
				...dashboardFilterCloned,
			};
		}
		else if(chartName == "early_discount_wrapper"){
			query["secondary"] = {
				"discount_date": dateFilterMapping[graphData.data["name"]],
				stage:{$nin:[constants.DOCEX.STAGE.PUBLISHED, constants.DOCEX.STAGE.DELETED]},
				...dashboardFilterCloned,
			};
		}
		query["_extraParams"] = {
			"selected_stage": "Uploaded"
		}
		return query;
	}

	static productivityStaffDocuments(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		query["secondary"] = {
			...dashboardFilter,
			"stage": graphData.seriesName,
			"assigned_to": graphData.data.name
		}
		query["_extraParams"] = {
			"selected_stage": "Uploaded"
		}
		return query;
	}

	static submissionLobsWiseDocuments(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		query["secondary"] = {
			...dashboardFilter,
			"stage": graphData.seriesName,
			"lobs": {$in:[graphData.data.name]}
		}
		query["_extraParams"] = {
			"selected_stage": "Uploaded"
		}
		return query;
	}

	static errorAnalytics(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		if(!moment(graphData.name, 'YYYY-MM-DD')._isValid){
			return query;
		}
		query["dateFilter"] = {
			created_at: {
				$gte: moment(graphData.name).startOf('day').utc()
				.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				$lte: moment(graphData.name).endOf('day').utc()
				.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
			}
		};
		query["dateFilterName"] = Object.values(query.dateFilter["created_at"]);
		dashboardFilter = _.omit(dashboardFilter, "created_at") // consider selected drilldown dateFilter and not from header filters
		query = {...query, ...dashboardFilter}
		return query;
	}

	static documentCountByStage(drildownClickData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {...dashboardFilter};
		query["secondary"] = {
			// "document_type": {
			// 	$nin: [constants.DOCEX.DOCUMENT_TYPES.OTHER]
			// }
		};

		function isErrorDrilldown() {
			const STAGE_LABEL_MAP = constants.DOCEX.IDP_DASHBOARD.STAGE_LABEL_MAP
			if (drildownClickData && !drildownClickData.name) return false;

			return STAGE_LABEL_MAP[drildownClickData.name] && (STAGE_LABEL_MAP[drildownClickData.name] == constants.DOCEX.STATE_UPLOADED.FAILED);
		}

		if (isErrorDrilldown()) {
			query["secondary"]['state'] =constants.DOCEX.STATE_UPLOADED.FAILED;
		} else {
			query["secondary"]['state'] = { '$ne': constants.DOCEX.STATE_UPLOADED.FAILED };
		}

		return query;
	}

	static totalDocumentCountByStage(drildownClickData, chartName, childChartName, options = {}, dashboardFilter) {
		let docTypes = [];
		// if document type selected in filters, consider it and delete from filters
		if (dashboardFilter["document_type"]) {
			docTypes.push(dashboardFilter["document_type"])
			_.omit(dashboardFilter, "document_type")
		}else {
			// removed user domain dependancy
			// let domainList = _.get(store, 'state.user.user_domains', []);
			// domainList.map(domain => {
			// 	docTypes = docTypes.concat(_.get(domain, 'document_type', []));
			// });
			const docTypeConfig =  window.hasOwnProperty('kan_customer_configurations_all') && window.kan_customer_configurations_all;
			docTypes = _.compact(_.map(docTypeConfig || [], (config) => {
				if (config['document_type'] != 'form') {
					return config['document_type']
				}
			}))
		 }
		let query = { secondary: {} };
		query["secondary"] = {
			...dashboardFilter,
			"document_type": {
				$in: docTypes
			}
		};

		function isErrorDrilldown() {
			const STAGE_LABEL_MAP = constants.DOCEX.IDP_DASHBOARD.STAGE_LABEL_MAP
			if (drildownClickData && !drildownClickData.name) return false;

			return STAGE_LABEL_MAP[drildownClickData.name] && (STAGE_LABEL_MAP[drildownClickData.name] == constants.DOCEX.STATE_UPLOADED.FAILED);
		}

		if (isErrorDrilldown()) {
			query["secondary"]['state'] = constants.DOCEX.STATE_UPLOADED.FAILED;
		} else {
			query["secondary"]['state'] = { '$ne': constants.DOCEX.STATE_UPLOADED.FAILED };
		}

		return query;
	}

	static getOnlineOfflineSubmissions(graphData, chartName, childChartName, options = {}, dashboardFilter){
		let query = {};
		const packageQuery = {"parent_document_id": null, "type": "package"}
		query["secondary"] = {
			"stage": graphData.data["label"],
			...packageQuery,
			...dashboardFilter,
		};
		if (graphData.name == "Handled Offline") {
			query["_extraParams"] = {
				"selected_stage": "Closed"
			}
		} else {
			query["_extraParams"] = {
				"selected_stage": "Published"
			}
		}
		return query;
	}

	static getPendingSubmissionsData(graphData, chartName, childChartName, options = {}, dashboardFilter){
		let query = {};
		const bucketDateFilterMapping = {
			"< 15 days": {
				$gte: moment()
					.subtract(15, "days")
					.startOf("day")
					.utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				$lte: moment().subtract(1, "days").endOf('day').utc()
				.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"15 to 30 days": {
				$gte: moment()
					.subtract(30, "days")
					.startOf("day")
					.utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				$lte: moment()
					.subtract(15, "days")
					.startOf("day")
					.utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			},
			"> 30 days": {
				$lte: moment()
					.subtract(30, "days")
					.startOf("day")
					.utc()
					.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
			}
		}
		let dashboardFilterCloned = _.cloneDeep(dashboardFilter)
		// Initially, we were using delete dashboardFilter["created_at"] to remove the object from dashboardFilter.
		// However, we are now using _omit(), which locally removes the value from the object.
		dashboardFilterCloned = _.omit(dashboardFilterCloned, "created_at") // consider selected drilldown dateFilter and not from header filters
		
		const packageQuery = {"parent_document_id": null, "type": "package"}
		query["secondary"] = {
			"updated_at": bucketDateFilterMapping[graphData.data["name"]],
			...packageQuery,
			...dashboardFilterCloned,
		};
		return query;
	}

	static documentCountByChannel(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		let docTypeQuery = {};
		const user = store.getters["user"];
		if (user.roles.includes(constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN)) {
			docTypeQuery = {"document_type": { $nin: constants.DOCEX.OTHER_DOC_TYPES }}
			// if document type selected in header filter , consider it
			if(dashboardFilter["document_type"]){
				docTypeQuery = {"$and": [
					{"document_type":{ $nin: constants.DOCEX.OTHER_DOC_TYPES}},
					{"document_type":dashboardFilter["document_type"]}
				]}
				dashboardFilter = _.omit(dashboardFilter, "document_type"); 
			}
		}
		query["secondary"] = {
			"input_channel": graphData.data["label"],
			...dashboardFilter,
			...docTypeQuery
		};
		return query;
	}

	// static documentsAccurcyByVendor(graphData) {
	// 	let query = {};
	// 	query["secondary"] = {
	// 		"vendor_name": graphData["name"],
	// 		"accuracy": { $gt: 0 }
	// 	}
	// 	return query;
	// }

	static documentsVolumeByEntity(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		const entityKey = options.entityKey;
		query["secondary"] = {
			[entityKey]: graphData["name"],
			...dashboardFilter
		}
		return query;
	}

	static documentsBySubtype(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		query["secondary"] = {
			...dashboardFilter,
			"document_subtype": graphData.data.name,
			"type":"package"
		}
		return query;
	}

	static getOrphandocuments(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		query["secondary"] = {
			...dashboardFilter,
			"document_subtype": graphData.data.name,
			"type":{"$exists":false}
		}
		return query;
	}

	static documentsByClassification(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		query["secondary"] = {
			"input_channel": { "$in": constants.DOCEX.CLASSIFICATION_INPUT_CHANNELS },
			...dashboardFilter
		}
		return query;
	}
	static automationLever(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		const query = {"secondary": {...dashboardFilter}};
		if(childChartName == "Automated Ingestion"){
			query["secondary"]["input_channel"] = graphData.data.name
		}
		return query;
	}

	static documentByPublishCount(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		query["secondary"] = {...dashboardFilter};
		if (graphData.data.published_by == constants.DOCEX.DOCUMENT_AUTO_PUBLISH) {
			query["secondary"]["published_by"] = constants.DOCEX.DOCUMENT_AUTO_PUBLISH;
		} else {
			query["secondary"]["published_by"] = { $nin: [constants.DOCEX.DOCUMENT_AUTO_PUBLISH] };
		}

		query["_extraParams"] = { "selected_stage": constants.DOCEX.STAGE.PUBLISHED }
        let invoiceTypeFilter = null;

        if (childChartName == "po") {
            invoiceTypeFilter = childChartName;
        }

        // for non_po we don't store invoice_type as non_po, invoice_type is by default empty string
        // therefor fetchting documents with invoice type not equal to po
        else if (childChartName == "non_po") {
            invoiceTypeFilter = { $ne: "po"};
        }

        if (invoiceTypeFilter){
            query["invoice_type"] = invoiceTypeFilter;
        }
		return query;
	}

	static documentVolumeByType(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		//childChartName is the document type param
		let query = {};
		query["dateFilter"] = {
			created_at: {
				$gte: moment(graphData.name).startOf('day').utc()
				.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
				$lte: moment(graphData.name).endOf('day').utc()
				.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
			}
		};
		query["dateFilterName"] = Object.values(query.dateFilter["created_at"]);
		// Initially, we were using delete dashboardFilter["created_at"] to remove the object from dashboardFilter.
		// However, we are now using _omit(), which locally removes the value from the object.
		dashboardFilter = _.omit(dashboardFilter, "created_at") // consider selected drilldown dateFilter and not from header filters

		//for dashboard queries, add pagecount filter, for rest all widgets added in All document list page
		query["secondary"] = {
			...dashboardFilter,
			// ...{page_count:{"$exists":true}}
		};
		return query;
	}

	static documentsByEntity(graphData, chartName, childChartName, options = {}, dashboardFilter) {
		let query = {};
		const entityKey = options.entityKey;
		query["secondary"] = {
			[entityKey]: childChartName,
			...dashboardFilter
		}
		return query;
	}

	static prepareQuery(drildownClickData, chartName, childChartName, options) {
		let filter = {};
		// const excludeParentDocCheck = { is_multi_documents_present: { "$ne": true } };
		// For ageing widgets don't get the stage for tabdata .
		// To handle that case passed options object which contain stage.
	    let tabData = DashboardDrillDownService.findSelectedTab(options.stage || drildownClickData["name"]);
		if (_.isObject(tabData) && _.has(tabData ,'state')) {
			filter["state"] = tabData.state
		}
		if (_.isObject(tabData) && _.has(tabData ,'stage')) {
			filter["stage"] = tabData.stage
		}

		const dateFilter = store.getters['dashboardStore/getCurrentDashboardDateFilter'];
		filter["dateFilter"] = dateFilter;
		// filter["folderPath"] = "/*";
		filter["dateFilterName"] = Object.values(dateFilter["created_at"]) || "";
		let dashboardFilter = store.getters['dashboardStore/getCurrentDashboardFilters'];
		if(dashboardFilter["document_type"] == "summary"){ dashboardFilter = _.omit(dashboardFilter, "document_type"); }
		const graphQueryFunction = DashboardDrillDownService.getGraphQueryFunction(chartName);
		if (graphQueryFunction) {
			filter = {
				...filter,
				...(graphQueryFunction(drildownClickData, chartName, childChartName, options, dashboardFilter) || {}),
			}
		}

		// filter.secondary = filter.secondary ? { ...filter.secondary, ...excludeParentDocCheck } : excludeParentDocCheck;
		// This is flag to identify in stage-wise-count api
		filter.isDrilldown = true;
		return {
			"filter": JSON.stringify(filter)
		};
	}

	static findCurrentFilter() {
		let filter = {};
		try {
			const urlParams = new URLSearchParams(window.location.search);
			const filterString = urlParams.get("filter");
			filter = JSON.parse(filterString || "{}");
		} catch (err) {
			filter = {};
		}
		return filter;
	}

	static getNavigationRoute(drildownClickData, chartName, childChartName, options = {}) {
		const query = DashboardDrillDownService.prepareQuery(drildownClickData, chartName, childChartName, options);
		let path = "";
		if(isVendorUser()) path ="/idp/document/vendor/invoice";
		else { path = DashboardDrillDownService.findBaseUrlByChartName(chartName, childChartName, options) }
		return { path, query };
	}

	/**
	 * This conditional statement checks whether the selected document type in the current dashboard is "summary"
	 * and checks whether currently logged-in user contains the "customer admin" role
	 * If it contains that role then only drilldown can be done
	 */
	static isDrillDownAllowedForWidget() {
		let isDrillDownAllowed = true;
		const dashboardFilters = IdpDashboardService.getCurrentDashboardFilters();
		if (dashboardFilters["document_type"] == "summary") {
			const userRoles = _.get(store, 'getters.user.roles', []);
			if (!userRoles.includes(constants.DOCEX.ROLES_MAP.IDP_CUSTOMER_ADMIN)) {
				isDrillDownAllowed = false;
			}
		}
		return isDrillDownAllowed;
	}

	/**
	 * This function builds a query for the Touched vs Non touched widget.
	 * Depending on the graph data, it sets the query to look for documents that are either "Untouched" or not.
	 */
	static publishedTouchedUntouchedDocuments(graphData, chartName, childChartName, options = {}, dashboardFilter){
		let query = {};
		// This widget displays published document records, so here date filter should be applied on published_at date
		if (dashboardFilter.hasOwnProperty('created_at')) {
			dashboardFilter.published_at = dashboardFilter.created_at;
			delete dashboardFilter.created_at;
		  }
		query["secondary"] = {
			...dashboardFilter
		};
		if (graphData.data.name == 'Untouched') {
			query["secondary"]["modified_fields"] = { $exists: true, $eq: [] }
		} else {
			query["secondary"]["modified_fields"] = { $exists: true, $ne: [] }
		}
		return query;
	}
}


function isVendorUser(){
	return store.getters["isVendorUser"];
}