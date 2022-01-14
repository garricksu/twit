import { useField } from 'formik'
import { InputHTMLAttributes } from 'react'
import { Col, Form } from 'react-bootstrap'

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  name: string
}

export const FormInputField: React.FC<InputFieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <Col>
      <Form.Label htmlFor={props.name} className='fw-bold fs-5'>
        {label}
      </Form.Label>

      <input className='text-input form-control' {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className='error text-danger'>{meta.error}</div>
      ) : null}
    </Col>
  )
}
