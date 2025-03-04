import axios from "axios";
import { CryptoPrices } from "./types";

const api = axios.create({
	baseURL: "https://api.coingecko.com/api/v3",
});

export const getCryptoPrices = async (): Promise<CryptoPrices> => {
	const response = await api.get("/simple/price", {
		params: {
			ids: "bitcoin,ethereum,binancecoin,cardano,solana,dogecoin,ripple,polkadot,chainlink,stellar",
			vs_currencies: "usd",
		},
	});
	return response.data;
};
