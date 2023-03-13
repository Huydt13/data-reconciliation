import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Label, Select } from 'semantic-ui-react';

const colors = [
  {
    text: 'Đỏ',
    value: '#DB2729',
    name: 'red',
    content: <Label basic color="red" content="Đỏ" />,
  },
  {
    text: 'Cam',
    value: '#F2711B',
    name: 'orange',
    content: <Label basic color="orange" content="Cam" />,
  },
  {
    text: 'Vàng',
    value: '#FBBD09',
    name: 'yellow',
    content: <Label basic color="yellow" content="Vàng" />,
  },
  {
    text: 'Ôliu',
    value: '#B5CC18',
    name: 'olive',
    content: <Label basic color="olive" content="Ôliu" />,
  },
  {
    text: 'Xanh lá',
    value: '#21BA44',
    name: 'green',
    content: <Label basic color="green" content="Xanh lá" />,
  },
  {
    text: 'Xanh mòng két',
    value: '#25B5AD',
    name: 'teal',
    content: <Label basic color="teal" content="Xanh mòng két" />,
  },
  {
    text: 'Xanh nước biển',
    value: '#2A85D0',
    name: 'blue',
    content: <Label basic color="blue" content="Xanh nước biển" />,
  },
  {
    text: 'Tím nhạt',
    value: '#6436C9',
    name: 'violet',
    content: <Label basic color="violet" content="Tím nhạt" />,
  },
  {
    text: 'Tím đậm',
    value: '#A333C8',
    name: 'purple',
    content: <Label basic color="purple" content="Tím đậm" />,
  },
  {
    text: 'Hồng',
    value: '#E03997',
    name: 'pink',
    content: <Label basic color="pink" content="Hồng" />,
  },
  {
    text: 'Nâu',
    value: '#A5673F',
    name: 'brown',
    content: <Label basic color="brown" content="Nâu" />,
  },
  {
    text: 'Xám',
    value: '#767676',
    name: 'grey',
    content: <Label basic color="grey" content="Xám" />,
  },
  {
    text: 'Đen',
    value: '#1A1C1D',
    name: 'black',
    content: <Label basic color="black" content="Đen" />,
  },
];

const SelectColor = (props) => {
  const { getText, value, onChange } = props;
  const [selecting, setSelecting] = useState('');
  useEffect(() => {
    setSelecting(value);
  }, [value]);

  return (
    <Form.Field
      control={Select}
      options={colors}
      value={
        selecting?.includes('#')
          ? selecting
          : colors.find((c) => c.name === selecting)?.value
      }
      onChange={(_, { value: v }) => {
        setSelecting(v);
        if (getText) {
          onChange(colors.find((c) => c.value === v).name);
        } else {
          onChange(v);
        }
      }}
    />
  );
};

SelectColor.propTypes = {
  value: PropTypes.string,
  getText: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

SelectColor.defaultProps = {
  value: '',
};

export default SelectColor;
