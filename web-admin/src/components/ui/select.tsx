import React from 'react';
import { Path, useForm, UseFormRegister, SubmitHandler } from 'react-hook-form';

interface IFormValues {
  grupotrabajo_id: string;
}

const Select = React.forwardRef<
  HTMLSelectElement,
  { label: string; data: any[] } & ReturnType<UseFormRegister<IFormValues>>
>(({ onChange, onBlur, name, label, data }, ref) => (
  <>
    <label className='form-label'>{label}</label>
    <select
      className='form-control'
      name={name}
      ref={ref}
      onChange={onChange}
      onBlur={onBlur}
    >
      <option value=''></option>
      {data &&
        data.map((c, index) => (
          <option key={c.id} value={c.id}>
            {c.nombre}
          </option>
        ))}
    </select>
  </>
));

export default Select;
