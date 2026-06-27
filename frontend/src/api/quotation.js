import API from './axios';

export const compareQuotation=()=>API.get(`/quotation/compare`);
export const updateStatus=(id,data)=>API.put(`/quotation/${id}`,data);
export const createQuotation=(data)=>API.post(`/quotation`,data);
export const delQuotation=(id)=>API.delete(`/quotation/${id}`);
export const getQuotations=(search='')=>API.get(`/quotation?search=${search}`)