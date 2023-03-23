import { Grid } from "@mui/material";
import React from "react";
import QrReader from "react-qr-scanner";
import { useAtom } from "jotai";
import { qrUrl, tokenIdState } from "../store";
import { useNavigate } from "react-router-dom";
import { getProductBCData } from "../endpoints";
import { getRequestLoggedIn } from "../functions/apiClient";

const QRScanner = ({ noRedirect }) => {
  const [qRUrl, setQRUrl] = useAtom(qrUrl);
  const [tokenId, setToken] = useAtom(tokenIdState);
  const delay = 300;
  const Navigate = useNavigate();

  const handleScan = (data) => {
    if (!qRUrl) {
      setQRUrl(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  const previewStyle = {
    height: 240,
    width: 320,
  };
  const fetchTokenId = (text) => {
    if (!text) return;
    else {
      const textArray = text.split("/");
      if (textArray.length) {
        const tokenId = textArray[textArray.length - 1];
        setToken(tokenId);
      }
    }
  };
  return (
    <div>
      {!qRUrl?.text && (
        <QrReader
          constraints={{ video: { facingMode: "environment" } }}
          Media
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
      )}
      {noRedirect
        ? fetchTokenId(qRUrl?.text)
        : qRUrl?.text && (window.location.href = qRUrl?.text)}
    </div>
  );
};

export default QRScanner;
