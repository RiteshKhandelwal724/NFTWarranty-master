import * as Yup from "yup";
import { useFormik } from "formik";
import "../App.css";
import {
  Stack,
  TextField,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { tokenIdState, warrantyContractState } from "../store";
import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import moment from "moment";
import {
  addDataClickHandler,
  getMetaData,
  mintHandler,
} from "../functions/blockChainFunctions";
import { Link, useNavigate } from "react-router-dom";
import TransactionModal from "./TransactionModal";
import {
  getRequestLoggedIn,
  postRequestLoggedIn,
} from "../functions/apiClient";
import { addEditProduct, getProductBCData } from "../endpoints";
import QRScanner from "./QRScanner";

const productDetails = {
  locationOfPurchase: "",
  userEmail: "",
};

const AddProduct = () => {
  const [base64Image, setBase64Image] = useState([]);
  const [QRScannerState, setQRScannerState] = useState(false);
  const hiddenFileInput = React.useRef(null);
  const [tokenId] = useAtom(tokenIdState);
  const Navigate = useNavigate();
  const [qrVisible, setQrVisible] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [responseState, setResponseState] = useState();
  const [addProductData, setAddProductData] = useState({});
  const [purchaseDate, setpurchaseDate] = useState(null);
  const [expirationDate, setExpirationDate] = useState(null);
  const [warrantyContract] = useAtom(warrantyContractState);
  const [start, setStart] = useState(false);
  const [resState, setRes] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const getProdDetails = async () => {
    if (tokenId) {
      setShowLoader(true);
      const resp = await getRequestLoggedIn(getProductBCData("6"), true);
      setShowLoader(false);
      setRes(resp);
    }
  };
  useEffect(() => {
    getProdDetails();
  }, [tokenId]);
  const productValidation = Yup.object().shape({
    locationOfPurchase: Yup.string()
      .required("Location Of Purchase is Required")
      .min(3, "Location of Purchase should atleast have 3 characters")
      .matches(
        /^[a-zA-Z]*$/,
        "Must not contain any digits or special characters"
      ),

    userEmail: Yup.string()
      .email("Email must be a valid email address")
      .required("Email is required"),
  });

  const { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues: productDetails,
      validationSchema: productValidation,
      onSubmit: async (data) => {
        setButtonClicked(true);
        if (!(purchaseDate && expirationDate)) {
        } else {
          setStart(true);
          //setAddProductsData([...addProductsData, data]);
          const responseMint = await mintHandler(warrantyContract);
          const tokenId = parseInt(
            responseMint?.events[0]?.args?.tokenId._hex,
            16
          );
          const dataResp = await addDataClickHandler(
            warrantyContract,
            tokenId,
            JSON.stringify(data)
          );

          const resp = await getMetaData(warrantyContract, tokenId);
          let productData = JSON.parse(resp);
          const product = (productData = {
            ...productData,
            tokenId: `${tokenId}`,
            locatioOfPurchase: productData.locationOfPurchase,
          });

          const res = await postRequestLoggedIn(addEditProduct, product);
          if (res?.status_code === "200") {
            // setOpen(true);
            setResponseState(dataResp);
            setQrVisible(true);
            setAddProductData(
              `https://warrantynft.netlify.app/ProductDescription?prodId=${values.productSerialNumber}`
            );
            setpurchaseDate("");
            setExpirationDate("");
            values.locationOfPurchase = "";
            values.productSerialNumber = "";
            values.typeOfWarrantyCoverage = "";
            setQrVisible(true);
          }
        }
      },
    });

  const modalClose = () => {
    setStart(false);
    Navigate("/ProductList");
  };
  const today = moment(moment.now()).format("DD-MM-YYYY");
  const expDate = (duration) =>
    moment(moment.now()).add(duration, "months").format("DD-MM-YYYY");
  return (
    <Grid sx={{ width: "100%", padding: "20px" }}>
      {start && (
        <TransactionModal
          response={responseState}
          modalClose={modalClose}
          buttonText="Go to Product List"
        />
      )}
      {showLoader && (
        <Grid
          sx={{ position: "absolute", left: "50%", top: "50%", zIndex: "100" }}
        >
          <CircularProgress />
        </Grid>
      )}
      <form onSubmit={handleSubmit}>
        <Typography variant="h5">
          {resState ? "Product Details" : "Add Product Detail"}
        </Typography>
        <Grid
          item
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: "20px",
            fontWeight: "700",
          }}
        >
          {QRScannerState ? (
            <QRScanner noRedirect />
          ) : (
            <Link
              variant="subtitle2"
              onClick={() => {
                setQRScannerState(true);
              }}
              sx={{
                padding: "20px",
                border: "1px solid #7e7e7e",
                backgroundColor: "#7e7e7e",
                color: "white",
                borderRadius: "10px",
                textDecoration: "none !important",
              }}
            >
              SCAN THE QR CODE ON YOUR PRODUCT
            </Link>
          )}
        </Grid>
        {QRScannerState && !resState && (
          <Grid
            item
            alignSelf="flex-end"
            sx={{
              paddingTop: "5px",
              color: "black",
              textAlign: "right",
            }}
          >
            <Link
              variant="subtitle2"
              onClick={() => {
                setQRScannerState(false);
              }}
              sx={{
                color: "black",
                textDecoration: "none",
                borderRadius: "10px",
              }}
            >
              Close QR Scanner
            </Link>
          </Grid>
        )}
        {QRScannerState && resState && (
          <>
            <Grid
              sx={{
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "10px 0",
              }}
            >
              <Grid
                container
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid item sx={{ width: "100%" }}>
                  <Grid container sx={{ width: "100%" }} spacing={2}>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        fontWeight: "700",
                        display: "flex",
                        //  justifyContent: "flex-end",
                      }}
                    >
                      Product Name:
                    </Grid>
                    <Grid item xs={6}>
                      {resState.name}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ width: "100%" }} spacing={2}>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        fontWeight: "700",
                        display: "flex",
                        //justifyContent: "flex-end",
                      }}
                    >
                      Product Id :
                    </Grid>
                    <Grid item xs={6}>
                      {resState.productId}
                    </Grid>
                  </Grid>
                  <Grid container sx={{ width: "100%" }} spacing={2}>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        fontWeight: "700",
                        display: "flex",
                        //justifyContent: "flex-end",
                      }}
                    >
                      Product Description :
                    </Grid>
                    <Grid item xs={6}>
                      {resState.description}
                    </Grid>
                  </Grid>
                  <Typography
                    sx={{
                      fontWeight: "700",
                      display: "flex",
                      //justifyContent: "left",
                      padding: "10px 0",
                      fontSize: "20px",
                    }}
                  >
                    Characterstics
                  </Typography>
                  {resState?.attributes?.length &&
                    resState.attributes.map((item) => {
                      return (
                        <Grid container sx={{ width: "100%" }} spacing={2}>
                          <Grid
                            item
                            xs={6}
                            sx={{
                              fontWeight: "700",
                              display: "flex",
                              // justifyContent: "flex-end",
                            }}
                          >
                            {item.trait_type}
                          </Grid>
                          <Grid item xs={6}>
                            {item.value}
                          </Grid>
                        </Grid>
                      );
                    })}
                  <Typography
                    sx={{
                      fontWeight: "700",
                      display: "flex",
                      //justifyContent: "left",
                      padding: "10px 0",
                      fontSize: "20px",
                    }}
                  >
                    Warranty Coverage
                  </Typography>
                  <Grid container sx={{ width: "100%" }} spacing={2}>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        fontWeight: "700",
                        display: "flex",
                        // justifyContent: "flex-end",
                      }}
                    >
                      Date of Purchase :
                    </Grid>
                    <Grid item xs={6}>
                      {today}
                    </Grid>
                  </Grid>

                  {resState?.warranty?.length &&
                    resState.warranty.map((item) => {
                      return (
                        <Grid container sx={{ width: "100%" }} spacing={2}>
                          <Grid
                            item
                            xs={6}
                            sx={{
                              fontWeight: "700",
                              display: "flex",
                              //justifyContent: "flex-end",
                            }}
                          >
                            {item.coverage_type}
                          </Grid>
                          <Grid item xs={6}>
                            {item.duration} months
                          </Grid>
                          <Grid item sx={{ width: "100%" }}>
                            <Grid container sx={{ width: "100%" }} spacing={2}>
                              <Grid
                                item
                                xs={6}
                                sx={{
                                  fontWeight: "700",
                                  display: "flex",
                                  //justifyContent: "flex-end",
                                }}
                              >
                                Date of Expiration for {item.coverage_type}
                              </Grid>
                              <Grid item xs={6}>
                                {expDate(Number(item.duration))}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })}
                </Grid>
              </Grid>

              <Stack spacing={3}>
                <TextField
                  id="locationOfPurchase"
                  fullWidth
                  value={values.locationOfPurchase}
                  type="text"
                  name="locationOfPurchase"
                  autoComplete="off"
                  placeholder="Location Of Purchase"
                  onChange={handleChange}
                  variant="standard"
                  onBlur={handleBlur}
                  error={
                    !!errors.locationOfPurchase && touched.locationOfPurchase
                  }
                  helperText={
                    errors.locationOfPurchase && touched.locationOfPurchase
                      ? errors.locationOfPurchase
                      : ""
                  }
                  label="Enter the Location Of Purchase"
                />
                <TextField
                  id="userEmail"
                  fullWidth
                  value={values.userEmail}
                  type="email"
                  name="userEmail"
                  autoComplete="off"
                  placeholder="Customer Email Id"
                  onChange={handleChange}
                  variant="standard"
                  onBlur={handleBlur}
                  error={!!errors.userEmail && touched.userEmail}
                  helperText={
                    errors.userEmail && touched.userEmail
                      ? errors.userEmail
                      : ""
                  }
                  label="Customer Email Id"
                />
              </Stack>
            </Grid>

            <Grid sx={{ paddingTop: "20px", width: "100%", margin: "auto" }}>
              <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={() => {
                  setButtonClicked(true);
                }}
                style={{ padding: "10px", borderRadius: "25px" }}
              >
                Add Details
              </LoadingButton>
            </Grid>
          </>
        )}
      </form>
    </Grid>
  );
};
export default AddProduct;
