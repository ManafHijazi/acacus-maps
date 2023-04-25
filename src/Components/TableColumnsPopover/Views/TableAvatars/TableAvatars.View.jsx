import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import {Typography, AvatarGroup} from '@mui/material';
import {getDataFromObject, StringToColor} from "../../../../Helpers";

const TableAvatarsView = ({
    row,
    rowIndex,
    columnKey,
    isWithText,
    maxAvatars,
    idRef,
}) => (
    <div className="table-avatars-wrapper table-view-wrapper">
        {(isWithText
            && ((Array.isArray(getDataFromObject(row, columnKey, true))
                    && getDataFromObject(row, columnKey, true).map((item, index) => (
                        <div
                            className="d-inline-flex-v-center"
                            key={`${idRef}${index + 1}-${rowIndex + 1}`}
                        >
                            <Avatar style={{backgroundColor: StringToColor(item)}}>
                                {item && item.split(' ').map((word) => word[0])}
                            </Avatar>
                            {isWithText && <span className="px-2">{item}</span>}
                        </div>
                    )))
                || (typeof getDataFromObject(row, columnKey, true) === 'string' && (
                    <div className="d-inline-flex-v-center">
                        <Avatar
                            style={{
                                backgroundColor: StringToColor(getDataFromObject(row, columnKey)),
                            }}
                        >
                            {getDataFromObject(row, columnKey, true)
                                && getDataFromObject(row, columnKey, true)
                                    .split(' ')
                                    .map((word) => word[0])}
                        </Avatar>
                        {isWithText && (
                            <Typography>{getDataFromObject(row, columnKey, true)}</Typography>
                        )}
                    </div>
                )))) || (
            <AvatarGroup max={maxAvatars}>
                {(Array.isArray(getDataFromObject(row, columnKey, true))
                        && getDataFromObject(row, columnKey, true).map((item, index) => (
                            <Avatar
                                style={{backgroundColor: StringToColor(item)}}
                                key={`${idRef}${index + 1}-${rowIndex + 1}`}
                            >
                                {item && item.split(' ').map((word) => word[0])}
                            </Avatar>
                        )))
                    || (typeof getDataFromObject(row, columnKey, true) === 'string' && (
                        <Avatar
                            style={{
                                backgroundColor: StringToColor(getDataFromObject(row, columnKey)),
                            }}
                        >
                            {getDataFromObject(row, columnKey, true)
                                && getDataFromObject(row, columnKey, true)
                                    .split(' ')
                                    .map((word) => word[0])}
                        </Avatar>
                    ))}
            </AvatarGroup>
        )}
    </div>
);

TableAvatarsView.propTypes = {
    columnKey: PropTypes.string.isRequired,
    row: PropTypes.instanceOf(Object).isRequired,
    rowIndex: PropTypes.number.isRequired,
    maxAvatars: PropTypes.number,
    isWithText: PropTypes.bool,
    idRef: PropTypes.string,
};

TableAvatarsView.defaultProps = {
    maxAvatars: 5,
    isWithText: false,
    idRef: 'TableAvatarsViewRef',
};

export default TableAvatarsView;
