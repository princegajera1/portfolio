import { useState, useMemo } from 'react';
import { FiSearch, FiChevronLeft, FiChevronRight, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export default function DataTable({
  columns,
  data,
  searchPlaceholder = 'Search records...',
  searchKey,
  onRowClick,
  actions,
  loading = false,
  emptyStateText = 'No records found.',
  enablePagination = true,
  pageSize = 10,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Search filter
  const filteredData = useMemo(() => {
    if (!searchQuery || !searchKey) return data;
    return data.filter((row) => {
      const value = row[searchKey];
      if (value === undefined || value === null) return false;
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [data, searchQuery, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (aVal === undefined || aVal === null) return 1;
      if (bVal === undefined || bVal === null) return -1;

      if (aVal < bVal) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = useMemo(() => {
    if (!enablePagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, enablePagination, currentPage, pageSize]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      {searchKey && (
        <div className="relative max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary-dark w-4 h-4" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full h-10 pl-10 pr-4 bg-[#111118] border border-border-dark rounded-xl text-xs font-mono text-text-primary-dark placeholder-text-secondary-dark outline-none focus:border-primary transition-all duration-300"
          />
        </div>
      )}

      {/* Responsive Wrapper */}
      <div className="bg-[#1A1A24] border border-border-dark rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-text-secondary-dark">
            Loading data records...
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="p-8 text-center text-xs font-mono text-text-secondary-dark">
            {emptyStateText}
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border-dark bg-[#14141E] text-text-secondary-dark text-[10px] font-mono uppercase font-bold tracking-wider select-none">
                    {columns.map((col) => (
                      <th
                        key={col.key}
                        onClick={() => col.sortable && requestSort(col.key)}
                        className={cn(
                          "py-4 px-6 font-bold",
                          col.sortable && "cursor-pointer hover:text-text-primary-dark transition-colors",
                          col.className
                        )}
                      >
                        <div className="flex items-center gap-1">
                          <span>{col.label}</span>
                          {col.sortable && sortConfig?.key === col.key && (
                            sortConfig.direction === 'ascending' ? 
                            <FiChevronUp className="w-3.5 h-3.5 text-primary" /> : 
                            <FiChevronDown className="w-3.5 h-3.5 text-primary" />
                          )}
                        </div>
                      </th>
                    ))}
                    {actions && <th className="py-4 px-6 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-dark text-xs">
                  {paginatedData.map((row, idx) => (
                    <tr
                      key={row.id || idx}
                      onClick={() => onRowClick && onRowClick(row)}
                      className={cn(
                        "hover:bg-white/2 transition-colors duration-300",
                        onRowClick && "cursor-pointer"
                      )}
                    >
                      {columns.map((col) => (
                        <td key={col.key} className={cn("py-4 px-6 text-text-primary-dark font-sans", col.cellClassName)}>
                          {col.render ? col.render(row[col.key], row) : row[col.key]}
                        </td>
                      ))}
                      {actions && (
                        <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                          {actions(row)}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Grid View */}
            <div className="block md:hidden divide-y divide-border-dark">
              {paginatedData.map((row, idx) => (
                <div
                  key={row.id || idx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className="p-5 space-y-4 active:bg-white/5 transition-colors"
                >
                  {columns.map((col) => (
                    <div key={col.key} className="flex flex-col gap-1">
                      <span className="text-[9px] font-mono text-text-secondary-dark uppercase font-black">
                        {col.label}
                      </span>
                      <div className="text-xs text-text-primary-dark font-sans">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </div>
                    </div>
                  ))}
                  {actions && (
                    <div className="flex justify-end pt-2" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination Controls */}
      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 font-mono text-[10px] uppercase text-text-secondary-dark select-none">
          <span>
            Page {currentPage} of {totalPages} ({filteredData.length} records)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-[#1A1A24] border border-border-dark rounded-lg hover:text-primary disabled:opacity-30 disabled:hover:text-text-secondary-dark transition-all active:scale-95"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-[#1A1A24] border border-border-dark rounded-lg hover:text-primary disabled:opacity-30 disabled:hover:text-text-secondary-dark transition-all active:scale-95"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
