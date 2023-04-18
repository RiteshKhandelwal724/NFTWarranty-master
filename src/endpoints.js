export const login = "/login.php";
export const logout = "/logout.php";
export const userExtendWarranty = "/userExtendWarranty.php";
export const verifyUser = (token) => `/verifyUser.php?auth-token=${token}`;
export const addEditProduct = "/add_edit_product.php";
export const productList = "/productList.php";
export const productDetailsEp = (productId) =>
  `/productDetails.php?productId=${productId}`;
export const userProductList = "/userProductList.php";
export const addUserProduct = "/addUserProducts.php";
export const addToken = "/addToken.php";
export const dashboardRecords = "/dashboardRecords.php";
export const myTransactions = (date) => {
  if (date) return `/getTransactions.php?date=${date ? date : ""}`;
  else return "/getTransactions.php";
};
export const getProductBCData = (token) =>
  `/getTokenDetails.php/?token=${token}`;
export const addUserProductToken = "/addUserProductToken.php";
export const productListFromBC = "/userProductListWithToken.php";
export const customerPrdctDetByPrdctId = (productId) =>
  `/customerPrdctDetByPrdctId.php?productId=${productId}`;
