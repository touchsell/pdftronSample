import WebViewer from "@pdftron/webviewer";
import { saveAs } from "file-saver";
import { useCallback, useEffect, useRef, useState } from "react";
import { licenseKey } from "./Config";
import { dateDiff } from "./PdftronXfdf";

const docUrl = "/files/form.pdf";

export const PdftronExport = () => {
  const viewer = useRef(null);
  const [instance, setInstance] = useState(undefined);

  const exportAnnotedDoc = useCallback(async () => {
    if (!instance) return undefined;

    const doc = await instance.CoreControls.createDocument(docUrl, {
      xodOptions: { azureWorkaround: true },
    });

    const { docViewer } = instance;
    const annotManager = docViewer.getAnnotationManager();
    const xfdfString = await annotManager.exportAnnotations({
      annotList: annotManager.getAnnotationsList(),
      widgets: false,
      links: false,
      fields: true,
    });
    const fileData = await doc.getFileData({ xfdfString });
    const arr = new Uint8Array(fileData);
    const fileToExport = new File([arr], "exportedDoc.pdf", {
      type: "application/pdf",
    });
    saveAs(fileToExport);
  }, [instance]);

  useEffect(() => {
    const startedAt = new Date();
    console.log("document is loading", startedAt);
    WebViewer(
      {
        path: "/wv",
        initialDoc: docUrl,
        licenseKey,
        fullAPI: true,
        preloadWorker: "all",
      },
      viewer.current
    ).then((docInstance) => {
      setInstance(docInstance);
      docInstance.docViewer.one("documentLoaded", () => {
        console.log(
          "document is LOADED, elapsed " +
            dateDiff(new Date(), startedAt) +
            " secondes"
        );
      });
    });
  }, []);

  return (
    <div className="MyComponent">
      <button onClick={exportAnnotedDoc}>EXPORT DOCUMENT</button>
      <div className="webviewer" ref={viewer} style={{ height: "100vh" }}></div>
    </div>
  );
};
