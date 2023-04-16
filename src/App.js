import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import "./App.css";
function App() {
  const [numPages, setNumPages] = useState(null);
  const [url, setUrl] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [file, setFile] = useState();
  console.log(process.env);
  const getFileData = () => {
    fetch(process.env.REACT_APP_SERVER_ADDRESS + "/getPdfData?fileUrl=" + url)
      .then((res) => res.blob())
      .then((base64) => setFile(base64));
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  function changePage(offSet) {
    setPageNumber((prevPageNumber) => prevPageNumber + offSet);
  }

  function changePageBack() {
    changePage(-1);
  }

  function changePageNext() {
    changePage(+1);
  }

  function handleChange(e) {
    console.log(e);
    setUrl(e.target.value);
  }

  function handleClick(e) {
    getFileData();
  }

  function handleDownload() {
    if (!file) return;
    const pdfBlob = new Blob([file], { type: "application/pdf" });
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "test.pdf";
    link.click();
  }

  return (
    <div className="App">
      <div style={{ marginTop: 20 }}>
        <input style={{ margin: 10 }} type="text" onChange={handleChange} />
        <button onClick={handleClick}>Get File</button>
        <button onClick={handleDownload}>Download PDF</button>
      </div>
      {file ? (
        <header className="App-header">
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page height="600" pageNumber={pageNumber} />
          </Document>
          <p>
            {" "}
            Page {pageNumber} of {numPages}
          </p>
          {pageNumber > 1 && (
            <button onClick={changePageBack}>Previous Page</button>
          )}
          {pageNumber < numPages && (
            <button onClick={changePageNext}>Next Page</button>
          )}
        </header>
      ) : (
        <></>
      )}
    </div>
  );
}

export default App;
