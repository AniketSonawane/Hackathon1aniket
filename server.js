// Import required modules
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create an Express app
const app = express();

// Proxy API requests to ServiceNow
app.use('/api', createProxyMiddleware({
  target: 'https://dev81897.service-now.com/api/now/table/u_compliance?sysparm_display_value=true&sysparm_exclude_reference_link=true&sysparm_fields=u_ci_name%2Cu_ci_name.install_status%2Cu_ci_name.sys_class_name%2Cu_compliance_filter%2Cu_aging%2Cu_active&u_active=true',
  
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api/now/table/u_compliance',
  },
}));

// Serve your static files (assuming your HTML, CSS, and JS are in the 'public' folder)
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
