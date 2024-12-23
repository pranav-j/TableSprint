import Edit from "../assets/edit.svg";
import Delete from "../assets/delete.svg";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState
  } from '@tanstack/react-table'
  import { useState } from 'react'
  import { FaSort } from 'react-icons/fa'
  
  type Category = {
    id: number
    categoryName: string
    image: string
    status: 'Active' | 'Inactive'
    sequence: number
  }
  
  const data: Category[] = [
    {
      id: 123,
      categoryName: 'Dal & Pulses',
      image: 'https://picsum.photos/200',
      status: 'Active',
      sequence: 1,
    },
    {
      id: 124,
      categoryName: 'Ghee & Oils',
      image: 'https://picsum.photos/200/300',
      status: 'Inactive',
      sequence: 2,
    },
    {
      id: 125,
      categoryName: 'Tea',
      image: 'https://picsum.photos/400',
      status: 'Inactive',
      sequence: 3,
    },
    {
      id: 126,
      categoryName: 'Atta & Flours',
      image: 'https://picsum.photos/2008',
      status: 'Inactive',
      sequence: 3,
    },
  ]
  
  const columnHelper = createColumnHelper<Category>()
  
  const CategoryTable = () => {
    const [sorting, setSorting] = useState<SortingState>([])
  
    const handleEdit = (id: number) => {
      console.log('Edit clicked for ID:', id)
    }
  
    const handleDelete = (id: number) => {
      console.log('Delete clicked for ID:', id)
    }
  
    const columns = [
      columnHelper.accessor('id', {
        header: 'Id',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('categoryName', {
        header: 'Category name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('image', {
        header: 'Image',
        cell: info => (
          <img 
            src={info.getValue()}
            alt={info.row.original.categoryName}
            className="h-10 w-10 object-cover rounded mx-auto"
          />
        ),
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: info => (
          <span className={`${
            info.getValue() === 'Active' 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('sequence', {
        header: 'Sequence',
        cell: info => info.getValue(),
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Action',
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
    ]
  
    const table = useReactTable({
      data,
      columns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    })
  
    return (
      <div className="overflow-x-auto py-2">
        <table className="min-w-full bg-white">
          <thead className="bg-[#F4EDAF] border-b-[10px] border-white">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
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
                      {header.column.id !== 'actions' && (
                        <FaSort className="text-gray-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {table.getRowModel().rows.map(row => (
              <tr 
                key={row.id} 
                className="bg-[#F2F2F2] hover:bg-gray-200"
              >
                {row.getVisibleCells().map(cell => (
                  <td
                    key={cell.id}
                    className="px-6 py-4 whitespace-nowrap text-base text-gray-900 border-b-[10px] border-white text-center"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default CategoryTable;