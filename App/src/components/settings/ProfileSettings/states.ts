"use client"

import { useState, ChangeEvent, FormEvent } from 'react';
import { userDetailsProps } from './types';
import { userDetailsApi } from '@/API/APIS/userApi';
import { formatUserDetails, userDetailsRequiredFields } from '@/utils/formatUserDetails';
import { UserDetailsPayload } from '@/API/types';
import { useHomeContext } from '@/context';

export const useDetailsCustomState = () => {
  const {
    setFormError,
    setFormSuccess,
    setFormLoading,
    setUser,
    formLoading
  } = useHomeContext();

  const initialForm: userDetailsProps = {
    first_name: "",
    last_name: "",
  };

  const [form, setForm] = useState<userDetailsProps>(initialForm);

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

    const completeForm = formatUserDetails(form);
    const isAnyRequiredFieldEmpty = userDetailsRequiredFields.some(
      (field) => !completeForm[field as keyof UserDetailsPayload],
    );

    if (isAnyRequiredFieldEmpty) {
      setFormError("Please fill out all fields!");
      setFormLoading(false);
      return;
    };


    await userDetailsApi({
      completeForm,
      setFormError,
      setFormSuccess,
      setFormLoading,
      setUser,
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