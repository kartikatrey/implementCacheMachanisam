import tableAPIService from "@/services/TableAPIService";
import constants from "@/resources/Constants";

export default class KnowledgeBaseService {

    constructor() {

	}

	static fetchCount() {
        return new Promise((resolve, reject) => {
            let tableAPI = new tableAPIService();
            tableAPI.addQuery({ active: true });
            tableAPI.countRecord(constants.KNWOLEDGE_BASE_ENDPOINT, (error, response) => {
                error ? reject(error) : resolve(response.count);

            });

        })
	}

	static fetchKnowledgeBaseById(recordId) {
        return new Promise((resolve, reject) => {
            let tableAPI = new tableAPIService();
            tableAPI.findById(constants.KNWOLEDGE_BASE_ENDPOINT, recordId, (error, response) => {
                error ? reject(error) : resolve(response);
            });

        })
	}

	static save(formData) {
		if(!formData.isExternal){
			this.prepareData(formData);
		}
		

        return new Promise((resolve, reject) => {
            let tableAPI = new tableAPIService();
            tableAPI.upsert(constants.KNWOLEDGE_BASE_ENDPOINT, formData, (error, response) => {
                (error || (!response || !response.data || !response.data._id)) ? reject(error) : resolve(response.data);

            })
        })
	}

	static fetchKBList(){
		return new Promise((resolve, reject) => {
			const columnList = ["title"];
			let tableAPI = new tableAPIService();
			tableAPI.addSelectColumns(columnList);
			tableAPI.addQuery({ active: true });
			tableAPI.find(constants.KNWOLEDGE_BASE_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}


	static addExpandButtonCSS(button) {
		button.style.position = "absolute";
		button.className = "expand-button";
		button.style.bottom = "2px";
		button.style.right = "2px";
		button.style.color = "white";
		button.style.background = "black";
		button.style.border = "1px solid white";
		button.style.borderRadius = "30px";
		button.style.height = "48px";
		button.style.width = "48px";
	}

	static prepareData(formData){
		formData.content.forEach((rec,index) => {
			const div = document.createElement("div");
			div.innerHTML = rec;
			this.updateParagraphCSS(div);
			this.updateAnchorTag(div);
			this.updateImageTag(div);
			formData.content[index] = div.innerHTML;
		});
	}


	static updateParagraphCSS(element) {
		let paragraph = Array.from(element.getElementsByTagName("p"));
		paragraph.forEach(p => {
			p.style.padding = "0";
			p.style.margin = "0";
		});
	}

	static updateAnchorTag(element) {
		let anchor_tags = Array.from(element.getElementsByTagName("a"));
		anchor_tags.forEach(tag =>{
			let open_link = tag.getAttribute("href");
			tag.setAttribute("onclick","window.open('"+open_link+"','_system'); return false");
		});
	}

	static updateImageTag(div){
		const imgs = Array.from(div.getElementsByTagName("img"));
		imgs.forEach(img =>{
			const imgP = img.parentElement;
			const button = document.createElement("ion-button");
			const icon = document.createElement("ion-icon");
			this.addExpandButtonCSS(button);
			imgP.style.position = "relative";
			button.appendChild(icon).setAttribute("name","expand");
			let image_src = img.getAttribute("src");
			button.setAttribute("onclick","openExpandImageModal()");
			button.setAttribute("fill", "clear");
			imgP.appendChild(button);
		});
	}

}
