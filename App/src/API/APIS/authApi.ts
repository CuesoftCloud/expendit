import { API } from '../axiosSetup';
import {
  SignUpProps,
  SignInProps,
  LogoutProps,
  PasswordChangeProps
} from '../types';

export const signUpApi = async ({
  completeForm,
  setFormError,
  setFormSuccess,
  setFormLoading,
  router
}: SignUpProps) => {

  try {
    const payload = JSON.stringify(completeForm)
    const { data, status } = await API.post('/users/signup', payload);

    if (data && status === 200) {
      setFormSuccess("Successful!");
      setFormLoading(false);

      router.push('/signin');
      console.log(data);
    }
  } catch (error) {
    setFormError("an error occurred, try again");
    setFormLoading(false);
    console.log(error)
  }
};

export const signInApi = async ({
  completeForm,
  setFormError,
  setFormSuccess,
  setFormLoading,
  setUser,
  router
}: SignInProps) => {

  try {
    const payload = JSON.stringify(completeForm)
    const { data, status } = await API.post('/users/signin', payload);

    if (data && status === 200) {
      setFormSuccess("Successful!");
      setFormLoading(false);
      setUser(data);

      const jwt = data.token;
      const user_id = data.user_id;
      localStorage.setItem('Expendit-token', JSON.stringify(jwt));
      localStorage.setItem('Expendit-userID', JSON.stringify(user_id));
      localStorage.setItem('Expendit-user', JSON.stringify(data));
      localStorage.setItem('ExpenditLoggedIn', JSON.stringify(true));

      router.push('/');

    }
  } catch (error: any) {
    setFormError(error.response.data.error);
    setFormLoading(false);
  }
};

export const logoutApi = async ({ router, setFormLoading }: LogoutProps) => {
  try {
    setFormLoading(true);
    router.push("/signin");

    localStorage.removeItem("Expendit-token");
    localStorage.removeItem("Expendit-user");
    localStorage.removeItem("Expendit-userID");
    localStorage.removeItem("ExpenditLoggedIn");
    setFormLoading(false);
  } catch (error) {
    console.log(error);
    setFormLoading(false);
  }
};

export const passwordChangeApi = async ({
  completeForm,
  setFormError,
  setFormSuccess,
  setFormLoading,
}: PasswordChangeProps) => {

  try {
    const payload = JSON.stringify(completeForm)
    const { data, status } = await API.put('/users/change-password', payload);

    if (data && status === 200) {
      setFormSuccess("Successful!");
      setFormLoading(false);
    }
  } catch (error) {
    setFormError("an error occurred, try again");
    setFormLoading(false);
  }

};