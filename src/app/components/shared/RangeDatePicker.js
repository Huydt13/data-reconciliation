import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import MomentLocaleUtils, {
  parseDate,
  formatDate,
} from 'react-day-picker/moment';

const locale = 'vi';
const dateFormat = 'DD-MM-YYYY';
const months = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export default class RangeDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.state = {
      from: undefined,
      to: undefined,
    };
  }

  showFromMonth() {
    const { from, to } = this.state;
    if (!from) {
      return;
    }
    if (moment(to).diff(moment(from), 'months') < 2) {
      this.to.getDayPicker().showMonth(from);
    }
  }

  handleFromChange(from) {
    // Change the from date and focus the "to" input field
    const { onChange } = this.props;
    const { to } = this.state;
    this.setState({ from });
    onChange({ from, to });
  }

  handleToChange(to) {
    const { onChange } = this.props;
    const { from } = this.state;
    this.setState({ to }, this.showFromMonth);
    onChange({ from, to });
  }

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };

    return (
      <div className="InputFromTo">
        <DayPickerInput
          style={{ paddingRight: '1em' }}
          value={from}
          format={dateFormat}
          placeholder="Từ ngày"
          parseDate={parseDate}
          formatDate={formatDate}
          dayPickerProps={{
            selectedDays: [from, { from, to }],
            disabledDays: {
              before: new Date(`01/01/${new Date().getFullYear()}`),
              after: new Date(),
            },
            toMonth: to,
            modifiers,
            numberOfMonths: 2,
            locale,
            localeUtils: MomentLocaleUtils,
            months,
            onDayClick: () => this.to.getInput().focus(),
          }}
          onDayChange={this.handleFromChange}
        />
        <span className="InputFromTo-to">
          <DayPickerInput
            // eslint-disable-next-line no-return-assign
            ref={(el) => (this.to = el)}
            value={to}
            format={dateFormat}
            formatDate={formatDate}
            placeholder="Đến ngày"
            parseDate={parseDate}
            dayPickerProps={{
              selectedDays: [from, { from, to }],
              disabledDays: { before: from, after: new Date() },
              modifiers,
              month: from,
              fromMonth: from,
              numberOfMonths: 2,
              locale,
              localeUtils: MomentLocaleUtils,
              months,
            }}
            onDayChange={this.handleToChange}
          />
        </span>
      </div>
    );
  }
}

RangeDatePicker.propTypes = {
  /** Input change callback */
  onChange: PropTypes.func,
};

RangeDatePicker.defaultProps = {
  onChange: () => {},
};
