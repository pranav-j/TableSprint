import Edit from "../assets/edit.svg";
import Delete from "../assets/delete.svg";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { FaSort } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../redux/reduxHooks";
import { fetchProducts, deleteProduct, Product } from "../redux/productSlice";
import { RootState } from "../redux/store";
import { setEditProductId } from "../redux/tabAndFormSlice";

const columnHelper = createColumnHelper<Product>();

const ProductTable = () => {
  const dispatch = useAppDispatch();
  const { products, fetchProductsStatus, createProductStatus, error } =
    useAppSelector((state: RootState) => state.productReducer);

  const [sorting, setSorting] = useState<SortingState>([]);

  useEffect(() => {
    if (fetchProductsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [fetchProductsStatus, dispatch, createProductStatus]);

  const handleEdit = (id: number) => {
    console.log("Edit clicked for ID:", id);
    // You can trigger a modal or navigate to an edit page
    dispatch(setEditProductId(id));
  };

  const handleDelete = (id: number) => {
    dispatch(deleteProduct(id));
  };

  const columns = [
    columnHelper.accessor("id", {
      header: "Id",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("productName", {
      header: "Product name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("categoryName", {
      header: "Category name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("subcategoryName", {
      header: "Subcategory name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("image", {
      header: "Image",
      cell: (info) => (
        <img
          src={info.getValue()}
          alt={info.row.original.productName}
          className="h-10 w-10 object-cover rounded mx-auto"
        />
      ),
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
    data: products,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (fetchProductsStatus === "pending") {
    return <p>Loading...</p>;
  }

  if (fetchProductsStatus === "rejected") {
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

export default ProductTable;