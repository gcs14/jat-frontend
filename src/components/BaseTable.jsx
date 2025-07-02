import React from 'react';
import PropTypes from 'prop-types';

export default function BaseTable({ data, columns, renderActions, sortConfig, onSort }) {
  const getIndicator = key => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  return (
    <div className="overflow-x-auto bg-white rounded shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(col => (
              <th
                key={col.accessor}
                className={
                  `px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider` +
                  (col.sortable ? ' cursor-pointer' : '')
                }
                onClick={() => col.sortable && onSort(col.accessor)}
              >
                {col.header} {col.sortable && getIndicator(col.accessor)}
              </th>
            ))}
            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map(row => (
            <tr key={row.id || row.applicationId}>
              {columns.map(col => (
                <td key={col.accessor} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {row[col.accessor]}
                </td>
              ))}
              <td className="px-6 py-4 whitespace-nowrap text-center">
                <div className="flex justify-center space-x-2">
                  {renderActions(row)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

BaseTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      sortable: PropTypes.bool
    })
  ).isRequired,
  renderActions: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({ key: PropTypes.string, direction: PropTypes.string }).isRequired,
  onSort: PropTypes.func.isRequired
};
