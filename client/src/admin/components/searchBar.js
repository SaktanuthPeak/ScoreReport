import React, { useMemo, useRef, useState } from "react";
import { Select, Spin, Space, Tag, theme } from "antd";
import { SearchOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import debounce from "lodash/debounce";
import ax from "../../conf/ax";

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);
  const { token } = theme.useToken();

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          return;
        }
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);
  const handleSearch = (value) => {

    debounceFetcher(value);
  };

  const spinStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: token.padding,
  };

  const notFoundStyle = {
    padding: token.padding,
    textAlign: "center",
    color: token.colorTextSecondary,
  };

  return (
    <Select
      showSearch
      labelInValue
      filterOption={false}
      onSearch={handleSearch}
      notFoundContent={
        fetching ? (
          <div style={spinStyle}>
            <Spin
              indicator={
                <LoadingOutlined
                  style={{ fontSize: 24, color: token.colorPrimary }}
                  spin
                />
              }
            />
          </div>
        ) : (
          <div style={notFoundStyle}>No users found</div>
        )
      }
      {...props}
      options={options}
      dropdownStyle={{
        padding: token.padding,
        borderRadius: token.borderRadius,
      }}
      suffixIcon={fetching ? <LoadingOutlined spin /> : <SearchOutlined />}
    />
  );
}

async function fetchUserList(username) {
  console.log("Fetching users:", username);
  return ax
    .get(`/users?search=${username}`)
    .then((response) => response.data)
    .then((data) =>
      data.filter((user) => user.UID && user.UID.includes(username)).map((user) => ({
        label: (
          <Space>
            <UserOutlined style={{ color: "rgba(0, 0, 0, 0.45)" }} />
            <span>{user.UID}</span>
          </Space>
        ),
        value: user.username,
      }))
    )
    .catch((error) => {
      console.error("Error fetching users:", error);
      return [];
    });
}

const SearchBar = ({ onChange }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { token } = theme.useToken();

  const handleChange = (newValue) => {
    setSelectedUsers(newValue || []);

    const selectedUsernames = (newValue || []).map((option) => option.value);
    console.log("Selected usernames:", selectedUsernames);

    if (onChange) {
      onChange(newValue || []);
    }
  };

  const tagRender = ({ onClose, value }) => {
    const tagStyle = {
      display: "flex",
      alignItems: "center",
      gap: token.marginXXS,
      backgroundColor: token.colorPrimaryBg,
      borderColor: token.colorPrimaryBorder,
      color: token.colorPrimary,
      marginRight: token.marginXS,
      fontSize: token.fontSize,
    };

    return (
      <Tag closable onClose={onClose} style={tagStyle}>
        <UserOutlined style={{ fontSize: "12px" }} />
        <span>{value}</span>
      </Tag>
    );
  };

  const selectStyle = {
    width: "100%",
  };

  return (
    <div style={{ width: "100%" }}>
      <DebounceSelect
        mode="multiple"
        value={selectedUsers}
        placeholder="Search and select users..."
        fetchOptions={fetchUserList}
        onChange={handleChange}
        style={selectStyle}
        tagRender={tagRender}
      />
    </div>
  );
};

export default SearchBar;
