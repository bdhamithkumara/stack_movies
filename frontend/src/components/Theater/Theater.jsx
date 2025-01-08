// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import Typography from '@mui/material/Typography';
// import CardMedia from '@mui/material/CardMedia';
// import Grid from '@mui/material/Grid';
// import { useState, useEffect } from 'react';
// import { getAllTheatres, updateTheatre, deleteTheatre } from '../../api/Theater_api/Theater.js';
// import { useNavigate } from 'react-router-dom';

// function Theater() {
//   const [theatres, setTheatres] = useState([]);
//   const [editTheatre, setEditTheatre] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   const userType = localStorage.getItem("userType") || "undefined";
//   const navigate = useNavigate();

//   useEffect(() => {

//     // Get all theaters
//     const fetchTheatres = async () => {
//       try {
//         const data = await getAllTheatres();
//         setTheatres(data);
//       } catch (error) {
//         console.error('Error fetching theatres:', error);
//       }
//     };
//     fetchTheatres();
//   }, []);

//   // Edit Theater Information
//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     setEditTheatre({
//       ...editTheatre,
//       [name]: value,
//     });
//   };

//   // Update Theater
//   const handleUpdateTheatre = async (e) => {
//     e.preventDefault();
//     try {
//       console.log('Updating theater:', editTheatre);

//       const updatedTheatre = await updateTheatre(editTheatre._id, editTheatre);
//       setTheatres(theatres.map(theatre => theatre._id === editTheatre._id ? updatedTheatre : theatre));
//       setIsEditing(false);
//       setEditTheatre(null);
//     } catch (error) {
//       console.error('Error updating theatre:', error.response.data);
//       alert('Error updating theater: ' + error.response.data.message);
//     }
//   };

//   // Delete Theater
//   const handleDeleteTheatre = async (id, e) => {
//     e.stopPropagation();
//     try {
//       console.log('Deleting theater with ID:', id);
//       const response = await deleteTheatre(id);
//       console.log('Response:', response);

//       setTheatres(theatres.filter(theatre => theatre._id !== id));

//       alert('Theater deleted successfully!');
//     } catch (e) {
//       alert('You are not authorized to delete this theater');
//       console.log('error',e);

//     }
//   };

//   // Cancel To Edit
//   const handleCancelEdit = () => {
//     setIsEditing(false);
//     setEditTheatre(null);
//   };

//   // Move To Particuler Theater
//   const handleTheatreClick = (theatreId) => {
//     navigate(`/theater/${theatreId}/movies`);
//   };

//   const handleEditClick = (theatre, e) => {
//     e.stopPropagation();
//     setIsEditing(true);
//     setEditTheatre(theatre);
//   };

//   const inputStyles = {
//     mb: 2,
//     '& .MuiInputBase-input': {
//       color: 'white',
//     },
//     '& .MuiFormLabel-root': {
//       color: 'white',
//     },
//     '& .MuiInput-underline:before': {
//       borderBottom: '1px solid white',
//     },
//     '& .MuiInput-underline:after': {
//       borderBottom: '2px solid white',
//     },
//   };

//   return (
//     <Box p={2}>
//       <Typography variant="h4" color="white" gutterBottom>Theaters</Typography>
//       <Grid container spacing={2}>
//         {theatres.map(theatre => (
//           <Grid item xs={12} sm={6} md={4} key={theatre._id}>
//             <Card sx={{ backgroundColor: '#333', color: 'white' }} onClick={() => handleTheatreClick(theatre._id)} >
//               <CardMedia
//                 component="img"
//                 height="140"
//                 image={theatre.image}
//                 alt={theatre.name}
//               />

//               <CardContent>
//                 <Typography variant="h6">{theatre.name}</Typography>
//                 <Typography variant="body2">City: {theatre.city}</Typography>
//                 <Typography variant="body2">Ticket Price: {theatre.ticketPrice}</Typography>
//                 <Typography variant="body2">Seats: {theatre.seats}</Typography>
//                 {userType === 'Admin' &&(
//                   <>
//                     <Button variant="contained" color="primary" onClick={(e) => handleEditClick(theatre, e)}>Edit</Button>
//                     <Button variant="contained" color="error" onClick={(e) => handleDeleteTheatre(theatre._id, e)} sx={{ ml: 1 }}>Delete</Button>
//                   </>
//                 )}
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>
//       {isEditing && userType === 'Admin' && (
//         <Box component="form" onSubmit={handleUpdateTheatre} sx={{ mt: 4 }}>
//         <TextField
//       margin="dense"
//       name="name"
//       label="Name"
//       type="text"
//       style={{ width: '100%' }}
//       variant="standard"
//       value={editTheatre.name}
//       onChange={handleEditChange}
//       sx={inputStyles}
//     />
//     <TextField
//       margin="dense"
//       name="city"
//       label="City"
//       type="text"
//       style={{ width: '100%' }}
//       variant="standard"
//       value={editTheatre.city}
//       onChange={handleEditChange}
//       sx={inputStyles}
//     />
//     <TextField
//       margin="dense"
//       name="ticketPrice"
//       label="Ticket Price"
//       type="text"
//       style={{ width: '100%' }}
//       variant="standard"
//       value={editTheatre.ticketPrice}
//       onChange={handleEditChange}
//       sx={inputStyles}
//     />
//     <TextField
//       margin="dense"
//       name="seats"
//       label="Seats"
//       type="text"
//       style={{ width: '100%' }}
//       variant="standard"
//       value={editTheatre.seats}
//       onChange={handleEditChange}
//       sx={inputStyles}
//     />
//           <Box display="flex" justifyContent="space-between">
//             <Button type="submit" variant="contained" color="primary">Save</Button>
//             <Button variant="contained" color="secondary" onClick={handleCancelEdit}>Cancel</Button>
//           </Box>
//         </Box>
//       )}
//     </Box>
//   );
// }

// export default Theater;

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';
import EditIcon from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import {
  getAllTheatres,
  updateTheatre,
  deleteTheatre,
} from '../../api/Theater_api/Theater.js';
import { useNavigate } from 'react-router-dom';

function Theater() {
  const [theatres, setTheatres] = useState([]);
  const [editTheatre, setEditTheatre] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const userType = localStorage.getItem('userType') || 'undefined';
  const adminId = localStorage.getItem('adminId') || ''; // Fetch the logged-in user's ID
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all theaters
    const fetchTheatres = async () => {
      try {
        const data = await getAllTheatres();
        setTheatres(data);
      } catch (error) {
        console.error('Error fetching theatres:', error);
      }
    };
    fetchTheatres();
  }, []);

  // Edit Theater Information
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditTheatre({
      ...editTheatre,
      [name]: value,
    });
  };

  // Update Theater
  const handleUpdateTheatre = async (e) => {
    e.preventDefault();
    try {
      const updatedTheatre = await updateTheatre(editTheatre._id, editTheatre);
      setTheatres(
        theatres.map((theatre) =>
          theatre._id === editTheatre._id ? updatedTheatre : theatre
        )
      );
      setIsEditing(false);
      setEditTheatre(null);
    } catch (error) {
      console.error('Error updating theatre:', error.response.data);
      alert('Error updating theater: ' + error.response.data.message);
    }
  };

  // Delete Theater
  const handleDeleteTheatre = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteTheatre(id);
      setTheatres(theatres.filter((theatre) => theatre._id !== id));
      alert('Theater deleted successfully!');
    } catch (error) {
      alert('You are not authorized to delete this theater');
      console.log('Error:', error);
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTheatre(null);
  };

  // Move to particular theater
  const handleTheatreClick = (theatreId) => {
    navigate(`/theater/${theatreId}/movies`);
  };

  const handleEditClick = (theatre, e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTheatre(theatre);
  };

  const inputStyles = {
    mb: 2,
    '& .MuiInputBase-input': {
      color: 'white',
    },
    '& .MuiFormLabel-root': {
      color: 'white',
    },
    '& .MuiInput-underline:before': {
      borderBottom: '1px solid white',
    },
    '& .MuiInput-underline:after': {
      borderBottom: '2px solid white',
    },
  };

  return (
    <Box p={2}>
      <Typography variant="h4" color="white" gutterBottom>
        Theaters
      </Typography>
      <Grid container spacing={2}>
        {theatres.map((theatre) => (
          <Grid item xs={12} sm={6} md={4} key={theatre._id}>
            <Card
              sx={{
                backgroundColor: '#333',
                color: 'white',
                cursor: 'pointer',
                borderRadius: 2,
                boxShadow: 3,
                margin: 2,
              }}
              onClick={() => handleTheatreClick(theatre._id)}
            >
              <CardMedia
                component="img"
                height="200"
                image={theatre.image}
                alt={theatre.name}
                sx={{
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                  filter: 'brightness(70%)',
                }}
              />

              <CardContent sx={{ fontWeight: 800, position: 'relative' }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                    paddingBottom: 1,
                  }}
                >
                  {theatre.name}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: '1rem',
                    paddingBottom: 1,
                  }}
                >
                  City:
                  <Box
                    variant="body2"
                    sx={{
                      color: '#90A4AE',
                      display: 'inline',
                      marginLeft: 1,
                    }}
                  >
                    {theatre.city}
                  </Box>
                </Typography>
                {/* <Typography variant="body2">
                  Ticket Price: {theatre.ticketPrice}
                </Typography> */}
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'medium',
                    fontSize: '1.2rem',
                    paddingBottom: 1,
                  }}
                >
                  Ticket Price:
                  <Box
                    variant="body2"
                    sx={{
                      color: '#90A4AE',
                      display: 'inline',
                      marginLeft: 1,
                    }}
                  >
                    &#8377; {theatre.ticketPrice}
                  </Box>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '1.2rem',
                  }}
                >
                  Seats:
                  <Box
                    variant="body2"
                    sx={{
                      color: '#90A4AE',
                      display: 'inline',
                      marginLeft: 1,
                    }}
                  >
                    {theatre.seats}
                  </Box>
                </Typography>
                {userType === 'Admin' &&
                  adminId === theatre.admin && ( // Only show if user is admin of this theater
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 2,
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleEditClick(theatre, e)}
                        sx={{
                          borderRadius: '25px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          padding: '8px 15px',
                          '&:hover': { transform: 'scale(1.1)' },
                        }}
                        startIcon={<EditIcon />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={(e) => handleDeleteTheatre(theatre._id, e)}
                        sx={{
                          borderRadius: '25px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          padding: '8px 15px',
                          '&:hover': { transform: 'scale(1.1)' },
                        }}
                        startIcon={<Delete />}
                      >
                        Delete
                      </Button>
                    </Box>
                  )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isEditing && userType === 'Admin' && adminId === editTheatre.admin && (
        <Box component="form" onSubmit={handleUpdateTheatre} sx={{ mt: 4 }}>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            value={editTheatre.name}
            onChange={handleEditChange}
            sx={inputStyles}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            value={editTheatre.city}
            onChange={handleEditChange}
            sx={inputStyles}
          />
          <TextField
            margin="dense"
            name="ticketPrice"
            label="Ticket Price"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            value={editTheatre.ticketPrice}
            onChange={handleEditChange}
            sx={inputStyles}
          />
          <TextField
            margin="dense"
            name="seats"
            label="Seats"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            value={editTheatre.seats}
            onChange={handleEditChange}
            sx={inputStyles}
          />
          <Box display="flex" justifyContent="space-between">
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Theater;
