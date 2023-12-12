import React, { Fragment }  from 'react';
import styles from './styles';
import Input from '@/components/signup/Input';
import LoaderSpinner from '@/components/helpers/LoaderSpinner';
import Notification from '@/components/helpers/Notification';
import { usePasswordCustomState } from './states';

const index = () => {
  const {
    form,
    formError,
    formSuccess,
    formLoading,
    handleChange,
    handleSubmit,
    handleCancel,
    isSubmitDisabled } = usePasswordCustomState()
  return (
    <div className={styles.pagePad}>
      <section>
        <div className={styles.section}>
          <div>
            <h1 className={styles.semibold}>Change Password</h1>
            <p className={styles.paragraph}>Update your password here</p>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.button} onClick={handleCancel}>Cancel</button>
            <button 
            className={styles.changeButton} 
            disabled={isSubmitDisabled} 
            onClick={handleSubmit}>
            { formLoading 
              ? <LoaderSpinner 
                style='spin' 
                variant='spin-small' 
              /> 
              :  "Save Changes" 
            }
            </button>
          </div>
        </div>
        <div>
        <Fragment>
          {formError !== "" && <Notification msg={formError} type="error" />}
          {formSuccess !== "" && <Notification msg={formSuccess} type="success" />}
          <form>
            <div className={styles.inputWrapper}>
              <Input
                name= 'old_password'
                type= 'password'
                label= 'Old Password'
                value= {form.old_password}
                placeholder='Enter Old Password'
                handleChange={handleChange}
                custom
              />
            </div>
            <div className={styles.inputWrapper}>
              <Input
                name= 'new_password'
                type= 'password'
                label= 'New Password'
                value= {form.new_password}
                placeholder='Enter New Password'
                handleChange={handleChange}
                custom
              />
            </div>
            <div className={styles.inputWrapper}>
            <Input
                name= 'confirm_password'
                type= 'password'
                label= 'Confirm Password'
                value= {form.confirm_password}
                placeholder='Confirm New Password'
                handleChange={handleChange}
                custom
              />
            </div>
          </form>
        </Fragment>
        </div>
      </section>
    </div>
  )
}

export default index
