export const FormInput = ({ label, name, value, onChange, ...props }) => (
    <div>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );

 