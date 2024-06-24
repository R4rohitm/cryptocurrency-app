"use client";
import { useEffect, useState } from "react";

import { fetchCryptoDetails, fetchCryptocurrencies } from "../../lib/api";
import { CryptoCurrency } from "../../types/cryptocurrency";
import { FadeLoader } from "react-spinners";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

const DetailsPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  const [crypto, setCrypto] = useState<CryptoCurrency | null>(null);
  const [allCryptos, setAllCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>("");

  console.log(allCryptos);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Run both fetches in parallel
        const [cryptoData, allCryptosData] = await Promise.all([
          fetchCryptoDetails(id),
          fetchCryptocurrencies(),
        ]);
        setCrypto(cryptoData);
        setAllCryptos(allCryptosData.slice(0, 12));
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch crypto details");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = new Intl.DateTimeFormat("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
    setCurrentDate(formattedDate);
  }, []);

  if (loading) {
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <FadeLoader color="#C0C2C9" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!crypto) {
    return <div>No data found</div>;
  }

  return (
    <>
      <div className="container mx-auto mt-8 p-4 ">
        <h1 className="text-2xl font-bold mb-8">{crypto.name} Details</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 justify-between">
          <div>
            <img
              src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
              className="w-20 h-20"
            />
          </div>
          <div className="flex flex-col justify-between">
            <h3 className="text-xl font-bold">
              {crypto.name} ({crypto.symbol})
            </h3>
            <p className="text-slate-700 font-semibold">{currentDate}</p>
          </div>
          <p className="font-bold">
            <span className="text-slate-500 font-bold uppercase mr-4">
              Price (USD):
            </span>{" "}
            ${parseFloat(crypto.priceUsd).toFixed(2)}
          </p>
          <div className="flex flex-col justify-between">
            <p className="font-bold">
              <span className="text-slate-500 font-bold uppercase mr-4">
                Market Cap (USD):
              </span>{" "}
              ${formatNumber(parseFloat(crypto.marketCapUsd))}
            </p>
            <p
              className={`font-bold ${
                parseFloat(crypto.changePercent24Hr) < 0
                  ? "text-red-600"
                  : "text-green-600"
              } `}
            >
              <span className="text-slate-500 font-bold uppercase mr-4">
                Change:
              </span>{" "}
              {parseFloat(crypto.changePercent24Hr).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="container mx-auto p-4 mt-20">
        <h2 className="text-2xl font-bold mb-6">
          Top Ranked Crypto Currencies
        </h2>
        <div className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-8">
          {allCryptos.map((crypto) => (
            <Link key={crypto.id} href={`/${crypto.id}`}>
              <div className=" flex justify-between p-3 min-h-24 max-w-60 cursor-pointer hover:scale-110 transition duration-300 shadow-md rounded-md">
                <div className="flex flex-col justify-between">
                  <img
                    src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
                    className="h-6 w-6"
                  />
                  <p className="text-xs ">{crypto.symbol}</p>
                </div>
                <div className="flex flex-col justify-between">
                  <h4 className="font-bold">{crypto.name}</h4>
                  <p>${parseFloat(crypto.priceUsd).toFixed(2)}</p>
                </div>
                <div className="flex flex-col justify-between">
                  <h4>{formatNumber(parseFloat(crypto.marketCapUsd))}</h4>
                  <p
                    className={`font-bold ${
                      parseFloat(crypto.changePercent24Hr) < 0
                        ? "text-red-600"
                        : "text-green-600"
                    } `}
                  >
                    {parseFloat(crypto.changePercent24Hr).toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default DetailsPage;
