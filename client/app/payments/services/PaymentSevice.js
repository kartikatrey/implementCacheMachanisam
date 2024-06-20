import AjaxService from "@/services/AjaxService";

export default class PaymentSevice {
	static call(payload) {
		return new Promise((resolve, reject) => {
            /**
             * Payload examples:
             * {"action": "createSenderUser", "data": {}}
             * {"action": "removeUser", "data": {}}
             * {"action": "createBankAccount", "data": {}}
             * {"action": "updateBankAccount", "data": {}}
             * {"action": "getBankAccounts", "data": {}}
             * {"action": "deleteBankAccount", "data": {}}
             *
             * Try giving action names similar to method names in payment integration documentation
             */
			AjaxService.postJson("/portal/api/payments", payload, (error, response) => {
				return error ? reject(error) : resolve(response && response.data);
			})
		});
	}

//Status column template for list view
      static getBankStatusBadge(props) {
            const statusMap = {
                DEPOSIT_ONLY: `<div cid="${'row-' + props.column.field + '-' + props.index}" class="el-badge mark"><sup class="badge-default">DEPOSIT_ONLY</sup></div>`,
                PENDING: `<div cid="${'row-' + props.column.field + '-' + props.index}" class="el-badge mark"><sup class="badge-pending">PENDING</sup></div>`,
                VERIFIED: `<div cid="${'row-' + props.column.field + '-' + props.index}" class="el-badge mark"><sup class="badge-active"><b>VERIFIED</b></sup></div>`,
            };
            let htmlTemplate = statusMap[props.row.status] ;
            return htmlTemplate;
        }
}