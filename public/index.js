import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import "regenerator-runtime/runtime.js";

var table;

// exposing loadData to FileMaker Script
window.loadData = function (json) {
  var obj = JSON.parse(json); // data from FM is a string
  var data = obj.data;

  // create column headers from data
  var firstRecord = data[0];
  var columns = Object.keys(firstRecord.fieldData).map(function (key) {
    console.log("key", key);
    var field = firstRecord[key];
    var visible = true;
    if (key === "Id") visible = false;
    return {
      title: key,
      data: "fieldData." + key,
      visible: visible,
    };
  });

  // Create the DataTable, after destroying it if already exists
  if (table) table.destroy();
  table = $("#example").DataTable({
    paging: true,
    searching: true,
    scrollY: "536",
    colReorder: true,
    columns: columns,
    data: data,
    pageLength: 12,
  });

  // Add the click handler to the row, after removing it if already exists
  $("#example tbody").off("dblclick");
  $("#example tbody").on("dblclick", "tr", function () {
    var record = table.row(this).data();
    var json = JSON.stringify(record);

    FileMaker.PerformScript("On Double Click Row", json);
  });
};
