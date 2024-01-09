import { Dispatch, SetStateAction } from 'react';
import { API } from '../axiosSetup';
import { getLocalStorageItem } from '@/utils/localStorage';
import { UserDetailsProps } from '../types';

const userID = getLocalStorageItem('Expendit-userID') || null;
const user_id = userID ? JSON.parse(userID) : null;

export const getUserApi = async (setFormLoading: Dispatch<SetStateAction<boolean>>) => {
  setFormLoading(true)
  try {
    const { data, status } = await API.get(`/users/${user_id}`);

    if (data && status === 200) {
      setFormLoading(false);

      console.log(data);
      return data;
    }
  } catch (error) {
    setFormLoading(false);
    console.log(error)
  }
}

export const userDetailsApi = async ({
  completeForm,
  setFormError,
  setFormSuccess,
  setFormLoading,
  setUser
}: UserDetailsProps) => {
  try {
    const payload = JSON.stringify(completeForm)
    const { data, status } = await API.put(`/users/${user_id}`, payload);

    if (data && status === 200) {
      setUser(data.updated_user)
      localStorage.setItem('Expendit-user', JSON.stringify(data.updated_user));

      setFormSuccess("Successful!");
      setFormLoading(false);
      console.log(data);
    }
  } catch (error) {
    setFormError("an error occurred, try again");
    setFormLoading(false);
    console.log(error)
  }
}