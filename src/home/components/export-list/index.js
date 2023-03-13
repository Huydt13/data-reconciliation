/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';

import { Dimmer, Loader, Grid, List, Accordion, Button } from 'semantic-ui-react';
import { InstantSearchBar } from 'app/components/shared';

import PreviewImageModal from 'home/components/PreviewImageModal';
import ExportListPagination from 'home/components/export-list/Pagination';
import ExportExamProgressTracking from 'home/components/export-section/ExportExamProgressTracking';
import ExportIsNotGroupPositivePerIsNotGroupAll
  from 'home/components/export-section/ExportIsNotGroupPositivePerIsNotGroupAll';
import ExportExamStatistic from 'home/components/export-section/ExportExamStatistic';
import ExportPositiveExamBySamplingPlace from 'home/components/export-section/ExportPositiveExamBySamplingPlace';
import ExportExaminationStatusReportByPlaceResidence
  from 'home/components/export-section/ExportExaminationStatusReportByPlaceResidence';
import ExportSummaryExaminationStatisticOfDistrictByResidencePlace
  from 'home/components/export-section/ExportSummaryExaminationStatisticOfDistrictByResidencePlace';
import ExportExaminationStatusReportByDangerZone from 'home/components/export-section/ExportExaminationStatusReportByDangerZone';
import ExportPositiveRateStatisticBySamplingPlace
  from 'home/components/export-section/ExportPositiveRateStatisticBySamplingPlace';

import { useDispatch, useSelector } from 'react-redux';
import { getExcelCategories } from 'home/actions/home';

import { deburr } from 'app/utils/helpers';

const Wrapper = styled.div`
  position: relative;
  margin-top: 16px;
  & .ui.celled.list {
    & .item {
      padding-top: .1875em !important;
      padding-bottom: .1875em !important;
    }
  }
  & .ui.dropdown.selection {
    & .item {
      padding: 0.8125rem 1.125rem !important;
    }
  }
`;
const StyledGridColumn = styled(Grid.Column)`
  padding-top: 0 !important;
`;
const BorderedList = styled(List)`
  border: 1px solid rgba(34, 36, 38, 0.15);
  border-top: 0 !important;
  border-bottom: 0 !important;
  border-radius: 5px;
  margin: 8px 0 !important;
`;
const StyledInstantSearchBar = styled(InstantSearchBar)`
  flex: 1 1 0%;
`;
const StyledAccordion = styled(Accordion)`
  & .title {
    color: rgba(0, 0, 0, 0.68) !important;
    font-weight: 600 !important;
    &:hover {
      color: rgb(31, 31, 32) !important;
    }
  }
  & .content {
    padding: 1rem !important;
  }
  & .active {
    color: rgb(31, 31, 32) !important;
  }
`;
const FlexWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center !important;
  height: 30px !important;
`;
const LeftFlex = styled.div``;
const RightFlex = styled.div`
  margin-left: auto;
`;

const excelList = [
  {
    code: 'VNC001',
    component: <ExportExamProgressTracking />,
  },
  {
    code: 'VNC002',
    component: <ExportExaminationStatusReportByPlaceResidence />,
  },
  {
    code: 'VNC003',
    component: <ExportExaminationStatusReportByDangerZone />,
  },
  {
    code: 'THP001',
    component: <ExportExamStatistic byTakenDate code="THP001" />,
  },
  {
    code: 'THP002',
    component: <ExportExamStatistic byResultDate code="THP002" />,
  },
  {
    code: 'THP003',
    component: <ExportSummaryExaminationStatisticOfDistrictByResidencePlace />,
  },
  {
    code: 'TLD001',
    component: <ExportPositiveExamBySamplingPlace />,
  },
  {
    code: 'TLD002',
    component: <ExportIsNotGroupPositivePerIsNotGroupAll />,
  },
  {
    code: 'TLD003',
    component: <ExportPositiveRateStatisticBySamplingPlace />,
  },

];

const ExportList = () => {
  const [searchValue, setSearchValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [pageIndex, setPageIndex] = useState(0);
  const [previewImage, setPreviewImage] = useState(undefined);

  // eslint-disable-next-line
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(1);

  const dispatch = useDispatch();
  const {
    excelCategoryList,
    getExcelCategoryLoading,
  } = useSelector((state) => state.home);

  const handleChangeIndex = (index) => setActiveIndex(index === activeIndex ? -1 : index);
  const gotoPage = (index) => setPageIndex(index);

  const data = useMemo(() =>
    excelList.map((excel) => {
      const found = excelCategoryList.find((e) => (e?.code ?? '').includes(excel.code));
      if (found) {
        return {
          ...excel,
          title: found?.name ?? found?.code ?? excel.code,
          image: found?.image,
        };
      }
      return {
        ...excel,
        title: excel.code,
      };
    }),
  [excelCategoryList]);

  // eslint-disable-next-line
  const filteredData = useMemo(() => {
    if (searchValue) {
      const searchValueDeburr = deburr(searchValue.toLowerCase());
      const result = data.filter((r) => {
        // eslint-disable-next-line
        const found = Object.values(r).find((v) =>
          // eslint-disable-next-line
          deburr(`${v}`).toLowerCase().includes(searchValueDeburr),
        );
        return found;
      });
      if (data.length > 10) {
        setPageCount(Math.ceil((result || []).length / pageSize));
        return result.length > pageSize
          ? result.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
          : result;
      }
      return result;
    }
    if (data.length > 10) {
      setPageCount(Math.ceil(data.length / pageSize));
      return data.length > pageSize
            ? data.slice(pageIndex * pageSize, pageIndex * pageSize + pageSize)
            : data;
    }
    return data;
  }, [data, searchValue, pageIndex, pageSize, setPageCount]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [searchValue, pageIndex]);
  useEffect(() => {
    if (excelCategoryList.length === 0) {
      dispatch(getExcelCategories());
    }
  }, [excelCategoryList, dispatch]);

  return (
    <>
      <Wrapper>
        <Dimmer inverted active={getExcelCategoryLoading}>
          <Loader />
        </Dimmer>

        <Grid>
          <StyledGridColumn width={16}>
            <StyledInstantSearchBar onChange={(v) => setSearchValue(v)} />
            <BorderedList celled verticalAlign="middle">
              {filteredData.map((report, index) => (
                <List.Item key={`report_${index}`}>
                  <List.Content>
                    <StyledAccordion fluid>
                      <Accordion.Title
                        index={index}
                        active={activeIndex === index}
                      >
                        <FlexWrapper>
                          <LeftFlex onClick={() => handleChangeIndex(index)}>
                            <i aria-hidden="true" className="dropdown icon" />
                            <strong>{report.title}</strong>
                          </LeftFlex>
                          {report?.image && (
                            <RightFlex>
                              <Button
                                primary
                                basic
                                size="mini"
                                content="Xem trước"
                                onClick={() => setPreviewImage(report.image)}
                              />
                            </RightFlex>
                        )}
                        </FlexWrapper>
                      </Accordion.Title>
                      <Accordion.Content
                        active={activeIndex === index}
                        content={report.component}
                      />
                    </StyledAccordion>
                  </List.Content>
                </List.Item>
            ))}
            </BorderedList>
            {data.length > 10 && (
              <ExportListPagination
                pageIndex={pageIndex}
                pageSize={pageIndex}
                pageCount={pageCount}
                totalCount={data.length}
                gotoPage={gotoPage}
              />
          )}
          </StyledGridColumn>
        </Grid>
      </Wrapper>

      <PreviewImageModal
        data={previewImage}
        onClose={() => setPreviewImage(undefined)}
      />
    </>
  );
};

export default ExportList;
