import React, { useMemo, useRef, useState } from "react";
import { Select, Spin } from "antd";
import debounce from "lodash/debounce";
import ax from "../../conf/ax";

function DebounceSelect({ fetchOptions, debounceTimeout = 800, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const fetchRef = useRef(0);

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

  return (
    <Select
      showSearch
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

async function fetchUserList(username) {
  console.log("Fetching users:", username);
  return ax
    .get(`/users?search=${username}`)
    .then((response) => response.data)
    .then((data) =>
      data.map((user) => ({
        label: user.username,
        value: user.username, // Changed to store username instead of id
      }))
    )
    .catch((error) => {
      console.error("Error fetching users:", error);
      return [];
    });
}

const SearchBar = ({ onChange }) => {
  const handleSelect = (selectedOptions) => {
    // Log the selected usernames when selection changes
    const selectedUsernames = selectedOptions.map((option) => option.value);
    console.log("Selected usernames:", selectedUsernames);

    // Call the parent component's onChange handler
    if (onChange) {
      onChange(selectedOptions);
    }
  };

  return (
    <DebounceSelect
      mode="multiple"
      placeholder="Search and select users"
      fetchOptions={fetchUserList}
      onChange={handleSelect}
      style={{
        width: "100%",
      }}
    />
  );
};

export default SearchBar;
