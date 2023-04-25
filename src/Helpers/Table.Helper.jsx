import {getDataFromObject} from './Middleware.Helper';

/**
 * @param selectedRows - array of all selected rows
 * @param pageData - the current page data
 * @param uniqueKeyInput - the unique column item
 * @author Manaf Hijazi (manafhijazii@gmail.com)
 * @Description this method is to get all selected rows after update
 */
export const globalSelectedRowsHandler = (
    selectedRows = [],
    pageData = [],
    uniqueKeyInput = 'uuid',
) => {
    const localItems = [...selectedRows];
    const notSelectedFields = pageData.filter(
        (item) => localItems.findIndex(
            (element) => getDataFromObject(item, uniqueKeyInput)
                === getDataFromObject(element, uniqueKeyInput),
        ) === -1,
    );
    if (notSelectedFields.length === 0) return [];

    return localItems.concat(notSelectedFields);
};

/**
 * @param selectedRows - array of all selected rows
 * @param selectedRow - the current checkbox value
 * @param uniqueKeyInput - the unique column item
 * @author Manaf Hijazi (manafhijazii@gmail.com)
 * @Description this method is to get all selected rows after update
 */
export const globalSelectedRowHandler = (
    selectedRows = [],
    selectedRow = {},
    uniqueKeyInput = 'uuid',
) => {
    const localItems = [...selectedRows];
    const itemIndex = localItems.findIndex(
        (item) => getDataFromObject(item, uniqueKeyInput)
            === getDataFromObject(selectedRow, uniqueKeyInput),
    );
    if (itemIndex !== -1) localItems.splice(itemIndex, 1);
    else localItems.push(selectedRow);

    return localItems;
};
