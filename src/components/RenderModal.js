import { Grid } from "@mui/material";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addUserProduct } from "../endpoints";
import { postRequestLoggedIn } from "../functions/apiClient";
import { prodData } from "../store";
import ErrorModal from "./ErrorModal";
import ExtendedWarrantyBenefitsModal from "./ExtendedWarrantyBenefitsModal";
import SuccessModal from "./SuccessModal";
const RenderModal = ({ open, setOpen }) => {
  const [productData] = useAtom(prodData);
  const [successModal, setSuccessModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);

  const onClickHandler2 = async () => {
    try {
      const res = await postRequestLoggedIn(addUserProduct, {
        productId: productData.productSerialNumber,
      });
      if (res?.status_code === "200") {
        setSuccessModal(true);
      } else setErrorModal(true);
    } catch (error) {
      setErrorModal(true);
    }
  };
  const Navigate = useNavigate();

  return (
    <Grid>
      <ErrorModal open={errorModal} setOpen={setErrorModal} />
      <SuccessModal
        open={successModal}
        handleClose={() => {
          Navigate("/RegisteredProducts");
        }}
        message="Warranty Activation is Successful"
        subMessage="Please reach out for any assistance"
        secondButtonText="Close"
      />
      <ExtendedWarrantyBenefitsModal
        open={open}
        setOpen={setOpen}
        onClickHandler={onClickHandler2}
      />
    </Grid>
  );
};
export default RenderModal;
