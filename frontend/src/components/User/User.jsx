// import { useState, useEffect } from 'react';
// import Box from '@mui/material/Box';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import { Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function User() {
//   const [userData, setUserData] = useState({});
//   const [reservations, setReservations] = useState([]);
//   const [movies, setMovies] = useState([]);
//   const userId = localStorage.getItem('userId');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUserId = localStorage.getItem('userId');
//     if (storedUserId) {
//       // Fetch user profile
//       axios.get(`https://stack-movies4-20.onrender.com/api/users/profile/${storedUserId}`)
//         .then(response => {
//           setUserData(response.data);

//           // Fetch user reservations by email
//           axios.get(`https://stack-movies4-20.onrender.com/api/reservations/email/${response.data.email}`)
//             .then(reservationResponse => {
//               setReservations(reservationResponse.data);

//               // Fetch movie details based on movieId from reservations
//               const movieRequests = reservationResponse.data.map(reservation =>
//                 axios.get(`https://stack-movies4-20.onrender.com/api/movies/${reservation.movie}`)
//               );
//               console.log(movieRequests);
//               // Wait for all movie requests to complete
//               Promise.all(movieRequests)
//                 .then(movieResponses => {
//                   const fetchedMovies = movieResponses.map(res => res.data);
//                   console.log(fetchedMovies);
//                   setMovies(fetchedMovies);
//                 })
//                 .catch(error => console.error("Error fetching movies:", error));
//             })
//             .catch(error => console.error(error));
//         })
//         .catch(error => console.error(error));
//     } else {
//       console.error("User ID is not found in localStorage");
//     }
//   }, [userId]);

//   return (
//     <>
//      <div className="admin">
//      <h1 style={{textAlign:'center',marginTop:'2rem'}}>User Dashboard</h1>
//      <Box sx={{ width: '100%', display: 'flex', color: 'white', marginTop:'2rem'}}>
//         {userData && (
//           <Box sx={{ width: '30%', p: 3, textAlign: 'center' }}>
//             <AccountCircleIcon sx={{ fontSize: '10rem', mb: 2 }} />
//             <Typography variant="h6">Name: {userData.name}</Typography>
//             <Typography variant="h6">Email: {userData.email}</Typography>
//             <Typography variant="h6">Phone no.: {userData.phone}</Typography>
//             <Typography variant="h6">Role: {userData.role}</Typography>
//           </Box>
//         )}

//         <Box sx={{ width: '70%', mt: 3 }}>
//           <Typography variant="h5">Booked Movies by {userData.name}</Typography>
//           {reservations.length === 0 ? (
//             <Typography variant="h6">No reservations found.</Typography>
//           ) : (
//             <Grid container spacing={3}>
//               {reservations.map((reservation, index) => (
//                 <Grid item xs={12} sm={6} md={4} key={reservation._id}>
//                   <Card sx={{ backgroundColor: '#333', color: 'white', cursor: 'pointer' }} onClick={() => navigate(`/movie/${reservation.movie}`)}>
//                     <CardMedia
//                       component="img"
//                       height="140"
//                       image={movies[index] ? movies[index].image : ""}
//                       alt={movies[index] ? movies[index].title : "Loading..."}
//                       sx={{ objectFit: 'cover', width: '100%', aspectRatio: '16/9' }}
//                     />
//                     <CardContent>
//                       <Typography variant="h6">{movies[index] ? movies[index].title : "Loading..."}</Typography>
//                       <Typography variant="body2">Theater: {movies[index] ? movies[index].theater.name: "Loading..."}</Typography>
//                       <Typography variant="body2">Date: {new Date(reservation.date).toLocaleDateString()}</Typography>
//                       <Typography variant="body2">startAt: {reservation.startAt}</Typography>
//                       <Typography variant="body2">Seats: {reservation.seats.join(', ')}</Typography>
//                       <Typography variant="body2">Ticket Price: ${reservation.ticketPrice}</Typography>
//                       <Typography variant="body2">Director: {movies[index] ? movies[index].director : "Loading..."}</Typography>
//                       <Typography variant="body2">Genre: {movies[index] ? movies[index].genre : "Loading..."}</Typography>
//                       <Typography variant="body2">Duration: {movies[index] ? movies[index].duration: "Loading..."}</Typography>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </Box>
//       </Box>
//       </div>
//     </>
//   );
// }

// export default User;

import { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  getUserData,
  getReservations,
  getMovie,
  updateUserProfile,
} from '../../api/Profiles_api/Profiles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TextField from '@mui/material/TextField';
import axios from 'axios';
function User() {
  const [userData, setUserData] = useState({});
  const [reservations, setReservations] = useState([]);
  const [movies, setMovies] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      // Fetch user profile
      // axios.get(`https://stack-movies4-20.onrender.com/api/users/profile/${storedUserId}`)
      axios
        .get(`http://localhost:5000/api/users/profile/${storedUserId}`)
        .then((response) => {
          setUserData(response.data);

          setEditData({
            name: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || '',
            password: '',
          });

          // Fetch user reservations by email
          // axios.get(
          //   `https://stack-movies4-20.onrender.com/api/reservations/email/${response.data.email}`
          // )
          // axios
          //   .get(
          //     `https://stack-movies4-20.onrender.com/api/reservations/email/${response.data.email}`
          //   )
          axios
            .get(
              `http://localhost:5000/api/reservations/email/${response.data.email}`
            )
            .then((reservationResponse) => {
              setReservations(reservationResponse.data);
              console.log(reservationResponse.data);
              // Fetch movie details based on movieId from reservations
              const movieRequests = reservationResponse.data.map(
                async (reservation) => {
                  const id = reservation.movie._id;
                  // axios.get(
                  //   `https://stack-movies4-20.onrender.com/api/movies/${id}`
                  // )
                  const val = await axios.get(
                    `http://localhost:5000/api/movies/${id}`
                  );
                  console.log(val);
                  return val;
                }
              );
              console.log(reservations);
              // Wait for all movie requests to complete
              Promise.all(movieRequests)
                .then((movieResponses) => {
                  const fetchedMovies = movieResponses.map((res) => res.data);
                  setMovies(fetchedMovies);
                })
                .catch((error) =>
                  console.error('Error fetching movies:', error)
                );
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));
    } else {
      console.error('User ID is not found in localStorage');
    }
  }, [userId]);

  // useEffect(() => {
  //   const storedUserId = localStorage.getItem('userId');
  //   if (storedUserId) {

  //     // Get User Data
  //     const fetchUserData = async () => {
  //       const data = await getUserData(storedUserId);
  //       setUserData(data);

  //       setEditData({
  //         name: data.name || '',
  //         email: data.email || '',
  //         phone: data.phone || '',
  //         password: ''
  //       });

  //       // Get Reservation
  //       const fetchReservations = async () => {
  //         const reservations = await getReservations(data.email);
  //         setReservations(reservations);

  //         // Get Movie By Reservation Data
  //         const movieRequests = reservations.map((reservation) => getMovie(reservation.movie));
  //         Promise.all(movieRequests)
  //           .then((movieResponses) => {
  //             const fetchedMovies = movieResponses.map((res) => res.data);
  //             setMovies(fetchedMovies);
  //           })
  //           .catch((error) => console.error("Error fetching movies:", error));
  //       };
  //       fetchReservations();
  //     };
  //     fetchUserData();
  //   } else {
  //     console.error("User ID is not found in localStorage");
  //   }
  // }, [userId]);

  const handleEditClick = () => {
    setOpenEditDialog(true);
  };

  const handleClose = () => {
    setOpenEditDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      const updatedUser = await updateUserProfile(userId, editData);
      setUserData({ ...userData, ...updatedUser });
      setOpenEditDialog(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };
  return (
    <>
      <div className="admin">
        <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>
          User Dashboard
        </h1>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            color: 'white',
            marginTop: '2rem',
          }}
        >
          {userData && (
            <Box sx={{ width: '30%', p: 3, textAlign: 'center' }}>
              <AccountCircleIcon sx={{ fontSize: '10rem', mb: 2 }} />
              <Typography variant="h6">Name: {userData.name}</Typography>
              <Typography variant="h6">Email: {userData.email}</Typography>
              <Typography variant="h6">Phone no.: {userData.phone}</Typography>
              <Typography variant="h6">Role: {userData.role}</Typography>
              <Button
                variant="contained"
                sx={{ backgroundColor: '#454b54' }}
                onClick={handleEditClick}
              >
                Edit Profile
              </Button>
            </Box>
          )}

          <Box sx={{ width: '70%', mt: 3 }}>
            <Typography variant="h5">
              Booked Movies by {userData.name}
            </Typography>
            {reservations.length === 0 ? (
              <Typography variant="h6">No reservations found.</Typography>
            ) : (
              <Grid container spacing={3}>
                {reservations.map((reservation, index) => (
                  <Grid item xs={12} sm={6} md={4} key={reservation._id}>
                    <Card
                      sx={{
                        backgroundColor: '#333',
                        color: 'white',
                        cursor: 'pointer',
                        borderRadius: 2,
                        boxShadow: 3,
                        margin: 2,
                      }}
                      onClick={() =>
                        navigate(`/movie/${reservation.movie._id}`)
                      }
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={movies[index] ? movies[index].image : ''}
                        alt={movies[index] ? movies[index].title : 'Loading...'}
                        sx={{
                          objectFit: 'cover',
                          width: '100%',
                          aspectRatio: '16/9',
                          borderTopLeftRadius: 2,
                          borderTopRightRadius: 2,
                          filter: 'brightness(90%)',
                        }}
                      />
                      <CardContent
                        sx={{ fontWeight: 800, position: 'relative' }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            color: 'white',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                            paddingBottom: 1,
                          }}
                        >
                          {movies[index] ? movies[index].title : 'Loading...'}
                        </Typography>
                        <Typography variant="body2">
                          Theater:
                          <Box
                            variant="body2"
                            sx={{
                              color: '#90A4AE',
                              display: 'inline',
                              marginLeft: 1,
                            }}
                          >
                            {movies[index]
                              ? movies[index].theater.name
                              : 'Loading...'}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Date:{' '}
                          <Box
                            variant="body2"
                            sx={{
                              color: '#90A4AE',
                              display: 'inline',
                              marginLeft: 1,
                            }}
                          >
                            {new Date(reservation.date).toLocaleDateString()}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          startAt:{' '}
                          <Box
                            variant="body2"
                            sx={{
                              color: '#90A4AE',
                              display: 'inline',
                              marginLeft: 1,
                            }}
                          >
                            {reservation.startAt}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Seats:{' '}
                          <Box
                            variant="body2"
                            sx={{
                              color: '#90A4AE',
                              display: 'inline',
                              marginLeft: 1,
                            }}
                          >
                            {reservation.seats.join(', ')}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Ticket Price:
                          <Box
                            variant="body2"
                            sx={{
                              color: '#90A4AE',
                              display: 'inline',
                              marginLeft: 1,
                            }}
                          >
                            &#8377;{reservation.ticketPrice}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Director:
                          <Box
                            variant="body2"
                            sx={{
                              color: '#90A4AE',
                              display: 'inline',
                              marginLeft: 1,
                            }}
                          >
                            {movies[index]
                              ? movies[index].director
                              : 'Loading...'}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Genre:
                          <Box
                            variant="body2"
                            sx={{
                              color: '#90A4AE',
                              display: 'inline',
                              marginLeft: 1,
                            }}
                          >
                            {movies[index] ? movies[index].genre : 'Loading...'}
                          </Box>
                        </Typography>
                        <Typography variant="body2">
                          Duration:
                          <Box
                            variant="body2"
                            sx={{
                              color: '#90A4AE',
                              display: 'inline',
                              marginLeft: 1,
                            }}
                          >
                            {movies[index]
                              ? movies[index].duration
                              : 'Loading...'}{' '}
                            min
                          </Box>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>

        <Dialog open={openEditDialog} onClose={handleClose}>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              name="name"
              fullWidth
              value={editData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              name="email"
              fullWidth
              value={editData.email}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Phone"
              type="text"
              name="phone"
              fullWidth
              value={editData.phone}
              onChange={handleInputChange}
              error={editData.phone.length > 0 && editData.phone.length !== 10}
              helperText={
                editData.phone.length > 0 && editData.phone.length !== 10
                  ? 'Phone number must be exactly 10 digits'
                  : ''
              }
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              name="password"
              fullWidth
              value={editData.password}
              onChange={handleInputChange}
              // helperText="Leave blank to keep the current password"
              error={
                editData.password.length > 0 && editData.password.length < 6
              }
              helperText={
                editData.password.length > 0 && editData.password.length < 6
                  ? 'Password must be at least 6 characters long'
                  : ''
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleUpdate} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default User;
