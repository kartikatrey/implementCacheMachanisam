export default class Json {
	static isJson(string) {
		try {
		    JSON.parse(string);
			return true;
		} catch (error) {
			return false;
		}
	}
}
