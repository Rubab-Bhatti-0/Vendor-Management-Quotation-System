import API from './axios';

export const getVendors=(search='')=>API.get(`/vendors?search=${search}`);
export const createVendor=(data)=>API.post(`/vendors`,data);
export const updateVendor=(id,data)=>API.put(`/vendors/${id}`,data);
export const getVendorByID=(id)=>API.get(`/vendors/${id}`);
export const delVendor=(id)=>API.delete(`/vendors/${id}`);
