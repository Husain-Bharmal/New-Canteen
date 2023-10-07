import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Report.css";

const Report = () => {
  const [reportType, setReportType] = useState("Month"); // Default to monthly
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [selectedDailyDate, setSelectedDailyDate] = useState(new Date());
  const [salesData, setSalesData] = useState([]);
  const [dataAvailable, setDataAvailable] = useState(true);

  const fetchSalesData = useCallback(async () => {
    try {
      let response;

      if (reportType === "Month") {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        response = await axios.get(`/sales/monthly/${year}/${month}`);
      } else if (reportType === "Year") {
        const year = selectedYear.getFullYear();
        response = await axios.get(`/sales/yearly/${year}`);
      } else if (reportType === "Day") {
        const year = selectedDailyDate.getFullYear();
        const month = selectedDailyDate.getMonth() + 1;
        const day = selectedDailyDate.getDate();
        response = await axios.get(`/sales/daily/${year}-${month}-${day}`);
      }

      if (response.data.length === 0) {
        setDataAvailable(false); // No sales data available
      } else {
        setDataAvailable(true); // Sales data is available
      }

      setSalesData(response.data);
    } catch (error) {
      console.error(error);
      setDataAvailable(false);
    }
  }, [reportType, selectedDate, selectedYear, selectedDailyDate]);

  useEffect(() => {
    fetchSalesData();
  }, [fetchSalesData]);

  const handleReportTypeChange = (type) => {
    setReportType(type);
    // If the report type is "daily," fetch the data immediately
    if (type === "Day") {
      fetchSalesData();
    } else if (type === "Month") {
      fetchSalesData();
    } else if (type === "Year") {
      fetchSalesData();
    }
  };

//   const handleDownloadReport = async () => {
//     try {
//       // Depending on your application logic, you can generate the report here
//       // For this example, let's assume you're sending a request to a server endpoint
//       const response = await axios.get(`/sales/generate-report`, {
//         responseType: 'blob', // Specify the response type as a blob for binary data
//       });
  
//       // Create a blob URL for the report data
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
  
//       // Create a link element for downloading the report
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'sales_report.pdf'); // Set the desired file name
  
//       // Simulate a click on the link to trigger the download
//       link.click();
//     } catch (error) {
//       console.error('Error downloading report:', error);
//     }
//   };

  return (
    <div>
      <h2>Sales Report</h2>
      <div>
        <button
          className={reportType === "Month" ? "active" : ""}
          onClick={() => handleReportTypeChange("Month")}
        >
          Month
        </button>
        <button
          className={reportType === "Year" ? "active" : ""}
          onClick={() => handleReportTypeChange("Year")}
        >
          Year
        </button>
        <button
          className={reportType === "Day" ? "active" : ""}
          onClick={() => handleReportTypeChange("Day")}
        >
          Day
        </button>
      </div>
      {reportType === "Month" && (
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
        />
      )}
      {reportType === "Year" && (
        <DatePicker
          selected={selectedYear}
          onChange={(date) => {
            const newDate = new Date(date);
            newDate.setMonth(0); // Set the month to January (0-based index)
            setSelectedYear(newDate);
          }}
          dateFormat="yyyy"
          yearDropdownItemNumber={10}
          scrollableYearDropdown
        />
      )}
      {reportType === "Day" && (
        <DatePicker
          selected={selectedDailyDate}
          onChange={(date) => setSelectedDailyDate(date)}
          dateFormat="MM/dd/yyyy"
        />
      )}
      {dataAvailable ? (
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Total Quantity Sold</th>
              <th>Total Amount Earned</th>
            </tr>
          </thead>
          <tbody>
            {salesData.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.totalQuantitySold}</td>
                <td>{product.totalAmountEarned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="noData">
          No sales data available for the selected {reportType}.
        </p>
      )}
      {/* <button className="download-button" onClick={handleDownloadReport}>
        Download Report
      </button> */}
    </div>
  );
};

export default Report;
