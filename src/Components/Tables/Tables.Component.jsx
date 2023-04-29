import React, { useCallback, useState, useRef, memo, useEffect } from 'react';
import moment from 'moment';
import i18next from 'i18next';
import Table from '@mui/material/Table';
import { List } from 'react-virtualized';
import TableRow from '@mui/material/TableRow';
import { useEventListener } from '../../Hooks';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import { getDataFromObject } from '../../Helpers';
import TableFooter from '@mui/material/TableFooter';
import TableContainer from '@mui/material/TableContainer';
import TableSortLabel from '@mui/material/TableSortLabel';
import { ButtonBase, TablePagination } from '@mui/material';
import { LoaderComponent } from '../Loader/Loader.Component';
import { CheckboxesComponent } from '../Checkboxes/Checkboxes.Component';
import './Tables.Style.scss';

export const TablesComponent = memo(
  ({
    tableRowValidationArray,
    tableOptions,
    data,
    isScroll,
    headerData,
    footerData,
    sortColumnClicked,
    focusedRowChanged,
    dateFormat,
    headerRowRef,
    bodyRowRef,
    onHeaderColumnsReorder,
    isSelectAllDisabled,
    uniqueKeyInput,
    isWithCheckAll,
    isWithCheck,
    onSelectAllCheckboxChanged,
    onSelectCheckboxChanged,
    getIsSelectedRow,
    getIsDisabledRow,
    isSelectAll,
    isStickyCheckboxColumn,
    leftCheckboxColumn,
    rightCheckboxColumn,
    selectedRows,
    onSelectedRowsCountChanged,
    isResizable,
    isLoading,
    tableActions,
    isWithTableActions,
    tableActionsOptions,
    isDisabledActions,
    onActionClicked,
    isResizeCheckboxColumn,
    isOriginalPagination,
    paginationIdRef,
    onPageIndexChanged,
    totalItems,
    pageIndex,
    pageSize,
    onPageSizeChanged,
    onTableRowClicked,
    tableActionText,
    disabledRow,
  }) => {
    const [reorderedHeader, setReorderedHeader] = useState(null);
    const [currentDraggingColumn, setCurrentDraggingColumn] = useState(null);
    const [currentDragOverIndex, setCurrentDragOverIndex] = useState(null);
    const currentResizingColumnRef = useRef(null);
    const startResizePointRef = useRef(null);
    const [localSelectedRows, setLocalSelectedRows] = useState([]);
    const [currentOrderById, setCurrentOrderById] = useState(-1);
    const [, setActiveItem] = useState(null);
    const [currentOrderDirection, setCurrentOrderDirection] = useState('desc');
    const tableRef = useRef(null);
    const [focusedRow, setFocusedRow] = useState(-1);

    const descendingComparator = (a, b, orderBy) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;

      return 0;
    };
    const getComparator = (order, orderBy) =>
      order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    const createSortHandler = useCallback(
      (columnId) => () => {
        if (!tableOptions) return;
        setCurrentOrderDirection((item) => (item === 'desc' ? 'asc' : 'desc'));
        setCurrentOrderById(columnId);
        if (tableOptions.sortFrom === 2) sortColumnClicked(columnId, currentOrderDirection);
      },
      [currentOrderDirection, tableOptions, sortColumnClicked],
    );
    const stableSort = (array, comparator) => {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;

        return a[1] - b[1];
      });

      return stabilizedThis.map((el) => el[0]);
    };
    const getCurrentSelectedItemIndex = useCallback(
      (row) =>
        localSelectedRows.findIndex(
          (item) =>
            getDataFromObject(row, uniqueKeyInput) === getDataFromObject(item, uniqueKeyInput),
        ),
      [localSelectedRows, uniqueKeyInput],
    );
    const onSelectAllCheckboxChangedHandler = useCallback(
      (event) => {
        const isChecked = event.target.checked;
        if (!selectedRows)
          if (isChecked) setLocalSelectedRows([...data]);
          else setLocalSelectedRows([]);

        if (onSelectAllCheckboxChanged)
          onSelectAllCheckboxChanged({
            selectedRows: selectedRows || data,
            isChecked,
          });
      },
      [data, onSelectAllCheckboxChanged, selectedRows],
    );
    const onSelectCheckboxChangedHandler = useCallback(
      (row, rowIndex) => (event) => {
        event.stopPropagation();
        const isChecked = event.target.checked;
        if (!selectedRows)
          setLocalSelectedRows((items) => {
            const localRowIndex = getCurrentSelectedItemIndex(row);
            if (isChecked) items.push(row);
            else if (localRowIndex !== -1) items.splice(localRowIndex, 1);

            if (onSelectCheckboxChanged)
              onSelectCheckboxChanged({
                selectedRows: items,
                selectedRow: row,
                rowIndex,
              });

            return [...items];
          });
        else if (onSelectCheckboxChanged) onSelectCheckboxChanged({ selectedRow: row, rowIndex });
      },
      [getCurrentSelectedItemIndex, onSelectCheckboxChanged, selectedRows],
    );
    const bodyRowClicked = useCallback(
      (rowIndex, item) => {
        setActiveItem(item);
        if (focusedRow === -1 || focusedRow !== rowIndex)
          setFocusedRow(() => {
            focusedRowChanged(rowIndex, item);

            return rowIndex;
          });
        else
          setFocusedRow(() => {
            focusedRowChanged(-1);

            return -1;
          });
      },
      [focusedRow, focusedRowChanged],
    );
    // const getTableActionValue = (key) =>
    //   Object.values(TableActions).find((item) => item.key === key);
    const getSortDataName = () => {
      const currentHeader = (reorderedHeader || headerData).find(
        (item) => item.id === currentOrderById,
      );
      if (currentHeader) return currentHeader.input;

      return null;
    };
    const getStickyStyle = useCallback(
      (item) => ({
        position: window.screen.width >= 550 ? 'sticky' : 'initial',
        left:
          i18next.dir() === 'ltr'
            ? ((item.left || item.left === 0) && item.left) || 'initial'
            : ((item.right || item.right === 0) && item.right) || 'initial',
        right:
          i18next.dir() === 'ltr'
            ? ((item.right || item.right === 0) && item.right) || 'initial'
            : ((item.left || item.left === 0) && item.left) || 'initial',
        zIndex: 1,
      }),
      [],
    );
    const onDragColumnHandler = useCallback(
      (index) => (event) => {
        event.dataTransfer.setData('text', event.currentTarget.id);
        setCurrentDraggingColumn(index);
      },
      [],
    );
    const onDragEndColumnHandler = useCallback(() => {
      if (currentDragOverIndex !== null) setCurrentDragOverIndex(null);
    }, [currentDragOverIndex]);
    const onDragOverColumnHandler = useCallback(
      (index) => (event) => {
        event.preventDefault();
        if (currentDragOverIndex !== index) setCurrentDragOverIndex(index);
      },
      [currentDragOverIndex],
    );
    const onDropColumnHandler = useCallback(
      (index) => (event) => {
        event.preventDefault();
        if (!currentDraggingColumn && currentDraggingColumn !== 0) return;

        const localColumns = [...(reorderedHeader || headerData)];
        localColumns.splice(index, 0, localColumns.splice(currentDraggingColumn, 1)[0]);
        if (onHeaderColumnsReorder) onHeaderColumnsReorder(localColumns);
        else setReorderedHeader(localColumns);
      },
      [currentDraggingColumn, headerData, onHeaderColumnsReorder, reorderedHeader],
    );
    const onResizeDownHandler = useCallback(
      (idRef) => (event) => {
        event.preventDefault();
        if (!idRef) return;
        currentResizingColumnRef.current = document.querySelector(idRef);
        startResizePointRef.current = currentResizingColumnRef.current.offsetWidth - event.pageX;
      },
      [],
    );
    const onResizeMoveHandler = useCallback((event) => {
      if (!currentResizingColumnRef.current || startResizePointRef.current === null) return;
      currentResizingColumnRef.current.style.width = `${
        startResizePointRef.current + event.pageX
      }px`;
    }, []);
    const onResizeUpHandler = useCallback(() => {
      currentResizingColumnRef.current = null;
      currentResizingColumnRef.current = null;
    }, []);
    useEventListener('mousemove', onResizeMoveHandler);
    useEventListener('mouseup', onResizeUpHandler);

    const onActionClickedHandler = useCallback(
      (row, rowIndex) => (event) => {
        if (onActionClicked) onActionClicked(row, rowIndex, event);
      },
      [onActionClicked],
    );

    useEffect(() => {
      if ((selectedRows || localSelectedRows) && onSelectedRowsCountChanged)
        onSelectedRowsCountChanged((selectedRows || localSelectedRows).length);
    }, [localSelectedRows, onSelectedRowsCountChanged, selectedRows]);
    useEffect(() => {
      if (selectedRows) setLocalSelectedRows(selectedRows);
    }, [selectedRows]);

    const list = stableSort(data, getComparator(currentOrderDirection, getSortDataName()))
      .slice(
        ((onPageIndexChanged || onPageSizeChanged) && data.length <= pageSize
          ? 0
          : pageIndex * pageSize) || 0,
        ((onPageIndexChanged || onPageSizeChanged) && data.length <= pageSize
          ? pageSize
          : pageIndex * pageSize + pageSize) || data.length,
      )
      .map((row) => row);

    const renderRow = ({ index, key, style }) => {
      const isItemSelected = getCurrentSelectedItemIndex(list[index]) !== -1;

      return (
        <div className='table-row-wrapper' key={key} style={style}>
          <TableRow
            aria-checked={
              (getIsSelectedRow && getIsSelectedRow(list[index], index)) || isItemSelected
            }
            tabIndex={-1}
            selected={(getIsSelectedRow && getIsSelectedRow(list[index], index)) || isItemSelected}
            id={`${bodyRowRef}${index * (pageIndex + 1)}`}
            onClick={(event) => {
              event.stopPropagation();
              bodyRowClicked(index, list[index]);
            }}
            className={index === focusedRow ? 'table-row-overlay' : ''}
          >
            {(isWithCheck || getIsSelectedRow || selectedRows) && (
              <TableCell
                padding='checkbox'
                style={(list[index].isSticky && getStickyStyle(list[index])) || undefined}
              >
                <CheckboxesComponent
                  idRef={`tableSelectRef${index + 1}`}
                  singleChecked={
                    isSelectAll ||
                    (getIsSelectedRow && getIsSelectedRow(list[index], index)) ||
                    isItemSelected ||
                    false
                  }
                  isDisabled={
                    isSelectAllDisabled ||
                    (getIsDisabledRow && getIsDisabledRow(list[index], index))
                  }
                  onSelectedCheckboxChanged={onSelectCheckboxChangedHandler(list[index], index)}
                />
                <div />
              </TableCell>
            )}
            {headerData.length > 0 &&
              (reorderedHeader || headerData)
                .filter((column) => !column.isHidden)
                .map((column, columnIndex) => (
                  <TableCell
                    key={`bodyColumn${columnIndex * (pageIndex + 1) + index}`}
                    className={column.cellClasses || ''}
                    style={(column.isSticky && getStickyStyle(column)) || undefined}
                  >
                    {(column.isDate &&
                      ((getDataFromObject(list[index], column.input) &&
                        moment(getDataFromObject(list[index], column.input)).format(
                          column.dateFormat || tableOptions.dateFormat || dateFormat,
                        )) ||
                        '')) ||
                      (column.component &&
                        column.component(list[index], index, column, columnIndex)) ||
                      getDataFromObject(list[index], column.input)}
                  </TableCell>
                ))}
            {isWithTableActions && tableActionsOptions && (
              <TableCell
                key={`bodyActionsColumn${index + 1}`}
                className={`actions-cell-wrapper ${tableActionsOptions.cellClasses || ''}`}
                style={
                  (tableActionsOptions.isSticky && getStickyStyle(tableActionsOptions)) || undefined
                }
              >
                {(tableActionsOptions.component &&
                  tableActionsOptions.component(list[index], index)) ||
                  (tableActions &&
                    tableActions.map((item) => (
                      <ButtonBase
                        disabled={
                          (tableActionsOptions &&
                            tableActionsOptions.getDisabledAction &&
                            tableActionsOptions.getDisabledAction(list[index], index, item)) ||
                          isDisabledActions
                        }
                        onClick={onActionClickedHandler(item, list[index], index)}
                        key={`${item.key}-${index + 1}`}
                        className={`btns mx-1 theme-solid ${item.bgColor || ''}`}
                      >
                        <span className={item.icon} />
                        {item.value}
                      </ButtonBase>
                    ))) ||
                  null}
              </TableCell>
            )}
          </TableRow>
        </div>
      );
    };

    return (
      <div className='w-100 table-responsive' ref={tableRef}>
        <TableContainer className={`vehicles-table-wrapper ${isScroll ? 'is-scroll' : ''}`}>
          <Table
            stickyHeader={isScroll}
            className='table-wrapper'
            aria-labelledby='tableTitle'
            size={tableOptions.tableSize} // 'small' or 'medium'
            aria-label='enhanced table'
          >
            <TableHead>
              <TableRow>
                {isWithCheckAll && (
                  <TableCell
                    padding='checkbox'
                    className='checkboxes-cell'
                    style={
                      (isStickyCheckboxColumn &&
                        getStickyStyle({
                          right: rightCheckboxColumn,
                          left: leftCheckboxColumn,
                        })) ||
                      undefined
                    }
                    id={`${headerRowRef}checkAllColumnId`}
                  >
                    <CheckboxesComponent
                      idRef={`${headerRowRef}tableSelectAllRef`}
                      singleIndeterminate={
                        localSelectedRows &&
                        localSelectedRows.length > 0 &&
                        localSelectedRows.length < totalItems &&
                        !isSelectAll
                      }
                      singleChecked={
                        isSelectAll ||
                        (totalItems > 0 &&
                          localSelectedRows &&
                          localSelectedRows.length === totalItems)
                      }
                      isDisabled={isSelectAllDisabled}
                      onSelectedCheckboxChanged={onSelectAllCheckboxChangedHandler}
                    />
                    {(isResizeCheckboxColumn || isResizable) && (
                      <ButtonBase
                        className='resize-btn'
                        onMouseDown={onResizeDownHandler(`#${headerRowRef}checkAllColumnId`)}
                      >
                        <span />
                      </ButtonBase>
                    )}
                  </TableCell>
                )}
                {(reorderedHeader || headerData)
                  .filter((column) => !column.isHidden)
                  .map((item, index) => (
                    <TableCell
                      key={`${headerRowRef}${index + 1}`}
                      sortDirection={
                        item.isSortable && currentOrderById === item.id
                          ? currentOrderDirection
                          : false
                      }
                      className={`${(index === currentDragOverIndex && 'drag-over-cell') || ''}`}
                      draggable={item.isDraggable}
                      onDragOver={onDragOverColumnHandler(index)}
                      onDragEnd={onDragEndColumnHandler}
                      onDrag={onDragColumnHandler(index)}
                      onDrop={onDropColumnHandler(index)}
                      id={`${headerRowRef}${index + 1}`}
                      style={(item.isSticky && getStickyStyle(item)) || undefined}
                    >
                      {item.isSortable ? (
                        <TableSortLabel
                          active={currentOrderById === item.id}
                          direction={currentOrderById === item.id ? currentOrderDirection : 'desc'}
                          onClick={createSortHandler(item.id)}
                        >
                          {(item.headerComponent && item.headerComponent(item, index)) ||
                            item.label}
                        </TableSortLabel>
                      ) : (
                        (item.headerComponent && item.headerComponent(item, index)) || item.label
                      )}
                      {(item.isResizable || isResizable) && (
                        <ButtonBase
                          className='resize-btn'
                          onMouseDown={onResizeDownHandler(`#${headerRowRef}${index + 1}`)}
                        >
                          <span />
                        </ButtonBase>
                      )}
                    </TableCell>
                  ))}
                {isWithTableActions && tableActionsOptions && (
                  <TableCell
                    id={`${headerRowRef}tableActionsOptionsRef`}
                    className='actions-cell'
                    style={
                      (tableActionsOptions.isSticky && getStickyStyle(tableActionsOptions)) ||
                      undefined
                    }
                  >
                    {(tableActionsOptions.headerComponent && tableActionsOptions.headerComponent) ||
                      (tableActionsOptions.label && tableActionsOptions.label)}
                    {tableActionsOptions.isResizable && (
                      <ButtonBase
                        className='resize-btn'
                        onMouseDown={onResizeDownHandler(`#${headerRowRef}tableActionsOptionsRef`)}
                      >
                        <span />
                      </ButtonBase>
                    )}
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            {!isLoading && <TableBody></TableBody>}
            {footerData && footerData.length > 0 && (
              <TableFooter className='footer-wrapper'>
                <TableRow>
                  {footerData.map((item, index) => (
                    <TableCell colSpan={item.colSpan} key={`footerCell${index + 1}`}>
                      {(item.component && item.component(item, index)) || item.value}
                    </TableCell>
                  ))}
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </TableContainer>

        <List
          width={700}
          height={600}
          rowHeight={60}
          overscanRowCount={3}
          rowCount={data.length}
          rowRenderer={renderRow}
        />
        <LoaderComponent
          isLoading={isLoading}
          isSkeleton
          wrapperClasses='table-loader-wrapper'
          skeletonItems={[{ varient: 'rectangular', className: 'table-loader-row' }]}
          numberOfRepeat={(totalItems / pageIndex > pageSize && pageSize) || 6}
        />
        {!isOriginalPagination && (onPageIndexChanged || onPageSizeChanged) && (
          <TablePagination
            component='div'
            showLastButton
            showFirstButton
            page={pageIndex}
            count={totalItems}
            rowsPerPage={pageSize}
            onPageChange={onPageIndexChanged}
            onRowsPerPageChange={onPageSizeChanged}
          />
        )}
      </div>
    );
  },
);

TablesComponent.displayName = 'TablesComponent';

TablesComponent.defaultProps = {
  // checkboxes related features
  selectedRows: undefined,
  uniqueKeyInput: undefined,
  onSelectAllCheckboxChanged: undefined,
  onSelectCheckboxChanged: undefined,
  onSelectedRowsCountChanged: undefined,
  getIsSelectedRow: undefined,
  getIsDisabledRow: undefined,
  tableRowValidationArray: [],
  isResizable: false,
  isWithCheckAll: false,
  isWithCheck: false,
  isSelectAll: false,
  isResizeCheckboxColumn: false,
  isStickyCheckboxColumn: true,
  leftCheckboxColumn: undefined,
  rightCheckboxColumn: undefined,
  // start table actions
  tableActions: undefined,
  isWithTableActions: false,
  tableActionsOptions: { isSticky: true, right: '-1px' },
  onActionClicked: undefined,
  isDisabledActions: undefined,
  // end table actions
  // end checkboxes related features
  isSelectAllDisabled: false,
  dateFormat: 'ddd, MMM DD, h:mm A',
  tableActionText: 'Actions',
  tableOptions: {
    pageSizeOptions: [10, 20, 25, 50, 100],
    tableSize: 'medium',
    dateFormat: null,
    sortFrom: 1, // 1:front,2:do nothing only send that it change
  },
  parentTranslationPath: '',
  translationPath: '',
  sortColumnClicked: () => {},
  onTableRowClicked: () => {},
  disabledRow: () => {},
  headerData: [],
  data: [],
  footerData: [],
  onHeaderColumnsReorder: undefined,
  focusedRowChanged: () => {},
  headerRowRef: 'headerRowRef',
  bodyRowRef: 'bodyRowRef',
  // pagination
  paginationIdRef: undefined,
  onPageIndexChanged: undefined,
  onPageSizeChanged: undefined,
  isOriginalPagination: false,
  isLoading: false,
  pageSize: 10,
  pageIndex: 0,
};
