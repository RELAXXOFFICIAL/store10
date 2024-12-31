import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import ProductImage from './ProductImage';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().optional(),
  description: z.string().min(1, 'Description is required'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  inventory_count: z.string().regex(/^\d+$/, 'Must be a number'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['active', 'archived', 'out_of_stock']).default('active'),
  tags: z.array(z.string()).default([]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  variants: z.array(z.object({
    name: z.string(),
    values: z.array(z.string())
  })).optional()
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Partial<ProductFormData> & { images?: string[] };
  onSubmit: (data: ProductFormData & { images: string[] }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({ initialData, onSubmit, onCancel }: ProductFormProps) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const { register, handleSubmit, formState: { errors }, watch } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 6) {
      toast.error('Maximum 6 images allowed');
      return;
    }

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (const file of acceptedFiles) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
          toast.error(`${file.name} has unsupported format`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });
        
        if (uploadError) {
          toast.error(`Error uploading ${file.name}`);
          continue;
        }

        const { data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        setUploadProgress(prev => ({
          ...prev,
          [fileName]: data?.progress || 0
        }));
        
        if (uploadError) {
          toast.error(`Error uploading ${file.name}`);
          continue;
        }
        
        if (uploadError) {
          toast.error(`Error uploading ${file.name}`);
          continue;
        }

        if (uploadError) {
          toast.error(`Error uploading ${file.name}`);
          continue;
        }

        if (uploadError) {
          toast.error(`Error uploading ${file.name}`);
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        newImages.push(publicUrl);
      }

      setImages(prev => [...prev, ...newImages]);
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Error uploading images');
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    maxSize: MAX_FILE_SIZE,
    disabled: uploading
  });

  const removeImage = async (index: number) => {
    const newImages = [...images];
    const removedImage = newImages[index];
    
    // Extract file name from URL
    const fileName = removedImage.split('/').pop();
    
    if (fileName) {
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);

      if (error) {
        toast.error('Error removing image');
        return;
      }
    }

    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    console.log('Form data:', data);
    if (images.length === 0) {
      toast.error('At least one image is required');
      return;
    }

    await onSubmit({ ...data, images });
  };

  // Log form values
  useEffect(() => {
    const subscription = watch((value) => console.log('Form values:', value));
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            {...register('name')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">SKU</label>
          <input
            type="text"
            {...register('sku')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="text"
              {...register('price')}
              className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Inventory Count</label>
          <input
            type="number"
            {...register('inventory_count')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.inventory_count && (
            <p className="mt-1 text-sm text-red-600">{errors.inventory_count.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Product Images</label>
        <div className="mt-2 grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <ProductImage
                src={image}
                alt={`Product image ${index + 1}`}
                className="h-40 w-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>

        <div
          {...getRootProps()}
          className={`mt-4 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          }`}
        >
          <div className="space-y-1 text-center">
            <input {...getInputProps()} />
            {uploading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-sm text-gray-500">Uploading images...</p>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <p className="pl-1">
                    {isDragActive
                      ? "Drop the files here..."
                      : "Drag 'n' drop product images, or click to select"}
                  </p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, WebP up to 5MB (max 6 images)
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
        >
          {uploading ? 'Uploading...' : 'Save Product'}
        </button>
      </div>
    </form>
  );
}
