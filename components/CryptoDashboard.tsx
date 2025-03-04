"use client";

import { useState } from "react";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { getCryptoPrices } from "@/lib/api";
import { CryptoNames, CryptoPrices } from "@/lib/types";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchInterval: 60000,
			staleTime: 0,
			gcTime: 0,
		},
	},
});

const CryptoDashboardInner = () => {
	const [searchTerm, setSearchTerm] = useState<string>("");

	const { data, isLoading, isFetching, refetch } = useQuery<CryptoPrices>({
		queryKey: ["cryptoPrices"],
		queryFn: async () => {
			console.log("Fetching crypto prices");
			const result = await getCryptoPrices();
			console.log("Fetch completed with data:", result);
			return result;
		},
	});

	const cryptoNames: CryptoNames = {
		bitcoin: "Bitcoin (BTC)",
		ethereum: "Ethereum (ETH)",
		binancecoin: "BNB (BNB)",
		cardano: "Cardano (ADA)",
		solana: "Solana (SOL)",
		dogecoin: "Dogecoin (DOGE)",
		ripple: "Ripple (XRP)",
		polkadot: "Polkadot (DOT)",
		chainlink: "Chainlink (LINK)",
		stellar: "Stellar (XLM)",
	};

	const filteredData: CryptoPrices = data
		? Object.entries(data)
				.filter(([coin]) =>
					cryptoNames[coin].toLowerCase().includes(searchTerm.toLowerCase())
				)
				.reduce((obj, [key, value]) => {
					obj[key] = value;
					return obj;
				}, {} as CryptoPrices)
		: {};

	const handleRefresh = () => {
		refetch();
	};

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">Crypto Dashboard</h1>

			<div className="mb-4 flex gap-4">
				<input
					type="text"
					placeholder="Search cryptocurrencies..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="flex-1 p-2 border rounded"
				/>
				<button
					onClick={handleRefresh}
					className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
					disabled={isFetching}
				>
					Refresh
				</button>
			</div>

			{isFetching ? (
				<div className="text-center py-8">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
					<p className="mt-2">Loading prices...</p>
				</div>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{Object.entries(filteredData).map(([coin, prices]) => (
						<div
							key={coin}
							className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
						>
							<h2 className="text-lg font-semibold">{cryptoNames[coin]}</h2>
							<p className="text-2xl mt-2">${prices.usd.toLocaleString()}</p>
						</div>
					))}
					{Object.keys(filteredData).length === 0 && (
						<p className="col-span-full text-center py-4">
							No cryptocurrencies match your search
						</p>
					)}
				</div>
			)}
		</div>
	);
};

const CryptoDashboard = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<CryptoDashboardInner />
		</QueryClientProvider>
	);
};

export default CryptoDashboard;
