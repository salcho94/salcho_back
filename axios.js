async function getDataSet() {
    const dataSet = await axios({
      method: "get", // http method
      url: url + `/update?coment=${$('#coment').val()}&hidden=${$('#hidden').val()}`,
      //url: serverUrl + `/dummy`,
      headers: {}, // packet header
      data: {}, // packet body
    });
    console.log(dataSet);
    
    return dataSet.data.result;
  }