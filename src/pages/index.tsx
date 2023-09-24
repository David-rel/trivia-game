import { useState } from "react";
import CategorySelector from "../components/CategorySelector";
import axios from "axios";
import Link from "next/link";

import { Dispatch, SetStateAction } from "react";

export default function Home({ categories }: { categories: any[] }) {
  const [category, setCategory] = useState<number>(0);
  const [amount, setAmount] = useState<number>(10);

  const startTrivia = async () => {
    window.location.href = `/trivia?category=${category}&amount=${amount}`;
  };

  const handleCategoryChange: Dispatch<SetStateAction<number>> = (
    value: SetStateAction<number>
  ) => {
    if (typeof value === "function") {
      setCategory((prevCategory) => value(prevCategory));
    } else {
      setCategory(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Start Trivia</h1>
        <CategorySelector
          categories={categories}
          onCategoryChange={handleCategoryChange}
        />
        <div className="mt-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Questions
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            className="mt-1 p-2 w-full border rounded-md"
          />
        </div>
        <button
          onClick={startTrivia}
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          Start
        </button>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const categoriesResponse = await axios.get(
    "https://opentdb.com/api_category.php"
  );
  const categories = categoriesResponse.data.trivia_categories;
  return {
    props: {
      categories,
    },
  };
}
