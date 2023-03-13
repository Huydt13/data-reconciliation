/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import {
  // FiPlus,
  FiTrash2,
  FiFileText,
  // FiArchive,
  // FiDownload,
  FiUpload,
  FiRefreshCcw,
} from "react-icons/fi";

import moment from "moment";
import { useAuth } from "app/hooks";
import { DataTable } from "app/components/shared";
import ProfileFilter from "profile/components/ProfileFilter";
import GroupProfileModal from "profile/components/GroupProfileModal";
import MergeProfileDuplicateModal from "profile/components/MergeProfileDuplicateModal";
import ExportProfileHasExaminationModal from "profile/components/ExportProfileHasExaminationModal";
import ImportGroupProfileRiskModal from "profile/components/ImportGroupProfileRiskModal";

import { useSelector, useDispatch } from "react-redux";
import { showConfirmModal } from "app/actions/global";
import { formatAddressToString, renderProfileKey } from "app/utils/helpers";
import {
  deleteProfile,
  dongBoXetNghiemProfile,
  getProfiles,
} from "profile/actions/profile";
// import { getCreateFromType } from 'infection-chain/utils/helpers';

const columns = [
  { Header: "ID hồ sơ", accessor: "id" },
  {
    Header: "Tên",
    formatter: ({ fullName }) => fullName || "",
    cutlength: 50,
  },
  {
    Header: "Ngày sinh",
    formatter: (row) =>
      row.dateOfBirth
        ? !row.hasYearOfBirthOnly
          ? moment(row.dateOfBirth).format("DD-MM-YYYY")
          : moment(row.dateOfBirth).format("YYYY")
        : "Chưa xác định",
  },
  {
    Header: "Địa chỉ nhà",
    formatter: ({ addressesInVietnam }) =>
      formatAddressToString(addressesInVietnam[0]),
  },
  {
    Header: "Thông tin xác thực",
    formatter: (r) => renderProfileKey({ ...r, keyWithAddress: false }),
  },
  {
    Header: "Số điện thoại",
    accessor: "phoneNumber",
  },
  // { Header: 'Được tạo từ', formatter: (r) => getCreateFromType(r?.createdFrom ?? 0)?.label ?? '' },
];

const ProfileTable = (props) => {
  const { hasOnUsingProfiles, hasGroupProfiles } = props;

  // const history = useHistory();
  const { isAdmin } = useAuth();

  const [filter, setFilter] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [groupProfile, setGroupProfile] = useState(undefined);
  const [mergeProfileDuplicate, setMergeProfileDuplicate] = useState(false);
  const [exportProfileHasExamination, setExportProfileHasExamination] =
    useState(false);
  const [importGroupRisk, setImportGroupRisk] = useState(false);

  const {
    profileList,
    getProfilesLoading,
    createProfileLoading,
    updateProfileLoading,
    deleteProfileLoading,
  } = useSelector((state) => state.profile);
  const loading =
    getProfilesLoading ||
    createProfileLoading ||
    updateProfileLoading ||
    deleteProfileLoading;
  const dispatch = useDispatch();

  const getData = useCallback(() => {
    dispatch(
      getProfiles({
        ...filter,
        pageIndex,
        pageSize,
        hasOnUsingProfiles,
        hasGroupProfiles,
      })
    );
  }, [
    dispatch,
    filter,
    pageIndex,
    pageSize,
    hasOnUsingProfiles,
    hasGroupProfiles,
  ]);

  const handleDelete = (data) => {
    dispatch(
      showConfirmModal("Xác nhận xóa?", async () => {
        await dispatch(deleteProfile(data.id));
        getData();
      })
    );
  };

  const handleDongBo = (id) => {
    dispatch(
      showConfirmModal("Bạn có muốn đồng bộ?", async () => {
        await dispatch(dongBoXetNghiemProfile(data.id));
        getData();
      })
    );
  };
  useEffect(getData, [getData]);

  const { data, totalPages, totalRows } = profileList;

  return (
    <>
      <ProfileFilter onChange={setFilter} />
      <DataTable
        title={`Danh sách ${hasGroupProfiles ? "hồ sơ gộp" : "hồ sơ đơn"}`}
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={loading}
        pageCount={totalPages}
        totalCount={totalRows}
        onPaginationChange={(p) => {
          setPageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          // {
          //   icon: <FiArchive />,
          //   title: 'Gộp hồ sơ trùng',
          //   color: 'yellow',
          //   onClick: () => setMergeProfileDuplicate(true),
          //   globalAction: true,
          // },
          // {
          //   icon: <FiDownload />,
          //   title: 'Xuất Excel',
          //   color: 'blue',
          //   globalAction: true,
          //   dropdown: true,
          //   dropdownActions: [
          //     {
          //       titleDropdown: 'Xuất hồ sơ có lịch sử xét nghiệm',
          //       onDropdownClick: () => setExportProfileHasExamination(true),
          //     },
          //   ],
          // },
          {
            icon: <FiRefreshCcw />,
            title: "Đồng Bộ Xét Nghiệm",
            color: "gray",
            onClick: (r) => {
              handleDongBo(r.id);
            },
            globalAction: false,
          },
          {
            icon: <FiUpload />,
            title: "Nạp hồ sơ thuộc nhóm nguy cơ",
            color: "purple",
            onClick: () => setImportGroupRisk(true),
            globalAction: true,
          },
          {
            icon: <FiFileText />,
            title: "Hồ sơ",
            color: "blue",
            onClick: (r) =>
              hasGroupProfiles
                ? setGroupProfile(r.id)
                : window.open(`/profile/${r.id}`, "_blank"),
            disabled: false,
          },
          {
            icon: <FiTrash2 />,
            title: "Xóa",
            color: "red",
            onClick: handleDelete,
            disabled: !isAdmin,
          },
        ]}
      />

      {/* <GroupProfileModal
        data={groupProfile}
        onClose={() => setGroupProfile(undefined)}
      /> */}

      {/* <MergeProfileDuplicateModal
        open={mergeProfileDuplicate}
        onClose={() => setMergeProfileDuplicate(false)}
        onRefresh={getData}
      /> */}

      {/* <ExportProfileHasExaminationModal
        open={exportProfileHasExamination}
        onClose={() => setExportProfileHasExamination(false)}
      /> */}

      <ImportGroupProfileRiskModal
        open={importGroupRisk}
        onClose={() => setImportGroupRisk(false)}
        onRefresh={getData}
      />
    </>
  );
};

ProfileTable.defaultProps = {
  hasOnUsingProfiles: undefined,
  hasGroupProfiles: undefined,
};

ProfileTable.propTypes = {
  hasOnUsingProfiles: PropTypes.bool,
  hasGroupProfiles: PropTypes.bool,
};

export default ProfileTable;
