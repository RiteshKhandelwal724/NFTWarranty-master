import "../App.css";
import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { dateFormat, getRequestLoggedIn } from "../functions/apiClient";
import { getProductBCData, productListFromBC } from "../endpoints";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ErrorModal from "./ErrorModal";
import moment from "moment";
import CarouselComp from "./CarouselComp";

const ProductList = () => {
  const [productsArray, setProductsArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [response, setResponse] = useState(false);
  const [prodDetails, setProdDetails] = useState(false);

  useEffect(() => {
    const getDataFun = async () => {
      const res = await getRequestLoggedIn(productListFromBC);
      try {
        if (res?.statusCode === "200") {
          setProductsArray(res?.productList);
          setResponse(res);
        }
      } catch (error) {
        setOpen(true);
      }
    };
    getDataFun();
  }, []);
  const expDateFun = (duration) =>
    moment(moment.now()).add(duration, "months").format("DD-MM-YYYY");

  const [expanded, setExpanded] = useState(false);
  const handleChange = (isExpanded, pane1) => {
    setExpanded(isExpanded ? pane1 : false);
  };

  const today = moment(moment.now()).format("DD-MM-YYYY");
  const noProducts = (
    <Grid
      container
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <Grid item> No Products found</Grid>
      <Grid item>
        <Link
          variant="subtitle2"
          to="/AddProductNew"
          component={RouterLink}
          sx={{ fontSize: "30px", textDecoration: "none" }}
        >
          Click to Add Product
        </Link>
      </Grid>
    </Grid>
  );
  return (
    <Grid>
      <ErrorModal
        open={open}
        setOpen={setOpen}
        errorText="No Producs found... !!!"
      />
      <Typography
        variant="h5"
        gutterBottom
        color="black"
        sx={{ fontWeight: "bold", padding: "15px 0 0 15px" }}
      >
        {productsArray.length > 0
          ? "Here is the List of your Products"
          : noProducts}
      </Typography>
      {productsArray.map((productDetails, index) => {
        const expDateRaw = productDetails?.warrantyPeriod;
        const expDate = dateFormat(expDateRaw);
        const dateOfPurchaseRaw = productDetails?.dateOfPurchase;
        const manufacturingDate = dateFormat(dateOfPurchaseRaw);
        const b = moment(today, "DD-MM-YYYY");
        const a = moment(expDate, "DD-MM-YYYY");
        //Difference in number of days
        const years = a.diff(b, "year");
        b.add(years, "years");
        const months = a.diff(b, "months");
        b.add(months, "months");
        const days = a.diff(b, "days");
        const yearsDate = years
          ? years < 0
            ? -1 * years + " years "
            : years + " years "
          : "";
        const monthsDate = months
          ? months < 0
            ? -1 * months + " months "
            : months + " months "
          : "";
        const daysDate = days
          ? days < 0
            ? -1 * days + " days"
            : days + " days"
          : "";
        const duration = yearsDate + monthsDate + daysDate;

        //Difference in number of weeks
        const fetchProductDetails = async (tokenId) => {
          const res = await getRequestLoggedIn(getProductBCData(tokenId));
          console.log(res, "res");
          setProdDetails(res?.data);
        };
        const warrantyMockObj = [
          { coverage_type: "Hardware", duration: "6" },
          { coverage_type: "Software", duration: "12" },
        ];

        return (
          <Accordion
            expanded={expanded === `panel-${index}`}
            onChange={(event, isExpanded) =>
              handleChange(isExpanded, `panel-${index}`)
            }
          >
            <AccordionSummary
              id={`panel-${index}-header`}
              aria-controls={`panel-${index}-content`}
              expandIcon={<ExpandMore />}
              onClick={() => {
                fetchProductDetails(productDetails.productDetails?.tokenId);
              }}
            >
              {productDetails.productDetails?.productId}
            </AccordionSummary>
            <AccordionDetails>
              <Grid>
                {prodDetails?.image && prodDetails?.image.length > 0 && (
                  <CarouselComp
                    imageFile={prodDetails?.image}
                    showDeleteButton={false}
                  />
                )}

                <Grid
                  container
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "15px",
                    backgroundColor: "#f5f5f5",
                    marginX: "auto",
                    width: "93vw",
                  }}
                  spacing={1}
                >
                  <Grid item>
                    <Grid
                      container
                      sx={{ display: "flex", flexDirection: "row" }}
                      spacing={1}
                    >
                      <Grid item xs={6}>
                        <strong>Product Serial Number</strong>
                      </Grid>
                      <Grid item xs={1} />

                      <Grid
                        item
                        xs={5}
                        sx={{ maxWidth: "300px", wordBreak: "break-word" }}
                      >
                        {prodDetails?.product}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container display="flex" flexDirection="row">
                      <Grid item xs={6}>
                        <strong> Customer Email Id</strong>
                      </Grid>
                      <Grid item xs={1} />

                      <Grid item xs={5} sx={{ wordWrap: "break-word" }}>
                        rkk@gmail.com
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Grid item>
                    <Grid container display="flex" flexDirection="row">
                      <Grid item xs={6}>
                        <strong> Date of Purchase</strong>
                      </Grid>

                      <Grid item xs={1} />
                      <Grid item xs={5}>
                        {"today"}
                      </Grid>
                    </Grid>
                  </Grid> */}
                  <Grid item>
                    <Grid container display="flex" flexDirection="row">
                      <Grid item xs={6}>
                        <strong> Location of Purchase</strong>
                      </Grid>

                      <Grid item xs={1} />

                      <Grid item xs={5}>
                        Hyderabad
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <Grid container display="flex" flexDirection="row">
                      <Grid item xs={6}>
                        <strong> Date of Purchase</strong>
                      </Grid>

                      <Grid item xs={1} />
                      <Grid item xs={5}>
                        {today}
                      </Grid>
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
                    Warranty Coverage
                  </Typography>
                  {
                    // prodDetails?.warranty?.length &&
                    // prodDetails?.warranty.map((item) => {
                    warrantyMockObj.map((item) => {
                      return (
                        <Grid item>
                          <Grid item sx={{ width: "100%" }}>
                            <Grid container sx={{ width: "100%" }} spacing={1}>
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
                              <Grid item xs={1} />
                              <Grid item xs={5}>
                                {item.duration} months
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item sx={{ width: "100%" }}>
                            <Grid container sx={{ width: "100%" }} spacing={1}>
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
                              <Grid item xs={1} />
                              <Grid item xs={5}>
                                {expDateFun(Number(item.duration))}
                              </Grid>
                            </Grid>
                          </Grid>
                        </Grid>
                      );
                    })
                  }
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Grid>
  );
};
export default ProductList;
