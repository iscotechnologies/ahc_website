import { supabase } from '../supabaseClient';

/**
 * Uploads a file to the "photos" bucket in Supabase storage and returns its public URL.
 * @param file The file to upload.
 * @param folder The folder inside the bucket (e.g. 'doctors', 'hospitals', 'hero').
 */
export async function uploadPhoto(file: File, folder: string = 'doctors'): Promise<string> {
  const fileExt = file.name.split('.').pop();
  // Sanitize file name and append timestamp to guarantee uniqueness
  const sanitizedFolderName = folder.replace(/[^a-zA-Z0-9/_-]/g, '');
  const randomStr = Math.random().toString(36).substring(2, 10);
  const fileName = `${sanitizedFolderName}/${randomStr}_${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading photo:', error);
    throw error;
  }

  // Retrieve the public URL for the newly uploaded file
  const { data: { publicUrl } } = supabase.storage
    .from('photos')
    .getPublicUrl(fileName);

  return publicUrl;
}
