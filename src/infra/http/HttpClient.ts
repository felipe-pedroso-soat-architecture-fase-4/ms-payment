import axios from "axios";

export default interface HttpClient {
	get (url: string): Promise<any>;
	post (url: string, data: any): Promise<any>;
	put (url: string, data: any): Promise<any>;
}

// Frameworks and Drivers
export class AxiosAdapter implements HttpClient {

	async get(url: string): Promise<any> {
		const response = await axios.get(url);
		return response.data;
	}

	async post(url: string, data: any): Promise<any> {
		const response = await axios.post(url, data);
		return response.data;
	}

	async put(url: string, data: any): Promise<any> {
		const response = await axios.put(url, data);
		return response.data;
	}
}