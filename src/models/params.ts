/**
 * Created by Andrey Okhotnikov on 26.10.17.
 */
export interface Sort {
  sort_by?: string,
  sort_order?: string
}

export interface Search {
  product_id?: string,
  first_name?: string,
  last_name?: string,
  email?: string,
  has_affiliate?: string,
  affiliate_name?: string,
  pay_method?: string,
  billing_type?: string,
  transaction_type?: string,
  currency?: string,
  from?: string,
  to?: string,
}

export interface Params {
  search: Search;
  sort: Sort;
}