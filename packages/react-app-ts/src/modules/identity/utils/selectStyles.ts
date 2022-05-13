export const selectStyles = {
  menu: (provided) => ({
    ...provided,
    bg: "white",
    zIndex: 100,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    bg: "transparent",
    px: 2,
    cursor: "inherit",
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    display: "none",
  }),
};
