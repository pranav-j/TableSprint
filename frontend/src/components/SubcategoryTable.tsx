import Edit from "../assets/edit.svg";
import Delete from "../assets/delete.svg";
import imagePlaceholder from "../assets/image.png";
import { setDeleteId, setEditSubCategoryId } from "../redux/tabAndFormSlice";
import axios from "axios";
import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";

import {
  fetchSubcategories,
  Subcategory,
} from "../redux/subcategorySlice";


const columnHelper = createColumnHelper<Subcategory>();

const SubcategoryTable = () => {
  const dispatch = useAppDispatch();
  const searchParam = useAppSelector((state) => state.tabAndFormReducer.searchParam);
  const [ searchResults, setSearchResults ] = useState([]);
  const {
    subcategories,
    fetchSubcategoriesStatus,
    createSubcategoryStatus,
    error,
  } = useAppSelector((state) => state.subcategoryReducer);

  const [sorting, setSorting] = useState<SortingState>([]);


  useEffect(() => {
    if (searchParam?.trim() !== "") {
      const fetchSearchResults = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3000/api/subcategories/search`,
            {
              params: { query: searchParam },
              withCredentials: true,
            }
          );
          setSearchResults(response.data.subcategories)
          console.log("Search Results:", response.data.subcategories);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };

      fetchSearchResults();
    }
  }, [searchParam]);

  useEffect(() => {
    if (fetchSubcategoriesStatus === "idle") {
      dispatch(fetchSubcategories());
    }
  }, [fetchSubcategoriesStatus, dispatch, createSubcategoryStatus]);

  const handleEdit = (id: number) => {
    console.log("Edit clicked for ID:", id);
    // You can trigger a modal or navigate to an edit page
    dispatch(setEditSubCategoryId(id));
  };

  const handleDelete = (id: number) => {
    dispatch(setDeleteId(id));
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "Id",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("subcategoryName", {
      header: "Subcategory name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("categoryName", {
      header: "Category name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("image", {
        header: "Image",
        cell: (info) => {
          const imageUrl = info.getValue();
          return (
            <img
              src={imageUrl && imageUrl !== "" ? imageUrl : imagePlaceholder}
              alt={info.row.original.categoryName}
              className="h-10 w-10 object-cover rounded mx-auto"
              onError={(e) => {
                e.currentTarget.src = imagePlaceholder;
              }}
            />
          );
        },
      }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`${
            info.getValue() === "Active" ? "text-green-600" : "text-red-600"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("sequence", {
      header: "Sequence",
      cell: (info) => info.getValue(),
    }),
    columnHelper.display({
      id: "actions",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => handleEdit(row.original.id)}
          >
            <img src={Edit} alt="edit" />
          </button>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            onClick={() => handleDelete(row.original.id)}
          >
            <img src={Delete} alt="Delete" />
          </button>
        </div>
      ),
    }),
  ];

  const table = useReactTable({
    data: searchParam ? searchResults : subcategories,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (fetchSubcategoriesStatus === "pending") {
    return <p>Loading...</p>;
  }

  if (fetchSubcategoriesStatus === "rejected") {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="overflow-x-auto py-2">
      <table className="min-w-full bg-white">
        <thead className="bg-[#F4EDAF] border-b-[10px] border-white">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-center text-[20px] font-medium text-gray-700 tracking-wider cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center justify-center gap-2">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.id !== "actions" && (
                      <FaSort className="text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="bg-[#F2F2F2] hover:bg-gray-200">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 whitespace-nowrap text-base text-gray-900 border-b-[10px] border-white text-center"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubcategoryTable;