import { nanoid } from "nanoid";
import { useState } from "react";

export default function Table({ data, editValue, sort }) {
  return (
    <div className="">
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="relative min-w-full divide-y divide-gray-300 ">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-0 cursor-pointer"
                    onClick={() => sort('Title')}
                  >
                    <span className="flex items-center gap-1">
                      Title
                      <SortIcon />
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => sort('Author')}
                  >
                    <span className="flex items-center gap-1">
                      Author
                      <SortIcon />
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => sort('Genree')}
                  >
                    <span className="flex items-center gap-1">
                      Genre
                      <SortIcon />
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => sort('PublishedYear')}
                  >
                    <span className="flex items-center gap-1">
                      Published Year
                      <SortIcon />
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="pl-3 py-3.5 text-right text-sm font-semibold text-gray-900 cursor-pointer"
                    onClick={() => sort('ISBN')}
                  >
                    <span className="flex items-center gap-1">
                      ISBN
                      <SortIcon />
                    </span>
                  </th>
                  {/* <th scope="col" className="py-3.5 pr-4 pl-3 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((e, i) => (
                  <tr key={nanoid(20)}>
                    <FirstRow data={e} editValue={editValue} />
                    <td className="px-2 py-1 text-sm whitespace-nowrap text-gray-500">
                      {e.Author}
                    </td>
                    <td className="px-3 py-1 text-sm whitespace-nowrap text-gray-500">
                      {e.Genree}
                    </td>
                    <td className="px-3 py-1 text-sm whitespace-nowrap text-gray-500">
                      {e.PublishedYear}
                    </td>
                    <td className="py-1 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-0">
                      {e.ISBN}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const FirstRow = ({ data, editValue }) => {
  const [edit, setEdit] = useState(false);
  const [value, setValue] = useState(data.Title);

  const submit = (e) => {
    e.preventDefault ? e.preventDefault() : null;
    editValue("Title", value, data.id);
  };

  const css = ' '

  return (
    <td className={data.edited ? "bg-[#fef3c7] py-1 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0 group flex items-center justify-between" : "py-1 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-0 group flex items-center justify-between"}>
      {edit ? (
        <form onSubmit={submit}>
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button type="submit" hidden></button>
        </form>
      ) : (
        value
      )}
      <div>
        {edit && (
          <button
            onClick={submit}
            className="mr-1 hidden group-hover:inline-block rounded-md cursor-pointer bg-indigo-600 px-1.5 py-1.5 text-center text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
        <button
          onClick={() => setEdit((prev) => !prev)}
          className="hidden group-hover:inline-block rounded-md cursor-pointer bg-indigo-600 px-1.5 py-1.5 text-center text-sm text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-4"
          >
            <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
          </svg>
        </button>
      </div>
    </td>
  );
};

const SortIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-3"
    >
      <path
        fillRule="evenodd"
        d="M6.97 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.25 4.81V16.5a.75.75 0 0 1-1.5 0V4.81L3.53 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5Zm9.53 4.28a.75.75 0 0 1 .75.75v11.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V7.5a.75.75 0 0 1 .75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
};
