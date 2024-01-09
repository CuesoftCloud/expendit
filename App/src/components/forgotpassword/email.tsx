"use client"

import LoaderSpinner from "../helpers/LoaderSpinner";
import Input from "../signup/Input"
import { useForgotPasswordCustomState } from "./states"
import styles from './styles';
import { EmailInputProps } from "./types";

const EmailInput: React.FC<EmailInputProps> = ({ handleNext }) => {
  const {
    form,
    formLoading,
    handleChange,
  } = useForgotPasswordCustomState();
  return (
    <section className={styles.container}>
      <div>
        <h1 className={styles.heading}>Forgot your password?</h1>
        <p>Enter the email associated with your account and we&apos;ll send an email with instructions to reset your password</p>
        <Input
          label="Email address"
          name="email"
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          handleChange={handleChange}
        />
        <button 
          type='submit' 
          className={styles.btn} 
          disabled={formLoading}
          onClick={handleNext}
        >
          { formLoading 
            ? <LoaderSpinner 
              style='spin' 
              variant='spin-small' 
            /> 
            :  "Send Instructions" 
          }
        </button>
      </div>
    </section>
  )
}

export default EmailInput