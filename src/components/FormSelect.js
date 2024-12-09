export const FormSelect = ({ label, name, options, value, onChange, disabled = false, multiple = false}) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <select 
    id={name} 
    name={name}
    value={value}
    onChange={onChange}
    disabled={disabled}
    multiple={multiple}
    >
      <option value="">Select {label}</option>
      {Array.isArray(options) && options.map((option, index) => (
        <option key={index} value={option}>
          {option}
          </option>
      ))}
    </select>
  </div>
);