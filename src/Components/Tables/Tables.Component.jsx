import React, { useCallback, useState, useRef, memo, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import moment from 'moment';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';
import { useEventListener } from '../../Hooks';
import { getDataFromObject } from '../../Helpers';
import { PaginationComponent } from '../Pagination/Pagination.Component';
import { LoaderComponent } from '../Loader/Loader.Component';
import { CheckboxesComponent } from '../Checkboxes/Checkboxes.Component';
import './Tables.Style.scss';

export const TablesComponent = memo(
  ({
    tableRowValidationArray,
    tableOptions,
    data,
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
      [currentOrderDirection, tableOptions, sortColumnClicked]
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
            getDataFromObject(row, uniqueKeyInput) === getDataFromObject(item, uniqueKeyInput)
        ),
      [localSelectedRows, uniqueKeyInput]
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
      [data, onSelectAllCheckboxChanged, selectedRows]
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
      [getCurrentSelectedItemIndex, onSelectCheckboxChanged, selectedRows]
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
      [focusedRow, focusedRowChanged]
    );
    // const getTableActionValue = (key) =>
    //   Object.values(TableActions).find((item) => item.key === key);
    const getSortDataName = () => {
      const currentHeader = (reorderedHeader || headerData).find(
        (item) => item.id === currentOrderById
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
      []
    );
    const onDragColumnHandler = useCallback(
      (index) => (event) => {
        event.dataTransfer.setData('text', event.currentTarget.id);
        setCurrentDraggingColumn(index);
      },
      []
    );
    const onDragEndColumnHandler = useCallback(() => {
      if (currentDragOverIndex !== null) setCurrentDragOverIndex(null);
    }, [currentDragOverIndex]);
    const onDragOverColumnHandler = useCallback(
      (index) => (event) => {
        event.preventDefault();
        if (currentDragOverIndex !== index) setCurrentDragOverIndex(index);
      },
      [currentDragOverIndex]
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
      [currentDraggingColumn, headerData, onHeaderColumnsReorder, reorderedHeader]
    );
    const onResizeDownHandler = useCallback(
      (idRef) => (event) => {
        event.preventDefault();
        if (!idRef) return;
        currentResizingColumnRef.current = document.querySelector(idRef);
        startResizePointRef.current = currentResizingColumnRef.current.offsetWidth - event.pageX;
      },
      []
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
      [onActionClicked]
    );

    const onTableRowClickedHandler = useCallback(
      (row) => {
        if (onTableRowClicked) onTableRowClicked(row);
      },
      [onTableRowClicked]
    );

    useEffect(() => {
      if ((selectedRows || localSelectedRows) && onSelectedRowsCountChanged)
        onSelectedRowsCountChanged((selectedRows || localSelectedRows).length);
    }, [localSelectedRows, onSelectedRowsCountChanged, selectedRows]);
    useEffect(() => {
      if (selectedRows) setLocalSelectedRows(selectedRows);
    }, [selectedRows]);

    return (
      <div className='w-100 table-responsive' ref={tableRef}>
        <TableContainer>
          <Table
            className='table-wrapper'
            aria-labelledby='tableTitle'
            size={tableOptions.tableSize} // 'small' or 'medium'
            aria-label='enhanced table'>
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
                    id={`${headerRowRef}checkAllColumnId`}>
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
                        onMouseDown={onResizeDownHandler(`#${headerRowRef}checkAllColumnId`)}>
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
                        !item.isSortable && currentOrderById === item.id
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
                      style={(item.isSticky && getStickyStyle(item)) || undefined}>
                      {!item.isSortable ? (
                        <TableSortLabel
                          IconComponent={() => <span className='mdi mdi-menu-swap c-white' />}
                          active={currentOrderById === item.id}
                          direction={currentOrderById === item.id ? currentOrderDirection : 'desc'}
                          onClick={createSortHandler(item.id)}>
                          {(item.headerComponent && item.headerComponent(item, index)) ||
                            item.label}
                        </TableSortLabel>
                      ) : (
                        (item.headerComponent && item.headerComponent(item, index)) || item.label
                      )}
                      {(item.isResizable || isResizable) && (
                        <ButtonBase
                          className='resize-btn'
                          onMouseDown={onResizeDownHandler(`#${headerRowRef}${index + 1}`)}>
                          <span />
                        </ButtonBase>
                      )}
                    </TableCell>
                  ))}
                {isWithTableActions && tableActionsOptions && (
                  <TableCell
                    id={`${headerRowRef}tableActionsOptionsRef`}
                    className='actions-cells'
                    style={
                      (tableActionsOptions.isSticky && getStickyStyle(tableActionsOptions)) ||
                      undefined
                    }>
                    <div className='actions-cell'>
                      <div className='actions-cell-item'>{tableActionText}</div>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            {!isLoading && (
              <TableBody>
                {stableSort(data, getComparator(currentOrderDirection, getSortDataName())).map(
                  (row, rowIndex) => {
                    const isItemSelected = getCurrentSelectedItemIndex(row) !== -1;

                    return (
                      <React.Fragment key={`bodyRow${rowIndex * (pageIndex + 1)}`}>
                        <TableRow
                          role='checkbox'
                          aria-checked={
                            (getIsSelectedRow && getIsSelectedRow(row, rowIndex)) || isItemSelected
                          }
                          tabIndex={-1}
                          selected={
                            (getIsSelectedRow && getIsSelectedRow(row, rowIndex)) || isItemSelected
                          }
                          id={`${bodyRowRef}${rowIndex * (pageIndex + 1)}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            bodyRowClicked(rowIndex, row);
                            onTableRowClickedHandler(row);
                          }}
                          className={`${rowIndex === focusedRow ? 'table-row-overlay' : ''} ${
                            tableRowValidationArray.findIndex(
                              (item) =>
                                item === row.product_id || item === row.id || item === row.user_id
                            ) !== -1
                              ? 'has-validation'
                              : ''
                          } ${disabledRow && disabledRow(row) ? 'is-disabled' : ''}`}>
                          {(isWithCheck || getIsSelectedRow || selectedRows) && (
                            <TableCell
                              padding='checkbox'
                              style={(row.isSticky && getStickyStyle(row)) || undefined}>
                              <CheckboxesComponent
                                idRef={`tableSelectRef${rowIndex + 1}`}
                                singleChecked={
                                  isSelectAll ||
                                  (getIsSelectedRow && getIsSelectedRow(row, rowIndex)) ||
                                  isItemSelected ||
                                  false
                                }
                                isDisabled={
                                  isSelectAllDisabled ||
                                  (getIsDisabledRow && getIsDisabledRow(row, rowIndex))
                                }
                                onSelectedCheckboxChanged={onSelectCheckboxChangedHandler(
                                  row,
                                  rowIndex
                                )}
                              />
                              <div />
                            </TableCell>
                          )}
                          {headerData.length > 0 &&
                            (reorderedHeader || headerData)
                              .filter((column) => !column.isHidden)
                              .map((column, columnIndex) => (
                                <TableCell
                                  key={`bodyColumn${columnIndex * (pageIndex + 1) + rowIndex}`}
                                  className={column.cellClasses || ''}
                                  style={(column.isSticky && getStickyStyle(column)) || undefined}>
                                  {(column.isDate &&
                                    ((getDataFromObject(row, column.input) &&
                                      moment(getDataFromObject(row, column.input)).format(
                                        column.dateFormat || tableOptions.dateFormat || dateFormat
                                      )) ||
                                      '')) ||
                                    (column.component &&
                                      column.component(row, rowIndex, column, columnIndex)) ||
                                    getDataFromObject(row, column.input)}
                                </TableCell>
                              ))}
                          {isWithTableActions && tableActionsOptions && (
                            <TableCell
                              key={`bodyActionsColumn${rowIndex + 1}`}
                              className={`actions-cell-wrapper ${
                                tableActionsOptions.cellClasses || ''
                              }`}
                              style={
                                (tableActionsOptions.isSticky &&
                                  getStickyStyle(tableActionsOptions)) ||
                                undefined
                              }>
                              {(tableActionsOptions.component &&
                                tableActionsOptions.component(row, rowIndex)) ||
                                (tableActions &&
                                  tableActions.map((item) => (
                                    <ButtonBase
                                      disabled={
                                        (tableActionsOptions &&
                                          tableActionsOptions.getDisabledAction &&
                                          tableActionsOptions.getDisabledAction(
                                            row,
                                            rowIndex,
                                            item
                                          )) ||
                                        isDisabledActions
                                      }
                                      onClick={onActionClickedHandler(item, row, rowIndex)}
                                      key={`${item.key}-${rowIndex + 1}`}
                                      className={`btns mx-1 theme-solid ${item.bgColor || ''}`}>
                                      <span className={item.icon} />
                                      {item.value}
                                    </ButtonBase>
                                  ))) ||
                                null}
                            </TableCell>
                          )}
                        </TableRow>
                      </React.Fragment>
                    );
                  }
                )}
              </TableBody>
            )}
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
        <LoaderComponent
          isSkeleton
          isLoading={isLoading}
          wrapperClasses='table-loader-wrapper'
          skeletonItems={[{ varient: 'rectangular', className: 'table-loader-row' }]}
          numberOfRepeat={(totalItems / pageIndex > pageSize && pageSize) || 6}
        />
        {!isOriginalPagination && (onPageIndexChanged || onPageSizeChanged) && (
          <PaginationComponent
            isRemoveTexts
            pageSize={pageSize}
            isReversedSections
            isButtonsNavigation
            totalCount={totalItems}
            idRef={paginationIdRef}
            pageIndex={pageIndex + 1}
            onPageIndexChanged={onPageIndexChanged}
            onPageSizeChanged={onPageSizeChanged}
          />
        )}
      </div>
    );
  }
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
