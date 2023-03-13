import { DataTable } from "app/components/shared";
import moment from "moment/moment";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getProfiles } from "profile/actions/profile";
import PropTypes from "prop-types";
import { formatAddressToString, renderProfileKey } from "app/utils/helpers";
import { FiFileText } from "react-icons/fi";
import { useHistory } from "react-router-dom";
const columns = [
  {
    Header: "ID hồ sơ",
    accessor: "id",
  },
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
  { Header: "Số điện thoại", accessor: "phoneNumber" },
];
const ProfileTable = ({ hasGroupProfiles }) => {
  const [filter, setFilter] = useState({});
  const [pageIndex, setpageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [groupProfile, setGroupProfile] = useState(undefined);
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
        ]}
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
