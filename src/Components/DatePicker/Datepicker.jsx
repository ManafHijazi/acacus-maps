import React from 'react';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, MobileDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './Datepicker.Style.scss';

export const Datepicker = ({
  value,
  label,
  error,
  minDate,
  maxDate,
  isMobile,
  onChange,
  isDisabled,
  helperText,
  valueDateFormat,
  ...props
}) => {
  return (
    <div className='date-picker-wrapper'>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {isMobile ? (
          <MobileDatePicker
            {...props}
            value={value}
            label={label}
            onChange={onChange}
            disabled={isDisabled}
            helperText={helperText}
            inputFormat={valueDateFormat}
            defaultValue={dayjs('2023-04-1')}
            minDate={minDate || dayjs('1800-01-1')}
            maxDate={maxDate || dayjs('2100-01-1')}
            renderInput={(params) => <TextField {...params} fullWidth error={error} />}
          />
        ) : (
          <DesktopDatePicker
            {...props}
            value={value}
            label={label}
            onChange={onChange}
            disabled={isDisabled}
            helperText={helperText}
            inputFormat={valueDateFormat}
            defaultValue={dayjs('2023-04-1')}
            minDate={minDate || dayjs('1800-01-1')}
            maxDate={maxDate || dayjs('2100-01-1')}
            renderInput={(params) => <TextField {...params} fullWidth error={error} />}
          />
        )}
      </LocalizationProvider>
    </div>
  );
};

Datepicker.propTypes = {
  isMobile: PropTypes.bool,
};
Datepicker.defaultProps = {
  isMobile: false,
};
