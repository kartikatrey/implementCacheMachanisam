import DocumentService from "./DocumentService";

export default class AttachmentService {
    static async getAllAttachments(docId, parentDocId, active = true, rejectAttachment = false) {
        try{
            const params = {
                'document_id': docId,
                'parent_document_id': parentDocId,
                'reject_attachment': rejectAttachment,
                'active': active
            };
            const selectList = ["file_name", "storage_file_name", "storage_path", "customer_storage"]
            const attachments = await DocumentService.getDocumentAttachments(params, selectList);
            return attachments;
        }catch (e) {
            throw e;
        }
    }
   
    static async removeAttachment(file, viewType){
        try{
            let params = {
                'storage_file_name':file.storage_file_name,
                'storage_path':file.storage_path,
                "customer_storage":file.customer_storage,
                'view_type': viewType
            }        
            let response = await DocumentService.removeDocumentAttachments(file._id, params)
            return response;
        } catch (e) {
            throw e;
        }
    }

    static async downloadAttachment(file){
        try {
            let params = {
                file_name: file.storage_file_name,
                document_type: file.document_type,
                storage_folder_path: file.storage_path
            };
            await DocumentService.downloadDocument(params);
        } catch (e) {
            throw e;
        }
    }
}

