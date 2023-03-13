/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import PropTypes from 'prop-types';
import moment from 'moment';
import xlsx from 'xlsx';

import { FiCheck, FiX } from 'react-icons/fi';
import {
  Modal,
  Tab,
  Header,
  Message,
  Icon,
  Button,
  Popup,
  Dimmer,
  Loader,
  List,
} from 'semantic-ui-react';
import { DataTable } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import {
  getExaminationTypes,
  getSamplingPlaces,
  publishQuickTest,
} from 'medical-test/actions/medical-test';
import {
  formatAddressToString,
  renderExaminationResult,
} from 'app/utils/helpers';

import locations from 'app/assets/mock/locations';

const Wrapper = styled.div`
  position: relative;
`;
const TableMenuWrapper = styled.div`
  margin-top: 15px;
  & .fVDZkI {
    margin-top: 0 !important;
  }
`;
const StyledIconWrapper = styled.span`
  line-height: 0;
  font-size: 24px;
  vertical-align: middle;
  color: ${(props) => (props.positive ? 'green' : 'red')};
`;

const resultType = ['Dương tính', 'Âm tính'];
const hasSymptomType = ['Có', 'Không'];
const vaccinationStatusType = [
  'Chưa tiêm',
  '1 mũi',
  '2 mũi',
  'Chưa rõ',
  'Tiêm trên 2 mũi',
];

const PublishQuickTestsModal = (props) => {
  const { open, onClose, onRefresh } = props;

  const fileInputRef = useRef();
  const [imported, setImported] = useState(false);
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [quickTestList, setQuickTestList] = useState([]);
  const [errorList, setErrorList] = useState([]);

  const dispatch = useDispatch();
  const { samplingPlaceList, examinationTypeList, publishQuickTestLoading } =
    useSelector((state) => state.medicalTest);

  const columns = useMemo(() => {
    const columnList = [
      { Header: 'STT', accessor: 'index' },
      {
        Header: 'Họ và tên',
        formatter: ({ profile }) => profile?.fullName.toUpperCase(),
        cutlength: 20,
      },
      {
        Header: 'Năm sinh',
        formatter: ({ profile }) => profile?.yearOfBirth,
      },
      {
        Header: 'Số điện thoại',
        formatter: ({ profile }) => profile?.phone,
      },
      {
        Header: 'Địa chỉ',
        formatter: ({ profile }) => formatAddressToString(profile),
        cutlength: 26,
      },
      {
        Header: 'Tình trạng tiêm vắc xin',
        formatter: ({ vaccinationStatus, lastInjectionDate }) =>
          vaccinationStatus < 3 ? (
            <div>
              <Header sub>{`Số mũi: ${vaccinationStatus}`}</Header>
              {vaccinationStatus > 0 ? (
                <span>{moment(lastInjectionDate).format('DD-MM-YYYY')}</span>
              ) : null}
            </div>
          ) : null,
      },
      {
        Header: 'Ngày lấy mẫu',
        formatter: ({ date }) => moment(date).format('DD-MM-YYYY'),
      },
      {
        Header: 'Nơi lấy mẫu',
        formatter: ({ samplingPlaceId }) =>
          samplingPlaceList?.find((p) => p?.id === samplingPlaceId)?.name,
        cutlength: 30,
      },
      {
        Header: 'Triệu chứng',
        formatter: ({ hasSymptom }) => (hasSymptom ? 'Có' : 'Không'),
      },
      {
        Header: 'Kết quả',
        formatter: ({ result }) =>
          result ? (
            <div>
              <Header sub>{renderExaminationResult(result)}</Header>
            </div>
          ) : (
            ''
          ),
      },
      {
        Header: 'Công bố',
        formatter: ({ code, publishedDate }) => (
          <div>
            <Header sub>{`Mã: ${code}`}</Header>
            <span>{moment(publishedDate).format('DD-MM-YYYY')}</span>
          </div>
        ),
      },
    ];

    if (imported) {
      columnList.push({
        Header: ' ',
        formatter: ({ status }) => (
          <Popup
            content={status.succeed ? 'Thành công' : status.message}
            trigger={
              status.succeed ? (
                <StyledIconWrapper positive>
                  <FiCheck />
                </StyledIconWrapper>
              ) : (
                <StyledIconWrapper negative>
                  <FiX />
                </StyledIconWrapper>
              )
            }
          />
        ),
      });
    }

    return columnList;
  }, [imported, samplingPlaceList]);

  const errorColumns = useMemo(
    () => [
      {
        Header: 'Hàng',
        accessor: 'row',
      },
      {
        Header: ' ',
        formatter: ({ message }) =>
          message ? (
            <List divided relaxed>
              {message.map((m) => (
                <List.Item>
                  <List.Icon name='x' color='red' verticalAlign='middle' />
                  <List.Content>
                    <List.Description>{m}</List.Description>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          ) : null,
      },
    ],
    []
  );

  const parseExcelToData = useCallback(
    (binary) => {
      try {
        const book = xlsx.read(binary, { type: 'binary' });
        const sheet = book.Sheets[book.SheetNames[0]];
        const range = xlsx.utils.decode_range(sheet['!ref']);

        let maxColumn = 0;
        const header = {};
        for (let index = range.s.c; index <= range.e.c; index += 1) {
          const name =
            sheet[xlsx.utils.encode_cell({ r: 0, c: index })]?.v ?? '';
          if (name) {
            const key = name
              .toLowerCase()
              .replace(/(\r\n|\n|\r)/gm, '')
              .trim();
            header[key] = index;

            if (index > maxColumn) {
              maxColumn = index;
            }
          }
        }

        const logs = [];
        const data = [];
        for (let index = range.s.r + 2; index <= range.e.r; index += 1) {
          // #region check end of data
          let count = 0;
          for (let jndex = index; jndex < index + 3; jndex += 1) {
            count += 1;
            for (let kndex = range.s.c; kndex < maxColumn; kndex += 1) {
              if (
                (sheet[xlsx.utils.encode_cell({ r: jndex, c: kndex })]?.v ??
                  '') === ''
              ) {
                count += 1;
              }
            }
          }

          if (count === maxColumn * 3) {
            break;
          }
          // #endregion
          // #region validate
          logs.push({ row: index + 1, message: [] });
          const fullName =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['tên'] })]?.v ??
            '';
          if (!fullName) {
            logs[index - 2].message.push('Họ tên không được bỏ trống');
          }

          const yearOfBirth =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['năm sinh'] })]
              ?.v ?? '';
          if (!yearOfBirth) {
            logs[index - 2].message.push('Năm sinh không được bỏ trống');
          }
          if (yearOfBirth) {
            const keyword =
              typeof yearOfBirth === 'number'
                ? parseInt(yearOfBirth, 10)
                : yearOfBirth;
            if (
              keyword > 9999 ||
              keyword < 1921 ||
              keyword > parseInt(moment().format('YYYY'), 10)
            ) {
              logs[index - 2].message.push(
                `Năm sinh phải nằm trong khoảng từ 1921 tới ${moment().format(
                  'YYYY'
                )}`
              );
            }
          }

          const gender =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['giới tính'] })]
              ?.v ?? '';
          if (
            gender &&
            !gender.toLowerCase().includes('nam') &&
            !gender.toLowerCase().includes('nữ')
          ) {
            logs[index - 2].message.push(
              'Giới tính không đúng định dạng (Nam/Nữ)'
            );
          }

          const identityCard =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['cmnd/cccd'] })]
              ?.w ?? '';

          const phone =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['sđt'] })]?.v ??
            '';
          if (!phone) {
            logs[index - 2].message.push('Điện thoại không được bỏ trống');
          }
          if (phone) {
            const parse = typeof phone === 'number' ? `0${phone}` : phone;

            if (parse.length < 10 || parse.length > 11) {
              logs[index - 2].message.push(
                'Điện thoại không không đúng định dạng (10/11 số)'
              );
            }
          }

          let lastInjectionDate;
          const vaccinationStatus =
            sheet[
              xlsx.utils.encode_cell({
                r: index,
                c: header['tiêm vắc xin covid-19'],
              })
            ]?.v ?? '';
          if (vaccinationStatus) {
            const keyword = vaccinationStatus.toLowerCase();
            if (
              !vaccinationStatusType.find((t) =>
                t.toLowerCase().includes(keyword)
              )
            ) {
              logs[index - 2].message.push(
                'Trạng thái tiêm vắc xin không đúng định dạng'
              );
            } else if (['1 mũi', '2 mũi'].includes(keyword)) {
              lastInjectionDate =
                sheet[
                  xlsx.utils.encode_cell({
                    r: index,
                    c: header['ngày tiêm gần nhất'],
                  })
                ]?.w ?? '';
              if (lastInjectionDate) {
                if (
                  !moment(
                    lastInjectionDate,
                    'DD/MM/YY HH:mm',
                    true
                  ).isValid() &&
                  !moment(lastInjectionDate, 'DD/MM/YYYY HH:mm', true).isValid()
                ) {
                  logs[index - 2].message.push(
                    'Ngày tiêm gần nhất không đúng định dạng (dd/mm/yyyy)'
                  );
                }

                if (moment(lastInjectionDate, 'DD/MM/YYYY HH:mm') > moment()) {
                  logs[index - 2].message.push(
                    'Ngày tiêm gần nhất không được là một ngày trong tương lại'
                  );
                }
              }
            }
          }

          const streetHouseNumber =
            sheet[
              xlsx.utils.encode_cell({
                r: index,
                c: header['số nhà, tên đường'],
              })
            ]?.v ?? '';
          if (!streetHouseNumber) {
            logs[index - 2].message.push(
              'Số nhà, tên đường không được bỏ trống'
            );
          }

          const quarterGroup =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['tổ'] })]?.v ??
            '';
          if (!quarterGroup) {
            logs[index - 2].message.push('Tổ không được bỏ trống');
          }

          const quarter =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['khu phố'] })]
              ?.v ?? '';
          if (!quarter) {
            logs[index - 2].message.push('Khu phố/Ấp không được bỏ trống');
          }

          const province = '79';
          // const province = sheet[xlsx.utils.encode_cell({ r: index, c: header['tỉnh/thành phố (*)'] })]?.v ?? '';
          // if (!province) {
          //   logs[index - 2].message.push('Tỉnh/Thành không được bỏ trống');
          // }

          const district =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['quận/huyện'] })]
              ?.v ?? '';
          if (!district) {
            logs[index - 2].message.push('Quận/Huyện không được bỏ trống');
          }

          const ward =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['phường/xã'] })]
              ?.v ?? '';
          if (!ward) {
            logs[index - 2].message.push('Phường/Xã không được bỏ trống');
          }

          const takenDate =
            sheet[
              xlsx.utils.encode_cell({
                r: index,
                c: header['ngày lấy mẫu xét nghiệm'],
              })
            ]?.w ?? '';
          if (!takenDate) {
            logs[index - 2].message.push(
              'Ngày lấy mẫu test nhanh không được bỏ trống'
            );
          }
          if (takenDate) {
            if (
              !moment(takenDate, 'DD/MM/YY HH:mm', true).isValid() &&
              !moment(takenDate, 'DD/MM/YYYY HH:mm', true).isValid()
            ) {
              logs[index - 2].message.push(
                'Ngày lấy mẫu test nhanh không đúng định dạng (dd/mm/yyyy)'
              );
            }

            if (moment(takenDate, 'DD/MM/YYYY HH:mm') > moment()) {
              logs[index - 2].message.push(
                'Ngày lấy mẫu test nhanh không được là một ngày trong tương lại'
              );
            }
          }

          const result =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['kết quả'] })]
              ?.v ?? '';
          if (!result) {
            logs[index - 2].message.push(
              'Kết quả test nhanh không được bỏ trống'
            );
          }
          if (result) {
            const keyword = result.toLowerCase().trim();
            if (!resultType.find((r) => r.toLowerCase().includes(keyword))) {
              logs[index - 2].message.push(
                'Kết quả test nhanh không đúng định dạng (Dương tính/Âm tính)'
              );
            }
          }

          const hasSymptom =
            sheet[
              xlsx.utils.encode_cell({ r: index, c: header['có triệu chứng'] })
            ]?.v ?? '';
          if (!hasSymptom) {
            logs[index - 2].message.push('Triệu chứng không được bỏ trống');
          }
          if (hasSymptom) {
            const keyword = hasSymptom.toLowerCase().trim();
            if (
              !hasSymptomType.find((r) => r.toLowerCase().includes(keyword))
            ) {
              logs[index - 2].message.push(
                'Triệu chứng không đúng định dạng (Có/Không)'
              );
            }
          }

          const samplingPlace =
            sheet[
              xlsx.utils.encode_cell({ r: index, c: header['nơi lấy mẫu'] })
            ]?.v ?? '';
          if (!samplingPlace) {
            logs[index - 2].message.push('Nơi lấy mẫu không được bỏ trống');
          }
          if (samplingPlace) {
            const keyword = samplingPlace.toLowerCase().trim().split('. ')[1];
            if (
              !samplingPlaceList.find((s) =>
                s.name.toLowerCase().split('. ')[1].includes(keyword)
              )
            ) {
              logs[index - 2].message.push('Nơi lấy mẫu không đúng định dạng');
            }
          }

          const code =
            sheet[xlsx.utils.encode_cell({ r: index, c: header['mã'] })]?.v ??
            '';
          if (!code) {
            logs[index - 2].message.push('Mã test nhanh không được bỏ trống');
          }

          const publishDate =
            sheet[
              xlsx.utils.encode_cell({
                r: index,
                c: header['ngày công bố kết quả'],
              })
            ]?.v ?? '';
          if (!publishDate) {
            logs[index - 2].message.push(
              'Ngày công bố kết quả không được bỏ trống'
            );
          }
          if (publishDate) {
            if (
              !moment(publishDate, 'DD/MM/YY', true).isValid() &&
              !moment(publishDate, 'DD/MM/YYYY', true).isValid()
            ) {
              logs[index - 2].message.push(
                'Ngày công bố kết quả không đúng định dạng (dd/mm/yyyy)'
              );
            }

            if (moment(publishDate, 'DD/MM/YYYY') > moment()) {
              logs[index - 2].message.push(
                'Ngày công bố kết quả không được là một ngày trong tương lại'
              );
            }
          }
          if (logs[index - 2].message.length > 0) {
            // eslint-disable-next-line no-continue
            continue;
          }
          // #endregion
          // #region builder quick test
          const quickTest = {
            index: index + 1,
            code,
            result,
            publishDate: moment(publishDate, 'DD/MM/YYYY').format(
              'YYYY-MM-DDT00:00:00+07:00'
            ),
            date: moment(takenDate, 'DD/MM/YYYY').format(
              'YYYY-MM-DDT00:00:00+07:00'
            ),
            hasSymptom: !!hasSymptom.toLowerCase().includes('Có'),
            vaccinationStatus: vaccinationStatusType.reduce((r, t, i) => {
              if (t.toLowerCase().includes(vaccinationStatus.toLowerCase())) {
                return i;
              }
              return r;
            }, 3),
            lastInjectionDate: lastInjectionDate
              ? moment(lastInjectionDate, 'DD/MM/YYYY').format(
                  'YYYY-MM-DDT00:00:00+07:00'
                )
              : undefined,
            samplingPlaceId: samplingPlaceList.find((s) =>
              s.name
                .toLowerCase()
                .split('. ')[1]
                .includes(samplingPlace.toLowerCase().trim().split('. ')[1])
            )?.id,
            profile: {
              fullName: `${fullName}`,
              phone: `${typeof phone === 'number' ? `0${phone}` : phone}`,
              yearOfBirth: `${yearOfBirth}`,
              gender: gender?.toUpperCase() ?? 'NAM',
              cmnd:
                identityCard && identityCard.length === 9
                  ? identityCard
                  : undefined,
              cccd:
                identityCard && identityCard.length === 12
                  ? identityCard
                  : undefined,
              streetHouseNumber: `${streetHouseNumber}`,
              quarter: `${quarter}`,
              quarterGroup: `${quarterGroup}`,
              provinceValue:
                locations?.find((p) =>
                  p?.label?.toLowerCase()?.includes(`${province}`.toLowerCase())
                )?.value ?? `${province}`,
              districtValue:
                locations
                  ?.find((p) =>
                    p?.label
                      ?.toLowerCase()
                      ?.includes(`${province}`.toLowerCase())
                  )
                  ?.districts?.find((d) =>
                    d?.label
                      ?.toLowerCase()
                      ?.includes(`${district}`.toLowerCase())
                  )?.value ?? `${district}`,
              wardValue:
                locations
                  ?.find((p) =>
                    p?.label
                      ?.toLowerCase()
                      ?.includes(`${province}`.toLowerCase())
                  )
                  ?.districts?.find((d) =>
                    d?.label
                      ?.toLowerCase()
                      ?.includes(`${district}`.toLowerCase())
                  )
                  ?.wards?.find((d) =>
                    d?.label?.toLowerCase()?.includes(`${ward}`.toLowerCase())
                  )?.value ?? `${ward}`,
            },
          };

          if (!quickTest.profile?.cmnd && !quickTest.profile?.cccd) {
            quickTest.profile.cmnd = uuidv4();
          }

          data.push(quickTest);
          // #endregion
        }
        setQuickTestList(data);
        setErrorList(
          logs.filter((log) => log?.message && log?.message.length > 0)
        );
      } catch (e) {
        toast.warn('Tệp tin không đúng định dạng');
      }
    },
    [samplingPlaceList]
  );

  const onSubmit = async () => {
    try {
      const response = await dispatch(
        publishQuickTest(
          quickTestList.map((r) => ({
            code: r.code,
            publishDate: r.publishDate,
          }))
        )
      );

      const responseErrorList = (response?.errors ?? []).reduce((r, e) => {
        const match = /:\s(.*)\s-\s/i.exec(e);
        if (match !== null) {
          r.push({
            code: match[1],
            message: e,
          });
        }

        return r;
      }, []);

      setImported(true);
      setQuickTestList(
        quickTestList.map((qt) => {
          const quickTest = { ...qt, status: { succeed: true } };
          const error = responseErrorList.find((e) => e.code.includes(qt.code));
          if (error) {
            quickTest.status.succeed = false;
            quickTest.status.message = error.message;
          }

          return quickTest;
        })
      );
      // eslint-disable-next-line no-empty
    } catch (error) {}
  };

  const tableMenu = useMemo(() => {
    const panes = [
      {
        menuItem: `Dữ liệu đọc được (${quickTestList.length})`,
        render: () => (
          <Tab.Pane>
            <DataTable columns={columns} data={quickTestList} />
          </Tab.Pane>
        ),
      },
      {
        menuItem: `Dữ liệu bị lỗi (${errorList.length})`,
        render: () => (
          <Tab.Pane>
            <Tab.Pane>
              <DataTable columns={errorColumns} data={errorList} />
            </Tab.Pane>
          </Tab.Pane>
        ),
      },
    ];

    return (
      <TableMenuWrapper>
        <Tab panes={panes} renderActiveOnly />
      </TableMenuWrapper>
    );
  }, [columns, errorColumns, quickTestList, errorList]);

  useEffect(() => {
    if (samplingPlaceList.length === 0) {
      dispatch(getSamplingPlaces());
    }
    if (examinationTypeList.length === 0) {
      dispatch(getExaminationTypes());
    }
    // eslint-disable-next-line
  }, [dispatch]);

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      if (reader.readAsBinaryString) {
        reader.onload = () => parseExcelToData(reader.result);
        reader.readAsBinaryString(selectedFile);
      }
    }
  }, [selectedFile, parseExcelToData]);

  return (
    <Modal
      open={open}
      size={
        quickTestList.length > 0 || errorList.length > 0
          ? 'fullscreen'
          : undefined
      }
      onClose={() =>
        dispatch(
          showConfirmModal('Dữ liệu chưa được lưu, bạn có muốn đóng?', () => {
            onClose();
            onRefresh();
            setImported(false);
            setErrorList([]);
            setQuickTestList([]);
          })
        )
      }
    >
      <Modal.Header>Công bố dữ liệu test nhanh</Modal.Header>
      <Modal.Content scrolling>
        <Wrapper>
          <Dimmer inverted active={publishQuickTestLoading}>
            <Loader />
          </Dimmer>
          <Button
            icon='upload'
            labelPosition='right'
            color='green'
            content='Chọn File'
            onClick={() => fileInputRef.current.click()}
          />
          {!imported &&
            (quickTestList.length > 0 || errorList.length > 0) &&
            tableMenu}
          {imported && quickTestList.length > 0 && (
            <DataTable title='Kết quả' columns={columns} data={quickTestList} />
          )}
          {(!selectedFile ||
            (quickTestList.length === 0 && errorList.length === 0)) && (
            <Message info icon>
              <Icon name='book' />
              <Message.Content>
                <Message.Header>Yêu cầu</Message.Header>
                Tệp tin Excel dữ liệu test nhanh kèm theo ngày/mã công bố
              </Message.Content>
            </Message>
          )}
          <input
            ref={fileInputRef}
            type='file'
            hidden
            onChange={(e) => {
              setImported(false);
              setErrorList([]);
              setQuickTestList([]);
              setSelectedFile(e.target.files[0]);
            }}
            accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
          />
        </Wrapper>
      </Modal.Content>
      <Modal.Actions>
        <Button
          positive
          labelPosition='right'
          icon='checkmark'
          content='Xác nhận'
          disabled={publishQuickTestLoading}
          onClick={onSubmit}
        />
        <Button
          negative
          labelPosition='right'
          icon='close'
          content='Đóng'
          disabled={publishQuickTestLoading}
          onClick={() => {
            onClose();
            onRefresh();
            setImported(false);
            setErrorList([]);
            setQuickTestList([]);
          }}
        />
      </Modal.Actions>
    </Modal>
  );
};

PublishQuickTestsModal.defaultProps = {
  open: false,
  onClose: () => {},
  onRefresh: () => {},
};

PublishQuickTestsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default PublishQuickTestsModal;
