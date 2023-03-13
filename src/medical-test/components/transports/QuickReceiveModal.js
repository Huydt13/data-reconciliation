import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';

import { Button as Btn, Form, Grid, Modal } from 'semantic-ui-react';

import { useDispatch, useSelector } from 'react-redux';
import { importExcel } from 'app/actions/global';
import { quickReceive } from 'medical-test/actions/transport';

import apiLinks from 'app/utils/api-links';
import { formatToTime } from 'app/utils/helpers';

import { DataTable } from 'app/components/shared';

const Wrapper = styled.div`
  margin-bottom: 18px;
`;
const DataTableWrapper = styled.div`
  & tr:last-child {
    background: ${({ basic }) => (basic ? '#FFFF00' : null)};
  }
`;

const Button = styled(Btn)`
  margin-top: 8px !important;
`;

const fullExamColumns = [
  {
    Header: 'Thời gian chuyển',
    formatter: ({ sendingTime }) => formatToTime(sendingTime),
  },
  { Header: 'Số lượng mẫu', formatter: ({ codes }) => codes.length },
];
const missExamColumns = [
  {
    Header: 'Thời gian chuyển',
    formatter: ({ sendingTime }) =>
      moment(sendingTime).isValid() ? formatToTime(sendingTime) : sendingTime,
  },
  {
    Header: 'Mẫu thiếu/Tổng',
    formatter: ({ count, total }) =>
      count !== total ? `${count}/${total}` : total,
  },
];
const spareExamColumns = [{ Header: 'Mã xét nghiệm', accessor: 'code' }];

const QuickReceiveModal = ({ open, onClose, getData }) => {
  const dispatch = useDispatch();

  const importLoading = useSelector((s) => s.global.importLoading);
  const quickReceiveLoading = useSelector(
    (s) => s.transport.quickReceiveLoading,
  );
  const prefixList = useSelector((state) => state.medicalTest.prefixList);
  const getPrefixesLoading = useSelector(
    (state) => state.medicalTest.getPrefixesLoading,
  );

  const [succeed, setSucceed] = useState(false);

  const [fromUnitId, setFromUnitId] = useState('');

  const [fullTransports, setFullTransports] = useState([]);
  const [missingTransports, setMissingTransports] = useState([]);
  const [yellowCodes, setYellowCodes] = useState([]);

  const [missingTotal, setMissingTotal] = useState(0);

  const [merged, setMerged] = useState(false);
  // const [received, setReceived] = useState(false);

  const fileInputRef = useRef();
  const [selectedFile, setSelectedFile] = useState(undefined);
  useEffect(() => {
    const uploadFile = async () => {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);

        const result = await dispatch(
          importExcel({
            method: 'PUT',
            url: apiLinks.transport.findTransportRelated,
            params: { fromUnitId },
            formData,
          }),
        );
        setSucceed(result.succeed);
        if (result.data) {
          setFullTransports(result.data.fullTransports);
          setMissingTransports(
            result.data.missingTransports.map((e) => ({
              ...e,
              count: e.missingCodes.length,
              total: e.codes.length + e.missingCodes.length,
            })),
          );
          setMissingTotal(
            result.data.missingTransports.reduce(
              (sum, row) => row.missingCodes.length + sum,
              0,
            ),
          );
          setYellowCodes(result.data.yellowCodes.map((e) => ({ code: e })));
        }

        fileInputRef.current.value = '';
        setSelectedFile(undefined);
      }
    };
    uploadFile();
  }, [dispatch, selectedFile, fromUnitId]);

  const handleSubmit = async () => {
    await dispatch(
      quickReceive({
        fullTransports,
        missingTransports,
        yellowCodes: yellowCodes.map(({ code }) => code),
        mergeMissing: merged,
        receiveYellowCodes: false,
        // receiveYellowCodes: received,
      }),
    );
    onClose();
    getData();
  };

  return (
    <Wrapper>
      <Modal
        open={open}
        onClose={onClose}
        centered={false}
        size="fullscreen"
        className="quickReceiveExam"
      >
        <Modal.Header content="Nhận phiên nhanh" />
        <Modal.Content scrolling>
          <div className="ui form small">
            <Form.Group widths="equal">
              <Form.Select
                required
                fluid
                label="Cơ sở gửi"
                value={fromUnitId}
                loading={getPrefixesLoading}
                onChange={(_, { value: v }) => setFromUnitId(v)}
                options={prefixList.map((pr) => ({
                  key: pr.id,
                  text: pr.name,
                  value: pr.id,
                }))}
              />
              <Form.Button
                required
                icon="upload"
                color="green"
                label="Chọn File"
                style={{ marginBottom: '20px' }}
                loading={importLoading}
                disabled={!fromUnitId || importLoading}
                onClick={(e) => {
                  e.preventDefault();
                  fileInputRef.current.click();
                }}
              />
            </Form.Group>
          </div>
          {succeed && (
            <Grid divided columns={3}>
              <Grid.Column>
                <DataTable
                  noPaging
                  title="Danh sách phiên đủ mẫu"
                  columns={fullExamColumns}
                  data={fullTransports}
                />
              </Grid.Column>
              <Grid.Column>
                <DataTableWrapper basic={merged}>
                  <DataTable
                    noPaging
                    title="Danh sách phiên thiếu mẫu"
                    columns={missExamColumns}
                    data={
                      merged
                        ? [
                            ...missingTransports.map((d) => ({
                              ...d,
                              count: d.total - d.count,
                              total: d.total - d.count,
                            })),
                            {
                              sendingTime: 'Phiên gộp mẫu thiếu',
                              count: missingTotal,
                              total: missingTotal,
                            },
                          ]
                        : missingTransports
                    }
                  />
                </DataTableWrapper>
                <Button
                  size="mini"
                  floated="right"
                  basic={!merged}
                  color={merged ? 'green' : 'grey'}
                  icon={merged ? 'check' : null}
                  content="Gộp phiên cho mẫu thiếu"
                  onClick={() => setMerged(!merged)}
                />
              </Grid.Column>
              <Grid.Column>
                <DataTable
                  noPaging
                  title="Danh sách mẫu dư"
                  columns={spareExamColumns}
                  data={yellowCodes}
                />
                {/* <Button
                  size="mini"
                  floated="right"
                  basic={!received}
                  color={received ? 'green' : 'grey'}
                  icon={received ? 'check' : null}
                  content="Nhận mẫu dư"
                  onClick={() => setReceived(!received)}
                /> */}
              </Grid.Column>
            </Grid>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="violet"
            labelPosition="right"
            icon="arrow down"
            content="Tiến hành nhận mẫu"
            loading={quickReceiveLoading}
            disabled={!succeed || quickReceiveLoading}
            onClick={handleSubmit}
          />
        </Modal.Actions>

        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={(e) => setSelectedFile(e.target.files[0])}
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        />
      </Modal>
    </Wrapper>
  );
};

QuickReceiveModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  getData: PropTypes.func.isRequired,
};

export default QuickReceiveModal;
