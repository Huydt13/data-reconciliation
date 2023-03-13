import React from 'react';
import { Label } from 'semantic-ui-react';

const colors = [
  {
    vi: 'Đỏ',
    hex: '#DB2729',
    en: 'red',
    component: <Label basic color="red" content="Đỏ" />,
  },
  {
    vi: 'Cam',
    hex: '#F2711B',
    en: 'orange',
    component: <Label basic color="orange" content="Cam" />,
  },
  {
    vi: 'Vàng',
    hex: '#FBBD09',
    en: 'yellow',
    component: <Label basic color="yellow" content="Vàng" />,
  },
  {
    vi: 'Ôliu',
    hex: '#B5CC18',
    en: 'olive',
    component: <Label basic color="olive" content="Ôliu" />,
  },
  {
    vi: 'Xanh lá',
    hex: '#21BA44',
    en: 'green',
    component: <Label basic color="green" content="Xanh lá" />,
  },
  {
    vi: 'Xanh mòng két',
    hex: '#25B5AD',
    en: 'teal',
    component: <Label basic color="teal" content="Xanh mòng két" />,
  },
  {
    vi: 'Xanh nước biển',
    hex: '#2A85D0',
    en: 'blue',
    component: <Label basic color="blue" content="Xanh nước biển" />,
  },
  {
    vi: 'Tím nhạt',
    hex: '#6436C9',
    en: 'violet',
    component: <Label basic color="violet" content="Tím nhạt" />,
  },
  {
    vi: 'Tím đậm',
    hex: '#A333C8',
    en: 'purple',
    component: <Label basic color="purple" content="Tím đậm" />,
  },
  {
    vi: 'Hồng',
    hex: '#E03997',
    en: 'pink',
    component: <Label basic color="pink" content="Hồng" />,
  },
  {
    vi: 'Nâu',
    hex: '#A5673F',
    en: 'brown',
    component: <Label basic color="brown" content="Nâu" />,
  },
  {
    vi: 'Xám',
    hex: '#767676',
    en: 'grey',
    component: <Label basic color="grey" content="Xám" />,
  },
  {
    vi: 'Đen',
    hex: '#1A1C1D',
    en: 'black',
    component: <Label basic color="black" content="Đen" />,
  },
];

const Generals = {
  DISEASE_TYPE: 'DISEASE_TYPE',
  INFECTION_TYPE: 'INFECTION_TYPE',
  CRITERIAS: 'CRITERIAS',
};

const GeneralList = [
  { name: 'Nhãn', value: Generals.INFECTION_TYPE },
  { name: 'Loại bệnh', value: Generals.DISEASE_TYPE },
  { name: 'Đánh giá tiếp xúc', value: Generals.CRITERIAS },
];

export { Generals, GeneralList, colors };
