import React from 'react';
import Select from 'react-select';
import { useDirection } from '../../context/DirectionContext';

// React-Select custom styles
const selectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: '38px',
    borderColor: state.isFocused ? '#2A7CFF' : '#DDE2E8',
    boxShadow: state.isFocused ? '0 0 0 3px #E6F0FF' : 'none',
    '&:hover': { borderColor: '#2A7CFF' },
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    borderRadius: '8px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#2A7CFF' : state.isFocused ? '#E6F0FF' : 'white',
    color: state.isSelected ? 'white' : '#1A1D1F',
    cursor: 'pointer',
    fontSize: '14px',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#97A0AB',
  }),
  singleValue: (base) => ({
    ...base,
    color: '#1A1D1F',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: '#E6F0FF',
    borderRadius: '4px',
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: '#2A7CFF',
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: '#2A7CFF',
    '&:hover': {
      backgroundColor: '#2A7CFF',
      color: 'white',
    },
  }),
};

/**
 * CustomSelect - A reusable React Select component with consistent styling
 * 
 * @param {Object} props
 * @param {Array} props.options - Array of options { value, label }
 * @param {Object|null} props.value - Selected value(s)
 * @param {Function} props.onChange - Change handler
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.isClearable - Allow clearing selection (default: true)
 * @param {boolean} props.isSearchable - Allow searching (default: true)
 * @param {boolean} props.isMulti - Allow multiple selection (default: false)
 * @param {boolean} props.isDisabled - Disable the select (default: false)
 * @param {string} props.className - Additional CSS class
 * @param {Object} props.customStyles - Custom styles to merge with default styles
 */
function CustomSelect({
  options = [],
  value = null,
  onChange,
  placeholder = 'Select...',
  isClearable = true,
  isSearchable = true,
  isMulti = false,
  isDisabled = false,
  className = '',
  customStyles = {},
  ...rest
}) {
  const { isRTL } = useDirection();

  // Merge custom styles with default styles
  const mergedStyles = {
    ...selectStyles,
    ...customStyles,
    control: (base, state) => ({
      ...selectStyles.control(base, state),
      ...(customStyles.control ? customStyles.control(base, state) : {}),
    }),
    menu: (base) => ({
      ...selectStyles.menu(base),
      ...(customStyles.menu ? customStyles.menu(base) : {}),
    }),
  };

  return (
    <Select
      styles={mergedStyles}
      isRTL={isRTL}
      isClearable={isClearable}
      isSearchable={isSearchable}
      isMulti={isMulti}
      isDisabled={isDisabled}
      placeholder={placeholder}
      menuPortalTarget={document.body}
      options={options}
      value={value}
      onChange={onChange}
      className={className}
      classNamePrefix="custom-select"
      {...rest}
    />
  );
}

export default CustomSelect;
