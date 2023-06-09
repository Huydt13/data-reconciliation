import { DataTable } from "app/components/shared";
import moment from "moment/moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getProfiles } from "profile/actions/profile";
import PropTypes from "prop-types";
import { FiFileText, FiUpload, FiList } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import ProfileFilter from "./ProfileFilter";
import ImportModal from "./ImportModal";

const columns = [
  {
    Header: "STT",
    accessor: "id",
  },
  {
    Header: "Tên file",
    formatter: ({ file }) => file || "",
    cutlength: 50,
  },
  {
    Header: "Ngày tạo",
    formatter: (row) =>
      row.dateStart
        ? !row.hasYearStart
          ? moment(row.dateStart).format("DD-MM-YYYY")
          : moment(row.dateStart).format("YYYY")
        : "Chưa xác định",
  },
  {
    Header: "Ngày xóa file",
    formatter: (row) =>
      row.dateDeleteFile
        ? !row.hasYearDeleteFile
          ? moment(row.dateDeleteFile).format("DD-MM-YYYY")
          : moment(row.dateDeleteFile).format("YYYY")
        : "Chưa xác định",
  },
  // {
  //   Header: "Địa chỉ nhà",
  //   formatter: ({ addressesInVietnam }) =>
  //     formatAddressToString(addressesInVietnam[0]),
  // },
  // {
  //   Header: "Thông tin xác thực",
  //   formatter: (r) => renderProfileKey({ ...r, keyWithAddress: false }),
  // },
  { Header: "Tiến trình", accessor: "process" },
  { Header: "Trạng thái", accessor: "status" },
  { Header: "Lỗi", accessor: "error" },
  { Header: "Dữ liệu", accessor: "data", icon: <FiList /> },
];
const ProfileTable = ({ hasGroupProfiles }) => {
  const [filter, setFilter] = useState({});
  const [pageIndex, setpageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [groupProfile, setGroupProfile] = useState(undefined);
  const [importGroupRisk, setImportGroupRisk] = useState(false);

  const history = useHistory();
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
      })
    );
  }, [dispatch, filter, pageIndex, pageSize]);
  useEffect(getData, [getData]);
  const { data, totalRows, totalPages } = profileList;
  return (
    <div>
      <ProfileFilter onChange={setFilter} />
      <DataTable
        columns={columns}
        data={(data || []).map((r, i) => ({ ...r, index: i + 1 }))}
        loading={loading}
        pageCount={totalPages}
        totalCount={totalRows}
        onPaginationChange={(p) => {
          setpageIndex(p.pageIndex);
          setPageSize(p.pageSize);
        }}
        actions={[
          {
            icon: <FiFileText />,
            disabled: false,
            title: "Hồ sơ",
            color: "blue",
            onClick: (e) => {
              console.log(e);
              window.open(`/train/${e.id}`, "_blank");
            },
            // eslint-disable-next-line no-dupe-keys
            disabled: false,
          },
          {
            icon: <FiUpload />,
            title: "Import",
            color: "green",
            onClick: () => setImportGroupRisk(true),
            globalAction: true,
          },
        ]}
      />
      <ImportModal
        open={importGroupRisk}
        onClose={() => setImportGroupRisk(false)}
        onRefresh={getData}
      />
    </div>
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
