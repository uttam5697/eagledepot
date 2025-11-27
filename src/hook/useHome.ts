import api from "../lib/api";

export const getHomeData = async (
) => {
  const res = await api.get("/beforeauth/gethomescreen");
  return res.data;
};

export const getAboutData = async (
) => {
  const res = await api.get("/beforeauth/getaboutus");
  return res.data;
};


export const getGeneralData = async (
) => {
  const res = await api.get("/beforeauth/setting");
  return res.data;
};

export const getShipingData = async (
) => {
  const res = await api.get("/beforeauth/getshippingcharge");
  return res.data;
};

export const getProductCategories = async () => {
  const res = await api.post("/beforeauth/getproductcategory");
  return res.data;
};