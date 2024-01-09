"use client"

import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { passwordChangeProps } from './types';
import { passwordChangeApi } from '@/API/APIS/authApi';
import { formatPasswordChange, passwordRequiredFields } from '@/utils/formatPasswordChange';
import { PasswordPayload } from '@/API/types';
import { useHomeContext } from '@/context';


export const usePasswordCustomState = () => {
  const {
    formLoading,
    setFormLoading,
    setFormError,
    setFormSuccess
  } = useHomeContext();

  const initialForm: passwordChangeProps = {
    old_password: "",
    new_password: "",
    confirm_password: ""
  };

  const [form, setForm] = useState<passwordChangeProps>(initialForm);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }))
  };

  const handleCancel = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setForm(initialForm);
  }

  const handleSubmit = async (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (formLoading) return;
    setFormLoading(true);

    const completeForm = formatPasswordChange(form);
    const isAnyRequiredFieldEmpty = passwordRequiredFields.some(
      (field) => !completeForm[field as keyof PasswordPayload],
    );

    if (isAnyRequiredFieldEmpty) {
      setFormError("Please fill out all fields!");
      setFormLoading(false);
      return;
    };

    if (form.new_password === form.old_password) {
      setFormError("New password should not be the same as the old password!");
      setFormLoading(false);
      return;
    }

    if (form.new_password !== form.confirm_password) {
      setFormError("New password and confirm password do not match!");
      setFormLoading(false);
      return;
    }

    await passwordChangeApi({
      completeForm,
      setFormError,
      setFormSuccess,
      setFormLoading,
    });

    setForm(initialForm);
  };


  return {
    form,
    formLoading,
    handleChange,
    handleSubmit,
    handleCancel,
  }
}