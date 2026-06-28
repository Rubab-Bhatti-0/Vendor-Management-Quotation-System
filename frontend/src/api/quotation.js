import API from './axios';

export const compareQuotation=()=>API.get(`/quotations/compare`);
export const updateStatus=(id,data)=>API.put(`/quotations/${id}`,data);
export const createQuotation=(data)=>API.post(`/quotations`,data);
export const delQuotation=(id)=>API.delete(`/quotations/${id}`);
export const getQuotations=(status='')=>API.get(`/quotations?status=${status}`);
