import { GeneralList } from './constants';

const getGeneral = (type) => GeneralList.find((g) => g.value === type).name;

export { getGeneral };
