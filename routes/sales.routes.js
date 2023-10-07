const express = require("express");
const Order = require("../models/order.models");
const auth = require("../middleware/auth");
const router = express.Router();

// Get daily sales for all products
router.get("/sales/daily/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
  
      const dailySales = await Order.aggregate([
        {
          $match: {
            date: {
              $gte: startOfDay,
              $lte: endOfDay,
            },
          },
        },
      ]);
  
      // Initialize an empty productSales object
      const productSales = {};
  
      dailySales.forEach((order) => {
        order.orders.forEach((product) => {
          const { name, quantity, price } = product;
  
          if (!productSales[name]) {
            productSales[name] = {
              totalQuantitySold: 0,
              totalAmountEarned: 0,
            };
          }
  
          productSales[name].totalQuantitySold += quantity;
          productSales[name].totalAmountEarned += quantity * price;
        });
      });
  
      // Convert productSales object into an array for easier processing in the frontend
      const dailySalesArray = Object.entries(productSales).map(([productName, productData]) => ({
        name: productName,
        totalQuantitySold: productData.totalQuantitySold,
        totalAmountEarned: productData.totalAmountEarned,
      }));
  
      res.json(dailySalesArray);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get monthly sales for all products
router.get("/sales/monthly/:year/:month", async (req, res) => {
    try {
      const { year, month } = req.params;
      const startOfMonth = new Date(year, month - 1, 1); // Month is 0-based index in JavaScript
      const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999);
  
      const monthlySales = await Order.aggregate([
        {
          $match: {
            date: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
      ]);
  
      // Initialize an empty productSales object
      const productSales = {};
  
      monthlySales.forEach((order) => {
        order.orders.forEach((product) => {
          const { name, quantity, price } = product;
  
          if (!productSales[name]) {
            productSales[name] = {
              totalQuantitySold: 0,
              totalAmountEarned: 0,
            };
          }
  
          productSales[name].totalQuantitySold += quantity;
          productSales[name].totalAmountEarned += quantity * price;
        });
      });
  
      // Convert productSales object into an array for easier processing in the frontend
      const monthlySalesArray = Object.entries(productSales).map(([productName, productData]) => ({
        name: productName,
        totalQuantitySold: productData.totalQuantitySold,
        totalAmountEarned: productData.totalAmountEarned,
      }));
  
      res.json(monthlySalesArray);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  
  // Get yearly sales for all products
router.get("/sales/yearly/:year", async (req, res) => {
    try {
      const { year } = req.params;
      const startOfYear = new Date(year, 0, 1); // January 1st of the specified year
      const endOfYear = new Date(year, 11, 31, 23, 59, 59, 999); // December 31st of the specified year
  
      const yearlySales = await Order.aggregate([
        {
          $match: {
            date: {
              $gte: startOfYear,
              $lte: endOfYear,
            },
          },
        },
      ]);
  
      // Initialize an empty productSales object
      const productSales = {};
  
      yearlySales.forEach((order) => {
        order.orders.forEach((product) => {
          const { name, quantity, price } = product;
  
          if (!productSales[name]) {
            productSales[name] = {
              totalQuantitySold: 0,
              totalAmountEarned: 0,
            };
          }
  
          productSales[name].totalQuantitySold += quantity;
          productSales[name].totalAmountEarned += quantity * price;
        });
      });
  
      // Convert productSales object into an array for easier processing in the frontend
      const yearlySalesArray = Object.entries(productSales).map(([productName, productData]) => ({
        name: productName,
        totalQuantitySold: productData.totalQuantitySold,
        totalAmountEarned: productData.totalAmountEarned,
      }));
  
      res.json(yearlySalesArray);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

//   router.get('/sales/generate-report', (req, res) => {
//     try {
//       // Sample sales data (replace this with your actual data)
//       const salesData = [
//         { date: '2023-10-01', product: 'Product A', quantity: 50, revenue: 1000 },
//         // Add more sales data here...
//       ];
  
//       // Create a new PDF document
//       const doc = new PDFDocument();
      
//       // Set the filename for the downloadable report
//       const reportFileName = 'monthly_sales_report.pdf';
  
//       // Set the response headers for the PDF attachment
//       res.setHeader('Content-Type', 'application/pdf');
//       res.setHeader('Content-Disposition', `attachment; filename="${reportFileName}"`);
  
//       // Pipe the PDF content to the response
//       doc.pipe(res);
  
//       // Add content to the PDF
//       doc.fontSize(24).text('Monthly Sales Report', { align: 'center' });
//       doc.moveDown();
//       doc.fontSize(16).text('October 2023', { align: 'center' });
//       doc.moveDown();
      
//       // Table header
//       doc.font('Helvetica-Bold').text('Date', 100, doc.y, { continued: true });
//       doc.text('Product', 200, doc.y, { continued: true });
//       doc.text('Quantity Sold', 350, doc.y, { continued: true });
//       doc.text('Revenue', 450, doc.y);
      
//       doc.font('Helvetica').moveDown();
      
//       // Table content
//       salesData.forEach((item) => {
//         doc.text(item.date, 100, doc.y, { continued: true });
//         doc.text(item.product, 200, doc.y, { continued: true });
//         doc.text(item.quantity.toString(), 350, doc.y, { continued: true });
//         doc.text('$' + item.revenue.toFixed(2), 450, doc.y);
//         doc.moveDown();
//       });
      
//       // End the PDF
//       doc.end();
//     } catch (error) {
//       console.error('Error generating report:', error);
//       res.status(500).send('Error generating report');
//     }
//   });
  
  
  module.exports = router;
  