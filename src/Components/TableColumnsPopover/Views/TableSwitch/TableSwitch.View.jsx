import React, {memo, useCallback, useState} from 'react';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import {SwitchComponent} from '../../../Switch/Switch.Component';
import {TablesViewEnum} from '../../../../enums';
import {DynamicService} from "../../../../Services";
import {getDataFromObject, showError, showSuccess} from "../../../../Helpers";

const TableSwitchView = memo(
    ({
        row, columnKey, columnName, viewItem, onReloadData, globalIsLoading,
    }) => {
        const {t} = useTranslation('Shared');
        const [isLoading, setIsLoading] = useState(false);
        const onSwitchChangedHandler = useCallback(async () => {
            setIsLoading(true);
            const response = await DynamicService({
                path: viewItem.end_point,
                method: viewItem.method,
                body: {
                    [viewItem.primary_key]: getDataFromObject(row, viewItem.primary_key),
                },
            });
            setIsLoading(false);
            if (
                response
        && (response.status === 200
          || response.status === 201
          || response.status === 202)
            ) {
                showSuccess(`"${columnName}" ${t('updated-successfully')}`);
                if (onReloadData) onReloadData();
            } else showError(`"${columnName}" ${t('update-failed')}`, response);
        }, [
            columnName,
            onReloadData,
            row,
            t,
            viewItem.end_point,
            viewItem.method,
            viewItem.primary_key,
        ]);

        return (
            <div className="table-switch-view-wrapper table-view-wrapper">
                <SwitchComponent
                    isChecked={getDataFromObject(row, columnKey)}
                    label={columnName}
                    isReversedLabel
                    isDisabled={isLoading || globalIsLoading}
                    onChange={onSwitchChangedHandler}
                />
            </div>
        );
    },
);

TableSwitchView.displayName = 'TableSwitchView';

TableSwitchView.propTypes = {
    viewItem: PropTypes.shape({
        type: PropTypes.oneOf(Object.values(TablesViewEnum).map((item) => item.key)),
        key: PropTypes.string,
        columnName: PropTypes.string,
        end_point: PropTypes.string,
        method: PropTypes.oneOf(['post', 'get', 'delete']),
        primary_key: PropTypes.string,
    }).isRequired,
    row: PropTypes.instanceOf(Object).isRequired,
    globalIsLoading: PropTypes.bool.isRequired,
    columnKey: PropTypes.string.isRequired,
    columnName: PropTypes.string.isRequired,
    onReloadData: PropTypes.func,
};

TableSwitchView.defaultProps = {
    onReloadData: undefined,
};

export default TableSwitchView;
