/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import {
  Label,
  Form,
  Button,
  Select,
  Checkbox,
  Header,
} from 'semantic-ui-react';
import { FiX, FiEdit2, FiPlus, FiEye } from 'react-icons/fi';
import styled from 'styled-components';

import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import { DataTable } from 'app/components/shared';

import { useDispatch, useSelector } from 'react-redux';
import { showConfirmModal } from 'app/actions/global';
import { getAskingResult, clearAsking } from 'contact/actions/contact';

import EvaluateTable from './EvaluateTable';
import SubjectSection from './SubjectSection';
import ContactRelativeTable from './ContactRelativeTable';

const relations = [
  'Cha',
  'Mẹ',
  'Vợ',
  'Chồng',
  'Ông',
  'Bà',
  'Cô',
  'Dì',
  'Chú',
  'Bác',
  'Con',
  'Cháu',
  'Anh',
  'Chị',
  'Em',
  'Bạn bè',
  'Đồng nghiệp',
  'Họ hàng',
  'Tổ bay',
  'Khác',
];

const StyledFormField = styled(Form.Field)`
  text-align: right !important;
`;
const ButtonGroupWrapper = styled.div`
  margin-bottom: 10px;
  text-align: right;
  & .buttons {
    margin-top: 16px;
    margin-right: 4px;
  }
`;
const MarginLeftButton = styled(Button)`
  margin-left: 10px !important;
`;
const StyledDiv = styled.div`
  margin-bottom: 16px !important;
`;

const ContactSubjectTable = (props) => {
  const {
    contactId,
    profileId,
    fromSubject,
    loading: loadingProp,
    // initial toSubjects from get api
    toSubjects: toSubjectsProp,
    onChange,
    onDisabled,
    onDeletingChange,
    infectionTypeId,
  } = props;

  const methods = useForm();
  const dispatch = useDispatch();

  const [toSubjectList, setToSubjectList] = useState(toSubjectsProp);
  const [deletedSubjectList, setDeletedSubjectList] = useState([]);
  useEffect(() => {
    setToSubjectList(toSubjectsProp);
  }, [toSubjectsProp]);

  useEffect(() => {
    onChange(toSubjectList);
  }, [onChange, toSubjectList]);

  const [isCreate, setIsCreate] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [bothInvestigationAreTheSame, setBothInvestigationAreTheSame] =
    useState(false);
  useEffect(() => {
    onDisabled(isCreate || isUpdate);
  }, [isCreate, isUpdate, onDisabled]);
  const [currentSubject, setCurrentSubject] = useState(null);
  // set sKey for non-sKey subject
  useEffect(() => {
    if (currentSubject && !currentSubject.sKey) {
      setCurrentSubject((cs) => ({
        ...cs,
        sKey: cs?.id ?? `@${uuidv4()}`,
      }));
    }
  }, [currentSubject]);

  const [relationship, setRelationship] = useState(
    currentSubject?.relationship ?? '',
  );
  const [relationOptions, setRelationOptions] = useState(relations);
  const realtionshipWithSubject = (
    <Form.Field
      required
      control={Select}
      search
      deburr
      fluid
      clearable
      error={!relationship}
      options={relationOptions.map((r) => ({
        key: r,
        text: r,
        value: r,
      }))}
      label="Quan hệ với ca chỉ điểm"
      allowAdditions
      additionLabel="Khác: "
      onAddItem={(e, { value }) => {
        setRelationOptions([...relations, value]);
      }}
      name="relationWithSubject"
      value={relationship}
      onChange={(e, { value }) => {
        setRelationship(value);
      }}
    />
  );
  // #endregion

  const contactRelativeTable = useMemo(
    () => (
      <ContactRelativeTable
        profileId={profileId}
        toSubjectList={toSubjectList}
        onChange={setCurrentSubject}
      />
    ),
    [profileId, toSubjectList],
  );
  // #endregion

  const verifiedButton = (
    <StyledFormField
      control={Checkbox}
      label="Điều tra và xác minh đối tượng ngay"
      checked={bothInvestigationAreTheSame}
      onClick={(e, { checked }) => {
        setBothInvestigationAreTheSame(checked);
      }}
    />
  );
  // #endregion

  const {
    subjectDetail: { infectionType },
  } = useSelector((s) => s.chain);

  const evaluateTable = useMemo(
    () => (
      <EvaluateTable
        isAsking
        isVerified={false}
        infectionTypeId={infectionTypeId || infectionType?.id}
        subjectId={currentSubject?.id}
        criterias={currentSubject?.criterias}
        contactId={contactId}
        toSubjects={toSubjectsProp}
        onChange={(d) => {
          setCurrentSubject((cs) => ({
            ...cs,
            criterias: d,
          }));
        }}
      />
    ),
    [currentSubject, contactId, toSubjectsProp, infectionType, infectionTypeId],
  );

  // #region clear form
  const clearForm = () => {
    dispatch(clearAsking());
    setCurrentSubject(null);
    setRelationship('');
  };
  // #endregion

  const { loadingGetAskingResult, loadingUpdateAsking } = useSelector(
    (state) => state.contact,
  );
  const tableColumns = useMemo(
    () => [
      {
        Header: 'Loại',
        formatter: ({ type }) => (
          <Label
            basic
            color={type?.colorCode ?? 'black'}
            content={type?.name ?? 'F?'}
            className="type-label"
          />
        ),
      },
      {
        Header: 'Tên',
        formatter: (row) => (row?.fullName || '').toUpperCase(),
      },
      {
        Header: 'Quan hệ với ca chỉ điểm',
        formatter: (row) => row.relationship,
      },
      {
        Header: 'Ngày/Năm sinh',
        formatter: (row) =>
          row?.dateOfBirth
            ? moment(row?.dateOfBirth).format('YYYY')
            : 'Chưa xác định',
      },
    ],
    [],
  );

  const tableActions = [
    {
      icon: <FiPlus />,
      title: 'Thêm',
      color: 'green',
      onClick: () => {
        setIsCreate(true);
        setIsUpdate(false);
        clearForm();
      },
      globalAction: true,
    },
    {
      icon: <FiEye />,
      title: 'Xem',
      color: 'blue',
      onClick: ({ profileId: pId }) => {
        window.open(`/profile/${pId}`, '_blank');
      },
      disabled: (r) => !r?.id,
    },
    {
      icon: <FiEdit2 />,
      title: 'Sửa',
      color: 'violet',
      onClick: (row) => {
        setIsUpdate(true);
        setIsCreate(false);
        setCurrentSubject(row);
        setRelationship(row?.relationship ?? '');
        setBothInvestigationAreTheSame(
          row?.bothInvestigationAreTheSame ?? false,
        );
      },
      // disabled: !contactId,
    },
    {
      icon: <FiX />,
      title: 'Xóa',
      color: 'red',
      onClick: (row) =>
        dispatch(
          showConfirmModal('Xác nhận xóa?', () => {
            clearForm();
            setIsCreate(false);
            setIsUpdate(false);
            setToSubjectList((tsl) => tsl.filter((ts) => ts.sKey !== row.sKey));
            // add only existed subjects on api's response to delete
            if (!row.sKey.includes('@')) {
              setDeletedSubjectList([...deletedSubjectList, row.sKey]);
              onDeletingChange([...deletedSubjectList, row.sKey]);
            }
          }),
        ),
    },
  ];

  const table = (
    <DataTable
      title="Danh sách tiếp xúc"
      columns={tableColumns}
      data={toSubjectList}
      actions={tableActions}
      loading={loadingUpdateAsking || loadingGetAskingResult || loadingProp}
    />
  );

  const updateToSubjectList = () => {
    // không có criterias
    if (!currentSubject.criterias?.length) {
      if (isUpdate) {
        setToSubjectList((tsl) =>
          tsl.map((s) =>
            s.sKey !== currentSubject.sKey
              ? s
              : {
                  ...currentSubject,
                  type:
                    fromSubject.type === 1 || fromSubject.type === 2 ? 3 : null,
                  bothInvestigationAreTheSame,
                  relationship,
                },
          ),
        );
      } else {
        setToSubjectList((tsl) => [
          ...tsl,
          {
            ...currentSubject,
            type: fromSubject.type === 1 || fromSubject.type === 2 ? 3 : null,
            relationship,
            bothInvestigationAreTheSame,
          },
        ]);
      }
      // có criterias
    } else {
      dispatch(getAskingResult(currentSubject.criterias)).then((type) => {
        if (isUpdate) {
          setToSubjectList((tsl) =>
            tsl.map((s) => {
              if (s.sKey !== currentSubject.sKey) {
                return s;
              }
              return {
                ...currentSubject,
                type,
                relationship,
                bothInvestigationAreTheSame,
                updating: true,
              };
            }),
          );
        } else {
          setToSubjectList((tsl) => [
            ...tsl,
            {
              ...currentSubject,
              type,
              relationship,
              bothInvestigationAreTheSame,
            },
          ]);
        }
      });
    }
    setIsCreate(false);
    setIsUpdate(false);
    clearForm();
  };

  const confirmButton = (
    <MarginLeftButton
      basic
      color={isCreate ? 'green' : 'violet'}
      content={isCreate ? 'Thêm' : 'Cập nhật'}
      disabled={!relationship}
      onClick={() => {
        // validate form if creating new profile
        if (`${currentSubject?.sKey ?? ''}`.includes('@')) {
          methods.handleSubmit(updateToSubjectList)();
        } else {
          // skip validation if existed profile
          updateToSubjectList();
        }
      }}
    />
  );

  const cancelButton = (
    <MarginLeftButton
      basic
      color="grey"
      content="Huỷ"
      onClick={() => {
        setIsCreate(false);
        setIsUpdate(false);
        clearForm();
      }}
    />
  );
  // #endregion

  return (
    <StyledDiv>
      {table}
      {(isCreate || isUpdate) && (
        <>
          {isCreate && contactRelativeTable}
          <Header content="Thông tin đối tượng" />
          <div className="ui form">
            <Form.Group widths="equal">{realtionshipWithSubject}</Form.Group>
          </div>
          <FormProvider {...methods}>
            <SubjectSection
              initialSubject={currentSubject}
              onChange={(d) => setCurrentSubject((cs) => ({ ...cs, ...d }))}
            />
            {evaluateTable}
            {
              <div className="ui form">
                <Form.Group widths="equal">{verifiedButton}</Form.Group>
              </div>
            }
            <ButtonGroupWrapper>
              {confirmButton}
              {cancelButton}
            </ButtonGroupWrapper>
          </FormProvider>
        </>
      )}
    </StyledDiv>
  );
};

ContactSubjectTable.propTypes = {
  contactId: PropTypes.string,
  infectionTypeId: PropTypes.string,
  profileId: PropTypes.number,
  loading: PropTypes.bool,
  fromSubject: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.number,
  }),
  toSubjects: PropTypes.arrayOf(PropTypes.shape({})),
  onChange: PropTypes.func,
  onDisabled: PropTypes.func,
  onDeletingChange: PropTypes.func,
};

ContactSubjectTable.defaultProps = {
  contactId: '',
  infectionTypeId: '',
  profileId: 0,
  loading: false,
  fromSubject: {},
  toSubjects: [],
  onChange: () => {},
  onDisabled: () => {},
  onDeletingChange: () => {},
};

export default ContactSubjectTable;
