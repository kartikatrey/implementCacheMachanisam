import AjaxService from "@/services/AjaxService";
export default class HelpMenuService {


    static getHelpVideos(params){
        return new Promise((resolve,reject)=>{
            AjaxService.getJson("/portal/api/help-videos",params, (err,res)=>{
                if(err){
                    console.log("Error in getHelpVideos::",err)
                    reject(err)
                }
                resolve(res)
            })
        })
    }   
}

