import AjaxService from "@/services/AjaxService";

export default class DocumentScript {

    static get(params) {
        return new Promise((resolve, reject) => {
            AjaxService.postJson("/portal/api/document-script", params, (error, response) => {
                error ? reject(error):resolve(response.data)
            })
        });
    }
}