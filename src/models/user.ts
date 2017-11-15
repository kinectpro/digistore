/**
 * Created by Andrey Okhotnikov on 14.11.17.
 */
export interface User {
  api_key: string,
  user_id: string,
  user_name: string,
  user_email: string,
  first_name?: string,
  last_name?: string
}