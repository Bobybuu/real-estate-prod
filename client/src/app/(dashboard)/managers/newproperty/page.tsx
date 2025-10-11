"use client";

import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { CustomFormField } from "@/components/CustomFormField";

const NewPropertyPage = () => {
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
  };

  return (
    <FormProvider {...methods}>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Add New Property</h1>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField name="name" label="Property Name" />
          <CustomFormField name="price" label="Price" type="number" />
          <CustomFormField name="description" label="Description" type="textarea" />
          <CustomFormField name="photos" label="Property Photos" type="file" accept="image/*" />
          <button type="submit" className="bg-primary-700 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      </div>
    </FormProvider>
  );
};

export default NewPropertyPage;
