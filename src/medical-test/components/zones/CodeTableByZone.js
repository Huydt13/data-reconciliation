import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { FiPrinter, FiUpload, FiCheck } from 'react-icons/fi';

import { useDispatch } from 'react-redux';
import {
  getMedicalTestCodes,
  printCodeByZone,
  publishCodeByZone,
} from 'medical-test/actions/medical-test';

import { DataTable } from 'app/components/shared';
import { useAuth } from 'app/hooks';
import CodeFilter from '../codes/CodeFilter';
import PublishAndPrintModal from '../codes/PublishAndPrintModal';

const columns = [
  { Header: '#', accessor: 'index' },
  {
    Header: 'Mã xét nghiệm',
    formatter: ({ code }) => (code?.length === 12 ? <b>{code}</b> : code),
  },
  {
    Header: 'Đã cấp',
    formatter: (row) => (row.isPublished ? <FiCheck /> : ''),
  },
  { Header: 'Đã in', formatter: (row) => (row.isPrinted ? <FiCheck /> : '') },
  { Header: 'Đã sử dụng', formatter: (row) => (row.isUsed ? <FiCheck /> : '') },
];

const CodeTableByZone = (props) => {
  const { zonePrefix } = props;

  const { getAuthInfo } = useAuth();
  const userInfo = getAuthInfo();

  const dispatch = useDispatch();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [codeList, setCodeList] = useState([]);
  const [pCount, setPCount] = useState(0);
  const [filter, setFilter] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPrint, setIsPrint] = useState(false);
  const [publishAndPrintModal, setPublishAndPrintModal] = useState(false);
  const [toggleStatus, setToggleStatus] = useState(false);

  useEffect(() => {
    setLoading(true);
    dispatch(
      getMedicalTestCodes({
        ...filter,
        zonePrefix,
        pageIndex,
        pageSize,
      }),
    ).then((res) => {
      setLoading(false);
      const { data, pageCount } = res;
      setPCount(pageCount);
      setCodeList(data);
    });
  }, [filter, dispatch, zonePrefix, pageIndex, pageSize, toggleStatus]);

  const handlePublishOrPrint = (d) => {
    const requestData = {
      ...d,
      isSubZone: isPrint
        ? !(userInfo?.Role ?? []).includes('admin')
        : undefined,
    };
    dispatch(
      isPrint ? printCodeByZone(requestData) : publishCodeByZone(requestData),
    ).then(() => {
      setPublishAndPrintModal(false);
      setToggleStatus(!toggleStatus);
    });
  };

  return (
    <div style={{ paddingTop: '10px' }}>
      <CodeFilter isSubComponent onChange={setFilter} />
      <DataTable
        selectable
        loading={loading}
        title="Danh sách mã xét nghiệm"
        columns={columns}
        data={codeList?.map((r, i) => ({ ...r, index: i + 1 }))}
        pageCount={pCount}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiUpload />,
            title: 'Cấp',
            color: 'blue',
            onClick: () => {
              setIsPrint(false);
              setPublishAndPrintModal(true);
            },
            globalAction: true,
            hidden: !(userInfo?.Role ?? []).includes('admin'),
          },
          {
            icon: <FiPrinter />,
            title: 'In',
            color: 'yellow',
            onClick: () => {
              setIsPrint(true);
              setPublishAndPrintModal(true);
            },
            globalAction: true,
          },
        ]}
      />

      <PublishAndPrintModal
        key={
          publishAndPrintModal
            ? 'OpenPublishAndPrintModal'
            : 'ClosePublishAndPrintModal'
        }
        open={publishAndPrintModal}
        isPrint={isPrint}
        prefix={zonePrefix}
        onClose={() => setPublishAndPrintModal(false)}
        onSubmit={handlePublishOrPrint}
      />
    </div>
  );
};
CodeTableByZone.propTypes = {
  zonePrefix: PropTypes.string,
};

CodeTableByZone.defaultProps = {
  zonePrefix: '',
};

export default CodeTableByZone;
