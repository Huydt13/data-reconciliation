import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Button,
  Table,
  Label,
  // Label
} from 'semantic-ui-react';

import { useSelector, useDispatch } from 'react-redux';

import { showConfirmModal } from 'app/actions/global';
import { getCriteriasByInfectionType } from 'contact/actions/contact';

const EvaluateTable = (props) => {
  const {
    isVerified,
    isAsking,
    isInvestigating,
    isSameType,
    investigationFrom,
    investigationTo,
    criterias: criteriasFrom,
    criteriasTo,
    onChange,
    onRefresh,
    infectionTypeId,
  } = props;

  const dispatch = useDispatch();

  const { criteriaListByInfectionType } = useSelector((state) => state.contact);
  useEffect(() => {
    if (infectionTypeId) {
      dispatch(getCriteriasByInfectionType(infectionTypeId));
    }
  }, [dispatch, infectionTypeId]);

  const [fromSubjectAskingList, setFromSubjectAskingList] = useState([]);
  const [toSubjectAskingList, setToSubjectAskingList] = useState([]);

  useEffect(() => {
    if (criteriasFrom.length) {
      const mappedFromArray = criteriasFrom.map((c) =>
        c.criteriaIds.map((e) => `${e}/${c.categoryId}`),
      );
      const fromArr = [];
      mappedFromArray.forEach((element) => {
        fromArr.push(...element);
      });
      setFromSubjectAskingList(fromArr);
    } else {
      setFromSubjectAskingList([]);
    }
  }, [criteriasFrom]);
  useEffect(() => {
    if (criteriasTo.length) {
      const mappedFromArray = criteriasTo.map((c) =>
        c.criteriaIds.map((e) => `${e}/${c.categoryId}`),
      );
      const fromArr = [];
      mappedFromArray.forEach((element) => {
        fromArr.push(...element);
      });
      setToSubjectAskingList(fromArr);
    } else {
      setToSubjectAskingList([]);
    }
  }, [criteriasTo]);

  const handleChange = (askingList) => {
    const criteriasArray = askingList.map((cr) => ({
      criteriaId: cr.split('/')[0],
      categoryId: cr.split('/')[1],
    }));

    const criteriasParam = [];

    criteriasArray.forEach((e) => {
      const existing = criteriasParam.filter(
        (v) => v.categoryId === e.categoryId,
      );
      if (existing.length) {
        const existingIndex = criteriasParam.indexOf(existing[0]);
        criteriasParam[existingIndex].criteriaIds.push(e.criteriaId);
      } else {
        if (typeof e.criteriaId === 'string') {
          e.criteriaId = [e.criteriaId];
        }
        criteriasParam.push({
          categoryId: e.categoryId,
          criteriaIds: e.criteriaId,
        });
      }
    });
    onChange(criteriasParam);
  };

  const handleClick = (isFromSubject) => {
    const criteriasArray = (isFromSubject
      ? fromSubjectAskingList
      : toSubjectAskingList
    ).map((cr) => ({
      criteriaId: cr.split('/')[0],
      categoryId: cr.split('/')[1],
    }));

    const criteriasParam = [];

    criteriasArray.forEach((e) => {
      const existing = criteriasParam.filter(
        (v) => v.categoryId === e.categoryId,
      );
      if (existing.length) {
        const existingIndex = criteriasParam.indexOf(existing[0]);
        criteriasParam[existingIndex].criteriaIds.push(e.criteriaId);
      } else {
        if (typeof e.criteriaId === 'string') {
          e.criteriaId = [e.criteriaId];
        }
        criteriasParam.push({
          categoryId: e.categoryId,
          criteriaIds: e.criteriaId,
        });
      }
    });
    if (!isFromSubject) {
      dispatch(
        showConfirmModal('Bạn có chắc chắn?', () => {
          onRefresh(criteriasParam, isFromSubject);
        }),
      );
    }
  };

  return (
    <Table compact celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Hình thức tiếp xúc</Table.HeaderCell>
          <Table.HeaderCell>Thông tin khai báo</Table.HeaderCell>
          {!isAsking && <Table.HeaderCell>Thông tin điều tra</Table.HeaderCell>}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {criteriaListByInfectionType.map((cr) => (
          <Table.Row key={cr.id}>
            <Table.Cell>{cr.name}</Table.Cell>
            <Table.Cell textAlign="center">
              <Checkbox
                checked={fromSubjectAskingList.includes(cr.id)}
                value={cr.id}
                disabled={isVerified || !isAsking}
                onClick={(e, { checked, value, disabled }) => {
                  if (!disabled) {
                    if (checked) {
                      setFromSubjectAskingList([
                        ...fromSubjectAskingList,
                        value,
                      ]);
                      handleChange([...fromSubjectAskingList, value]);
                    } else {
                      setFromSubjectAskingList(
                        fromSubjectAskingList.filter((d) => !d.includes(value)),
                      );
                      handleChange(
                        fromSubjectAskingList.filter((d) => !d.includes(value)),
                      );
                    }
                  }
                }}
              />
            </Table.Cell>
            {!isAsking && (
              <Table.Cell textAlign="center">
                <Checkbox
                  checked={toSubjectAskingList.includes(cr.id)}
                  value={cr.id}
                  disabled={isVerified || isAsking}
                  onClick={(e, { checked, value, disabled }) => {
                    if (!disabled) {
                      if (checked) {
                        setToSubjectAskingList([...toSubjectAskingList, value]);
                      } else {
                        setToSubjectAskingList(
                          toSubjectAskingList.filter((d) => !d.includes(value)),
                        );
                      }
                    }
                  }}
                />
              </Table.Cell>
            )}
          </Table.Row>
        ))}
      </Table.Body>
      {!isVerified && !isAsking && !investigationTo && (
        <Table.Body>
          <Table.Row>
            <Table.Cell>Xác minh thông tin</Table.Cell>
            <Table.Cell textAlign="center">
              <Button
                disabled={isVerified || !isAsking}
                color="green"
                size="small"
                onClick={() => handleClick(true)}
              >
                Duyệt
              </Button>
            </Table.Cell>
            {!isAsking && (
              <Table.Cell textAlign="center">
                <Button
                  disabled={isVerified || isAsking}
                  color="green"
                  size="small"
                  onClick={() => handleClick(false)}
                >
                  Duyệt
                </Button>
              </Table.Cell>
            )}
          </Table.Row>
        </Table.Body>
      )}
      {isInvestigating && (
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>Kết luận</Table.HeaderCell>
            {!isVerified ? (
              <>
                <Table.HeaderCell
                  textAlign="center"
                  colSpan={isSameType ? '2' : '1'}
                >
                  {investigationFrom ? (
                    <Label
                      basic
                      color={
                        investigationFrom?.infectionType?.colorCode ?? 'black'
                      }
                      content={`Nhãn ${
                        isSameType ? 'xác minh' : 'thông báo'
                      }: ${investigationFrom?.infectionType?.name ?? ''}`}
                      className="type-label"
                    />
                  ) : (
                    ''
                  )}
                </Table.HeaderCell>
                {!isSameType && !isAsking && (
                  <Table.HeaderCell textAlign="center">
                    {investigationTo ? (
                      <Label
                        basic
                        color={
                          investigationTo?.infectionType?.colorCode ?? 'black'
                        }
                        content={`Nhãn điều tra: ${
                          investigationTo?.infectionType?.name ?? ''
                        }`}
                        className="type-label"
                      />
                    ) : (
                      ''
                    )}
                  </Table.HeaderCell>
                )}
              </>
            ) : (
              <Table.HeaderCell textAlign="center" colSpan="2">
                <Label
                  basic
                  color={investigationFrom?.infectionType?.colorCode ?? 'black'}
                  content={`Nhãn xác minh: ${
                    investigationFrom?.infectionType?.name ?? ''
                  }`}
                  className="type-label"
                />
              </Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Footer>
      )}
    </Table>
  );
};

EvaluateTable.propTypes = {
  isVerified: PropTypes.bool,
  isAsking: PropTypes.bool,
  isInvestigating: PropTypes.bool,
  isSameType: PropTypes.bool,
  investigationFrom: PropTypes.shape({}),
  investigationTo: PropTypes.shape({}),
  onChange: PropTypes.func,
  onRefresh: PropTypes.func,
  criterias: PropTypes.arrayOf(PropTypes.shape({})),
  criteriasTo: PropTypes.arrayOf(PropTypes.shape({})),
  infectionTypeId: PropTypes.string,
};

EvaluateTable.defaultProps = {
  isVerified: false,
  isAsking: false,
  isInvestigating: false,
  isSameType: false,
  investigationFrom: null,
  investigationTo: null,
  onChange: () => {},
  onRefresh: () => {},
  criterias: [],
  criteriasTo: [],
  infectionTypeId: '',
};

export default EvaluateTable;
