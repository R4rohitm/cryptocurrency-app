"use client";
import { useEffect, useState } from "react";
import { fetchCryptocurrencies } from "../lib/api";
import { CryptoCurrency } from "../types/cryptocurrency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FadeLoader } from "react-spinners";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";

type SortKeys = keyof Pick<
  CryptoCurrency,
  "symbol" | "name" | "priceUsd" | "marketCapUsd"
>;

const HomePage = () => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [filteredCryptos, setFilteredCryptos] = useState<CryptoCurrency[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKeys>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingFavorites, setLoadingFavorites] = useState<boolean>(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCryptocurrencies();
      setCryptos(data);
      if (sortBy) {
        setFilteredCryptos([
          ...data.sort((a: CryptoCurrency, b: CryptoCurrency) =>
            a[sortBy] > b[sortBy] ? 1 : -1
          ),
        ]);
      } else {
        setFilteredCryptos(data);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [sortBy]);

  useEffect(() => {
    const loadFavorites = async () => {
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
      setLoadingFavorites(false);
    };
    loadFavorites();
  }, []);

  useEffect(() => {
    if (!loadingFavorites) {
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }, [favorites, loadingFavorites]);

  useEffect(() => {
    const filtered = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCryptos(filtered);
  }, [searchQuery, cryptos]);

  const handleSort = (key: SortKeys) => {
    setSortBy(key);
    setFilteredCryptos((prevCryptos) =>
      [...prevCryptos].sort((a, b) => (a[key] > b[key] ? 1 : -1))
    );
  };

  const handleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const totalPages = Math.ceil(filteredCryptos.length / itemsPerPage);
  const paginatedCryptos = filteredCryptos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loadingFavorites || cryptos.length === 0) {
    return (
      <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center">
        <FadeLoader color="#C0C2C9" />;
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-12 mb-8 py-6 px-4 md:px-20 rounded-md shadow-md border">
      <h1 className="text-2xl font-bold mb-4">Cryptocurrency Prices</h1>
      <Input
        type="search"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-8 mb-8 sm:w-[200px] md:w-[300px] lg:w-[400px]"
      />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead onClick={() => handleSort("symbol")} className=" ">
              <div
                className="flex items-center gap-2 w-fit hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-transparent"
                title="sort by symbol"
              >
                Symbol{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="w-4 h-4"
                >
                  <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                </svg>
              </div>
            </TableHead>
            <TableHead onClick={() => handleSort("name")}>
              <div
                className="flex items-center gap-2 w-fit hover:cursor-pointer hover:bg-slate-100 dark:hover:bg-transparent"
                title="sort by name"
              >
                Name{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 320 512"
                  className="w-4 h-4"
                >
                  <path d="M41 288h238c21.4 0 32.1 25.9 17 41L177 448c-9.4 9.4-24.6 9.4-33.9 0L24 329c-15.1-15.1-4.4-41 17-41zm255-105L177 64c-9.4-9.4-24.6-9.4-33.9 0L24 183c-15.1 15.1-4.4 41 17 41h238c21.4 0 32.1-25.9 17-41z" />
                </svg>
              </div>
            </TableHead>
            <TableHead>Price (USD)</TableHead>
            <TableHead>Market Cap (USD)</TableHead>
            <TableHead>Favorites</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedCryptos.map((crypto) => (
            <TableRow key={crypto.id}>
              <TableCell>{crypto.rank}</TableCell>
              <TableCell className="flex items-center gap-2">
                <img
                  src={`https://assets.coincap.io/assets/icons/${crypto.symbol.toLowerCase()}@2x.png`}
                  className="h-6 w-6"
                />
                {crypto.symbol}
              </TableCell>
              <TableCell>
                <Link
                  href={`/${crypto.id}`}
                  className="text-blue-500 hover:underline"
                >
                  {crypto.name}
                </Link>
              </TableCell>
              <TableCell>${parseFloat(crypto.priceUsd).toFixed(2)}</TableCell>
              <TableCell>
                ${formatNumber(parseFloat(crypto.marketCapUsd))}
              </TableCell>
              <TableCell>
                <button
                  className={`w-28 px-2 py-1 flex items-center gap-2 rounded-md ${
                    favorites.includes(crypto.id)
                      ? " text-black dark:text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  onClick={() => handleFavorite(crypto.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={favorites.includes(crypto.id) ? "red" : "none"}
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-heart"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  {favorites.includes(crypto.id) ? "Unfavorite" : "Favorite"}
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
        <PaginationPrevious
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`${
            currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Previous
        </PaginationPrevious>
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index} className="cursor-pointer">
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                className={
                  currentPage === index + 1 ? "bg-black text-white" : ""
                }
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>
        <PaginationNext
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={`${
            currentPage === totalPages ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          Next
        </PaginationNext>
      </Pagination>
    </div>
  );
};

export default HomePage;
