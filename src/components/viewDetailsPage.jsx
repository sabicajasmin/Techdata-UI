import React, { useState, useEffect } from 'react';
import { TextField, Box, InputAdornment } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from "react-router-dom";

const ViewDetailsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [userData, setUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const navigate = useNavigate();

  const API_GET_ALL = process.env.REACT_APP_GET_ALL_CUSTOMER_DATA_API_ENDPOINT;
  const API_GET_BY_MOBILE = process.env.REACT_APP_GET_CUSTOMER_DATA_BY_PHONE_NUMBER;

  console.log("API_GET_ALL:", process.env.REACT_APP_GET_ALL_CUSTOMER_DATA_API_ENDPOINT);
  console.log("API_GET_BY_MOBILE:", process.env.REACT_APP_GET_CUSTOMER_DATA_BY_PHONE_NUMBER);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_GET_ALL);
        const text = await response.text();

        try {
          const data = JSON.parse(text);
          setUserData(data);
          setFilteredData(data);
        } catch (jsonError) {
          console.error("API returned non-JSON response:", text);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [API_GET_ALL]);

  const handleSearchInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      try {
        const response = await fetch(`${API_GET_BY_MOBILE}/${value}`);
        if (!response.ok) throw new Error('Failed to fetch filtered data');

        const data = await response.json();
        setFilteredData(Array.isArray(data) ? data : [data]);
      } catch (error) {
        console.error(error.message);
        setFilteredData([]);
      }
    } else {
      setFilteredData(userData);
    }
  };
  const handleNavigate = () => {
    navigate(-1);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'date', headerName: 'Date / تاريخ', width: 150 },
    { field: 'technicianName', headerName: 'Technician Name / اسم الفني', width: 200 },
    { field: 'customerName', headerName: 'Customer Name / اسم العميل', width: 200 },
    // { field: 'amount', headerName: 'Amount / مبلغ', width: 120 },
    { field: 'mobileNumber', headerName: 'Mobile Number / رقم الجوال', width: 180 },
    { field: 'address', headerName: 'Address / عنوان', width: 250 },
    { field: 'description', headerName: 'Description / وصف', width: 250 },
  ];

  return (
    <Box sx={styles.container}>
      <Box sx={styles.searchContainer}>
        <TextField
          label="Search / يبحث"
          value={searchTerm}
          onChange={handleSearchInputChange}
          sx={styles.input}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon sx={styles.icon} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={styles.dataGridContainer}>
        <DataGrid
          rows={filteredData.map((item, index) => ({ id: index + 1, ...item }))}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          sx={styles.dataGrid}
        />
      </Box>
      <button onClick={handleNavigate} style={styles.backButton}>Back</button>
    </Box>
  );
};

const styles = {

  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f0f4f9',
    height: '100vh',
    width: '100%',
  },
  backButton: {
    margin: '30px',
    border: 'none',
    background: 'gray',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '100px',
},
  searchContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '20px',
    width: '100%',
    maxWidth: '600px',
  },
  input: {
    flex: 1,
  },
  dataGridContainer: {
    width: '100%',
    height: '500px', // ✅ Fix for Data Grid height
    minHeight: '500px',
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.1)',
  },
  dataGrid: {
    height: '100%',
  },
};

export default ViewDetailsPage;
