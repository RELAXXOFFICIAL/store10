import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Database } from '../../lib/database.types';

type PopupPromotion = Database['public']['Tables']['popup_promotions']['Row'];

const popupSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  image_url: z.string().optional(),
  start_date: z.string(),
  end_date: z.string(),
  frequency: z.enum(['once_per_session', 'daily', 'every_visit']),
  target_audience: z.enum(['all', 'new_visitors', 'returning_customers']),
  position: z.enum(['center', 'top', 'bottom']),
  display_delay: z.number().min(0),
  cta_text: z.string().optional(),
  cta_link: z.string().url().optional(),
  styling: z.record(z.any()).optional(),
  is_active: z.boolean()
});

type PopupFormData = z.infer<typeof popupSchema>;

interface PopupFormProps {
  popup?: PopupPromotion;
  onSubmit: (data: PopupFormData) => Promise<void>;
  onPreview: (data: PopupFormData) => void;
}

export default function PopupForm({ popup, onSubmit, onPreview }: PopupFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<PopupFormData>({
    resolver: zodResolver(popupSchema),
    defaultValues: popup
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      // Handle image upload to storage and get URL
      console.log(acceptedFiles);
    }
  });

  const formData = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register('title')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image</label>
        <div
          {...getRootProps()}
          className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
        >
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <input {...getInputProps()} />
              <p className="pl-1">
                Drag 'n' drop an image here, or click to select
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="datetime-local"
            {...register('start_date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input
            type="datetime-local"
            {...register('end_date')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Display Frequency</label>
          <select
            {...register('frequency')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="once_per_session">Once Per Session</option>
            <option value="daily">Daily</option>
            <option value="every_visit">Every Visit</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target Audience</label>
          <select
            {...register('target_audience')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Visitors</option>
            <option value="new_visitors">New Visitors</option>
            <option value="returning_customers">Returning Customers</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Position</label>
          <select
            {...register('position')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="center">Center</option>
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Delay (ms)</label>
          <input
            type="number"
            {...register('display_delay', { valueAsNumber: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">CTA Text</label>
          <input
            type="text"
            {...register('cta_text')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">CTA Link</label>
          <input
            type="url"
            {...register('cta_link')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('is_active')}
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label className="ml-2 block text-sm text-gray-900">Active</label>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => onPreview(formData)}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Preview
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {popup ? 'Update Popup' : 'Create Popup'}
        </button>
      </div>
    </form>
  );
}