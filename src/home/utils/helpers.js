import moment from 'moment';
import store from 'app/store';

const formatToLocalDate = (date) =>
  (date ? moment(date).format('YYYY-MM-DDT00:00:00+07:00') : '');

const getNameOfExcelByCode = (code = '') => {
  const { excelCategoryList } = store.getState().home;
  const name = (excelCategoryList || []).find((e) => (e?.code ?? '').includes(code))?.name ?? code;
  return name;
};

export {
  formatToLocalDate,
  getNameOfExcelByCode,
};
