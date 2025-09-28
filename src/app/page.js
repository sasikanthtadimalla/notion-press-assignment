"use client";
import Table from "@/components/table";
import { useRef, useState } from "react";
import Papa from "papaparse";

export default function Home() {
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const [csvDataOriginal, setCsvDataOriginal] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searching, setSearching] = useState(false);

  // PAGINATION RELATED
  const [csvDataHidden, setCsvDataHidden] = useState([]);
  const [csvDataHidden2, setCsvDataHidden2] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [numberOfRowsToShow, setNumberOfRowsToShow] = useState(1000);
  const [startingIndex, setStartingIndex] = useState(0);
  const [endingIndex, setEndingIndex] = useState(numberOfRowsToShow);
  const [currentPage, setCurrentPage] = useState(1);

  // SORTING RELATED
  const [ascending, setAscending] = useState(true);

  const uploadCSV = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const _startingIndex = 0;
    const _endingIndex = 1000;

    setSearchKeyword("");
    setStartingIndex(_startingIndex);
    setEndingIndex(_endingIndex);
    setNumberOfRowsToShow(1000);
    setCurrentPage(1);
    setSearching(false);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data = results.data.map((e, i) => {
          return {
            id: i + 1,
            ...e,
          };
        });

        setCsvDataOriginal(data);
        setCsvDataHidden(data);
        setCsvDataHidden2(data);
        setCsvData(data.slice(startingIndex, endingIndex));

        setLoading(false);
      },
    });
  };

  const goToPrevious = () => {
    const _startingIndex = startingIndex - numberOfRowsToShow;
    const _endingIndex = endingIndex - numberOfRowsToShow;
    setStartingIndex(_startingIndex);
    setEndingIndex(_endingIndex);
    setCsvData(csvDataHidden.slice(_startingIndex, _endingIndex));
    setCurrentPage((prev) => --prev);
  };

  const goToNext = () => {
    const _startingIndex = startingIndex + numberOfRowsToShow;
    const _endingIndex = endingIndex + numberOfRowsToShow;
    setStartingIndex(_startingIndex);
    setEndingIndex(_endingIndex);
    setCsvData(csvDataHidden.slice(_startingIndex, _endingIndex));
    setCurrentPage((prev) => ++prev);
  };

  const editValue = (key, value, id) => {
    setCsvDataHidden((prev) => {
      return prev.map((e) => {
        return {
          ...e,
          [key]: e.id === id ? value : e[key],
          edited: e.edited ? e.edited : e.id === id ? true : false,
        };
      });
    });
    setCsvDataHidden2((prev) => {
      return prev.map((e) => {
        return {
          ...e,
          [key]: e.id === id ? value : e[key],
          edited: e.edited ? e.edited : e.id === id ? true : false,
        };
      });
    });
    setCsvData((prev) => {
      return prev.map((e) => {
        return {
          ...e,
          [key]: e.id === id ? value : e[key],
          edited: e.edited ? e.edited : e.id === id ? true : false,
        };
      });
    });
  };

  const search = (e) => {
    const keyword = e.target.value.trim();
    setSearchKeyword(keyword);

    const _startingIndex = 0;
    const _endingIndex = numberOfRowsToShow;

    setStartingIndex(_startingIndex);
    setEndingIndex(_endingIndex);
    setCurrentPage(1);

    setTimeout(() => {
      if (keyword.length > 0) {
        const filteredData = csvDataHidden2.filter((e) => {
          return e.Title.toLowerCase().includes(keyword.toLowerCase());
        });

        setCsvDataHidden(filteredData);
        setCsvData(filteredData.slice(_startingIndex, _endingIndex));
        setSearching(true);
      } else {
        setCsvDataHidden(csvDataHidden2);
        setCsvData(csvDataHidden2.slice(startingIndex, endingIndex));
        setSearching(false);
      }
    }, 200);
  };

  const downloadCsv = () => {
    // Convert JSON -> CSV string
    const csv = Papa.unparse(csvDataHidden2);

    // Create a Blob
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Book_Data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllEdits = () => {
    const _startingIndex = 0;
    const _endingIndex = 1000;

    setSearchKeyword("");
    setCsvDataHidden(csvDataOriginal);
    setCsvDataHidden2(csvDataOriginal);
    setCsvData(csvDataOriginal.slice(_startingIndex, _endingIndex));
    setStartingIndex(_startingIndex);
    setEndingIndex(_endingIndex);
    setNumberOfRowsToShow(1000);
    setCurrentPage(1);
    setSearching(false);
  };

  const sort = (key) => {
    const merge = (leftArray, rightArray) => {
      const results = [];

      let i = 0;
      let j = 0;

      if (ascending) {
        while (i < leftArray.length && j < rightArray.length) {
          if (leftArray[i][key] < rightArray[j][key]) {
            results.push(leftArray[i]);
            i++;
          } else {
            results.push(rightArray[j]);
            j++;
          }
        }
      } else {
        while (i < leftArray.length && j < rightArray.length) {
          if (leftArray[i][key] > rightArray[j][key]) {
            results.push(leftArray[i]);
            i++;
          } else {
            results.push(rightArray[j]);
            j++;
          }
        }
      }

      while (i < leftArray.length) {
        results.push(leftArray[i]);
        i++;
      }

      while (j < rightArray.length) {
        results.push(rightArray[j]);
        j++;
      }

      return results;
    };

    const mergeSort = (array) => {
      if (array.length <= 1) return array;

      const midIndex = Math.floor(array.length / 2);
      const leftArray = mergeSort(array.slice(0, midIndex));
      const rightArray = mergeSort(array.slice(midIndex));

      return merge(leftArray, rightArray);
    };

    const a = mergeSort(csvDataHidden);

    const _startingIndex = 0;
    const _endingIndex = numberOfRowsToShow;

    setCsvDataHidden(a);
    setCsvDataHidden2(a);
    setCsvData(a.slice(_startingIndex, _endingIndex));
    setStartingIndex(_startingIndex);
    setEndingIndex(_endingIndex);
    setCurrentPage(1);

    setAscending((prev) => !prev);
  };

  const changeNumberofRows = (e) => {
    const value = parseInt(e.target.value);
    setNumberOfRowsToShow(value);
    setCsvData(csvDataHidden.slice(0, value));
    setStartingIndex(0);
    setEndingIndex(value);
    setCurrentPage(1);
    setSearchKeyword("");
  };

  return (
    <div className="p-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Details of Books
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the details of books in the uploaded CSV file.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Built using <strong>NextJS, ReactJS, Tailwind CSS</strong>.
          </p>
          <p className="mt-2 text-sm text-gray-700">
            Used <strong>Merge Sorting Algorithm</strong> to sort.
          </p>
        </div>
        <input
          hidden
          type="file"
          accept=".csv"
          onChange={uploadCSV}
          ref={fileRef}
        />
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => fileRef.current.click()}
          >
            Upload CSV
          </button>
        </div>
      </div>
      {!loading && (
        <div className="mt-8">
          <div className="flex items-center justify-between gap-3">
            <input
              placeholder="Search title"
              value={searchKeyword}
              onChange={search}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <button
              type="button"
              className="cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={resetAllEdits}
              title="Reset All Edits"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button
              type="button"
              className="cursor-pointer block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 "
              onClick={downloadCsv}
              title="Download"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2.25a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V3a.75.75 0 0 1 .75-.75Zm-9 13.5a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <Table data={csvData} editValue={editValue} sort={sort} />
          {!searching && (
            <div className="mt-10 flex items-center justify-between gap-2">
              <div className="mt-2 grid grid-cols-1">
                <select
                  className="cursor-pointer col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6"
                  value={numberOfRowsToShow}
                  onChange={changeNumberofRows}
                >
                  <option className="cursor-pointer" value={100}>
                    100 Rows
                  </option>
                  <option className="cursor-pointer" value={500}>
                    500 Rows
                  </option>
                  <option className="cursor-pointer" value={1000}>
                    1000 Rows
                  </option>
                  <option className="cursor-pointer" value={2000}>
                    2000 Rows
                  </option>
                </select>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="cursor-pointer size-3 col-start-1 row-start-1 mr-2 self-center justify-self-end text-gray-500"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-center gap-1">
                <button
                  type="button"
                  className="cursor-pointer inline-block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={goToPrevious}
                  disabled={startingIndex === 0}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="cursor-pointer inline-block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={goToNext}
                  disabled={endingIndex >= csvDataOriginal.length - 1}
                >
                  Next
                </button>
              </div>
              <div>
                {currentPage} of{" "}
                {Math.ceil(csvDataHidden.length / numberOfRowsToShow) <= 0
                  ? 1
                  : Math.ceil(csvDataHidden.length / numberOfRowsToShow)}{" "}
                pages
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
