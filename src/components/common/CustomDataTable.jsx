import React from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-dt';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import { useTranslation, useDirection } from '../../context/DirectionContext';

// Initialize DataTables
DataTable.use(DT);

/**
 * Reusable DataTable component with built-in RTL support and translations
 * 
 * @param {Array} data - Array of data objects
 * @param {Array} columns - DataTables column configuration
 * @param {Object} options - Additional DataTables options (optional)
 * @param {string} className - Additional CSS classes (optional)
 * @param {Function} onRowClick - Callback when row is clicked (optional)
 * @param {React.ReactNode} children - Table header/footer elements
 */
function CustomDataTable({ 
  data, 
  columns, 
  options = {}, 
  className = '',
  onRowClick,
  children 
}) {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  // Default DataTables options with translations
  const defaultOptions = {
    responsive: true,
    pageLength: 10,
    language: {
      search: t('common.search'),
      lengthMenu: `${t('common.show')} _MENU_ ${t('common.entries')}`,
      info: `${t('common.showing')} _START_ ${t('common.to')} _END_ ${t('common.of')} _TOTAL_ ${t('common.entries')}`,
      paginate: {
        first: t('common.first'),
        last: t('common.last'),
        next: isRTL ? '←' : '→',
        previous: isRTL ? '→' : '←'
      },
      emptyTable: t('common.noData'),
      zeroRecords: t('common.noData')
    },
    order: [[0, 'asc']],
    dom: '<"datatable-header"lf>rt<"datatable-footer"ip>',
    ...options
  };

  // Handle row click
  const handleClick = (e) => {
    if (onRowClick) {
      const row = e.target.closest('tr');
      if (row && row.parentElement?.tagName === 'TBODY') {
        // Get the row index from the DataTables internal data
        // We need to find the correct data based on the rendered cells
        const cells = row.querySelectorAll('td');
        if (cells.length > 0) {
          // Find the row data by searching through our data array
          // This is more reliable than using rowIndex which can be wrong after sorting
          const rowIndex = Array.from(row.parentElement.children).indexOf(row);
          
          // Try to get the data-id from action buttons if available
          const actionBtn = row.querySelector('[data-id]');
          if (actionBtn) {
            const dataId = actionBtn.dataset.id;
            // Find by id (could be string or number)
            const foundData = data.find(d => String(d.id) === String(dataId));
            if (foundData) {
              onRowClick(foundData, e);
              return;
            }
          }
          
          // Fallback: try to match by first cell content or rowIndex
          if (data[rowIndex]) {
            onRowClick(data[rowIndex], e);
          }
        }
      }
    }
  };

  return (
    <div className="custom-datatable-wrapper" onClick={handleClick}>
      <DataTable
        data={data}
        columns={columns}
        options={defaultOptions}
        className={`display ${className}`}
      >
        {children}
      </DataTable>
    </div>
  );
}

export default CustomDataTable;
