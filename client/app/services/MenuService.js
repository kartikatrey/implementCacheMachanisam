import tableAPIService from "@/services/TableAPIService";
import AjaxService from "@/services/AjaxService";
import constants from "@/resources/Constants";
import _ from "lodash";

export default class MenuService {
	constructor() {}
	static fetchMenuList() {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			const columnList = ["label","children","parent_menu_id"];
			tableAPI.addSelectColumns(columnList);
			tableAPI.find(constants.MENU_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static getRoles(params) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.addQuery(params);
			tableAPI.find(constants.CP_ROLE_ENDPOINT, (error, response) => {
				error ? reject(error) : resolve(response);
			});
		});
	}
	static saveMenu(menuData) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.upsert(constants.MENU_ENDPOINT, menuData, (error, response) => {				
				if (error || (!response || !response.data || !response.data._id)) {
					let errorMessage = '';
					if(_.get(response, "data.name") == "MongoError")
						errorMessage = "It seems menu is already added in db";
					else 
						errorMessage = error || _.get(response, "data.message", "Error while saving menu data");
					return reject(errorMessage);
				}
				resolve(response.data);
			})
		})
	}
	static fetchById(id) {
		return new Promise((resolve, reject) => {
			let tableAPI = new tableAPIService();
			tableAPI.findById(constants.MENU_ENDPOINT, id, (error, response) => {
			return error ? reject(error) : resolve(response);
			});
		});
	}

	static fetchMenus(params) {
		var url = "/portal/api/menuItems";
		return new Promise((resolve, reject) => {
			AjaxService.getJson(url, params, (error, response) => {
				error ? reject(error):resolve(response.data);
			});
		});
	}

	static getChildMenusByUrl(menus,url){
		//get all the menus who have child 
		const childMenusList = _.filter(menus, (menu)=>{return menu.children && menu.children.length>0 && !menu.sub_menu})
		const activeChildMenu  = this.getActiveChildMenu(childMenusList,url);
		const childMenus = this.getChildMenusByMenuId(childMenusList,activeChildMenu.parent_menu_id);
		let childrens = _.isObject(childMenus) ? childMenus.children : [];
		return _.filter(childrens, { hidden: false });
	}

	static getActiveChildMenu(childMenusList,url){
		let activeMenu;
		for(let menu of childMenusList){
			if(menu.children){
				activeMenu = _.filter( menu.children,(item)=>{return _.lowerCase(item.url) == _.lowerCase(url)});
			}
		   	if(!_.isEmpty(activeMenu)){
			   break;
			}
		}
		return activeMenu && activeMenu[0] || {}
	}

	static getChildMenusByMenuId(menus,_id){
		return _.find(menus,{_id})
	}
}
