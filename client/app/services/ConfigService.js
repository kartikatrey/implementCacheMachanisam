import TableAPIService from "./TableAPIService";
import constants from "@/resources/Constants";

export default class configService{

	static fetch() {
		return new Promise((resolve, reject) => {
			let restifyService = new TableAPIService();
            restifyService.find(constants.HOST_ADDRESS_ENDPOINT, (error, response) => {
                error ? reject(error) : resolve(response[0]);
              });
		});
	}
}