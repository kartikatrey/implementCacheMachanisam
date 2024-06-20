import TableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
import EventBus from "@/EventBus";
import constants from "@/resources/Constants";
import { appendTimestampToFileName } from "@/util/CommonUtil"
import { ShareServiceClient } from "@azure/storage-file-share";

export default class KsModelService {
    static get(filter) {
		return new Promise((resolve, reject) => {
			let tableAPI = new TableAPIService();
			tableAPI.addQuery(filter);
			tableAPI.find(constants.KSMODEL_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchById(recordId) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService()
            restifyService.findById(constants.KSMODEL_ENDPOINT, recordId, (error, response) => {
                if (error) {
                    reject(error);
                    return
                }
                resolve(response)
            });
        })
    }

    static save(data) {
        return new Promise((resolve, reject) => {
            let restifyService = new TableAPIService();
            console.log(data)
            restifyService.upsert(constants.KSMODEL_ENDPOINT, data, (error, response) => {
                return error || response.data.errors ? reject(error) : resolve(response)
            })
        })
    }

	static getModels(params) {
		return new Promise((resolve, reject) => {
            AjaxService.getJson("/api/ks-models", params, (error, response) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
		});   
	}

    static deployModel(params){
         return new Promise((resolve, reject) => {
            AjaxService.postJson(constants.KSMODEL_DEPLOY_MODEL, params, (error, response)=> {
                if(error){
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        }) 
    }

    static moveModel(params){
        return new Promise((resolve, reject) => {
            AjaxService.getJson(constants.KSMODEL_MOVE_MODEL, params, (error, response)=> {
                if(error){
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        })
    }

    static restoreModel(params){
        return new Promise((resolve, reject) => {
            AjaxService.postJson(constants.KSMODEL_DEPLOY_MODEL, params, (error, response)=> {
                if(error){
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        })
    }

    static generateSasToken(params){
        return new Promise((resolve, reject) => {
            AjaxService.getJson(constants.KSMODEL_DEPLOY_MODEL, params, (error, response)=> {
                if(error){
                    reject(error);
                    return;
                }
                resolve(response.data)
            })
        })
    }

    static async uploadFileToAzure(file, sasToken, storageFilePath) {
        let response = {};
        file = file[0];

        const accountName = constants.MODEL_STORE_ACCOUNT_NAME;
        const fileServiceClient = new ShareServiceClient(
            `https://${accountName}.file.core.windows.net?${sasToken}`
        );
        const shareName = "models"

        try {
            const filename = appendTimestampToFileName(file.name);
            const shareClient = fileServiceClient.getShareClient(shareName);
            const directoryClient = shareClient.getDirectoryClient(storageFilePath);
            const fileClient = directoryClient.getFileClient(filename);

            // const fileBuffer = await file.file.arrayBuffer();
            // await fileClient.create(fileBuffer.byteLength);
            // await fileClient.uploadRange(fileBuffer, 0, fileBuffer.byteLength);
            const fileBuffer = await file.file.arrayBuffer();
            const fileSize = fileBuffer.byteLength;
            const blockSize = 4 * 1024 * 1024; // 4MB chunk size
            let offset = 0;

            const startTime = Date.now();

            while (offset < fileSize) {
                const chunkSize = Math.min(blockSize, fileSize - offset);
                const chunk = fileBuffer.slice(offset, offset + chunkSize);

                if (offset === 0) {
                    await fileClient.create(fileSize);
                }
                console.log(`Uploading chunk from offset ${offset} with size ${chunkSize}`);
                await fileClient.uploadRange(chunk, offset, chunkSize);

                offset += chunkSize;

                // Emit progress
                const progress = Math.round((offset / fileSize) * 100);
                EventBus.$emit('upload-progress', progress);
            } 

            const endTime = Date.now();
            const timeTaken = (endTime - startTime) / (1000 * 60); // Convert to minutes
            console.log(`File upload complete. Time taken: ${timeTaken.toFixed(2)} minutes.`);

            response['status'] = true;
            response['msg'] = {message: 'Model Uploaded successfully', type: 'success'};
            response['storage_file_path'] = `${storageFilePath}/${filename}`;
        } catch (error) {
            console.log('Error', error);
            response['status'] = false; 
            response['msg'] = {message: 'Error while uploading model to azure', type: 'danger'};
        }finally{
            return response;
        }
    }
}