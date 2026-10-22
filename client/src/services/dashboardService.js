import api from "./axios";

export const getDashboardStats = async () => {
  const response = await api.get("/dashboard/stats");
  return response.data;
};

export const getRecentAssignments = async () => {
  const response = await api.get("/dashboard/recent-assignments");
  return response.data;
};

export const getCategorySummary = async () => {
  const response = await api.get("/dashboard/category-summary");
  return response.data;
};

export const getWarrantyAlerts = async () => {
  const response = await api.get("/dashboard/warranty-alerts");
  return response.data;
};

export const getMonthlyPurchases = async () => {
  const response = await api.get("/dashboard/monthly-purchases");
  return response.data;
};

export const getActivityTimeline = async () => {
  const response = await api.get("/dashboard/activity-timeline");
  return response.data;
};

export const getAssetStatusReport = async () => {
    const response = await api.get("/dashboard/asset-status");
    return response.data;
};

export const getBrandWiseAssets = async () => {
  const response = await api.get("/dashboard/brand-wise-assets");
  return response.data;
};

export const getLowStockAssets = async () => {
  const response = await api.get("/dashboard/low-stock");
  return response.data;
};

export const getPurchaseCostSummary = async () => {
  const response = await api.get("/dashboard/purchase-summary");
  return response.data;
};