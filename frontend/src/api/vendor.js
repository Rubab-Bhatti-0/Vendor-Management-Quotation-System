import API from './axios';

export const getVendors=(search='')=>API.get(`/vendors?search=${search}`);
export const createVendor=(data)=>API.post(`/vendor`,data);
export const updateVendor=(id,data)=>API.put(`/vendor/${id}`,data);
export const getVendorByID=(id)=>API.get(`/vendor/${id}`);
export const delVendor=(id)=>API.delete(`/vendor/${id}`)