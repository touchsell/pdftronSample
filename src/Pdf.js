import WebViewer from "@pdftron/webviewer";
import React, { useEffect, useRef, useState } from "react";

const PDFTRON_WEBVIEWER_OPTIONS = {
  licenseKey:
    "The App Lab SAS(touch-sell.com):OEM:Touch & Sell::B+:AMS(20211107):" +
    "77B5256304E7B60AB360B13AC982737860615F4CD7061A0395DD8E435CA55E37128A31F5C7",
  path: "/wv",
  fullAPI: true,
  preloadWorker: "all",
};

const smallPdf =
  "https://usercontent.touch-sell.net/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0NMTXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--523a6a93e197bba42f4e3107f73ab33dd1cb7e1c/blob-eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBK0NMTXc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--523a6a93e197bba42f4e3107f73ab33dd1cb7e1c.pdf";

const bigPdf =
  "https://bo.touch-sell.net/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNDdvTUE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--92b62f2c28069334bdc6ab1aedb439812b94a635/Pathfinder.optimized.pdf";

const mediumPdf = "../static/files/100page.pdf";

export const Pdf = () => {
  const viewer = useRef(null);

  const [instance, setInstance] = useState();

  useEffect(() => {
    WebViewer(PDFTRON_WEBVIEWER_OPTIONS, viewer.current).then((instance) => {
      setInstance(instance);
    });
  }, []);

  return (
    <>
      <select
        onChange={(event) => {
          instance.loadDocument(event.target.value);
          instance.setLayoutMode(instance.LayoutMode.Single);
          instance.setSwipeOrientation("horizontal");
          instance.docViewer.setMargin(0);
          instance.docViewer.setEnableAutomaticLinking(false);
        }}
      >
        <option value={smallPdf}>Small pdf</option>
        <option value={mediumPdf}>Medium pdf</option>
        <option value={bigPdf}>Big pdf</option>
      </select>
      <div
        style={{ width: "100vw", height: "100vh" }}
        data-cy="pdfViewer"
        ref={viewer}
      ></div>
    </>
  );
};
