import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useState, useEffect } from 'react';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { getAdminData } from '../../api/Profiles_api/Profiles';
import { getTheaterData } from '../../api/Theater_api/Theater';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [adminData, setAdminData] = useState({});
  const [theater, setTheatre] = useState([]);
  const userType = localStorage.getItem('userType') || 'undefined';
  const adminId = localStorage.getItem('adminId') || 'abc';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const data = await getAdminData(adminId);
      setAdminData(data);
    };
    fetchAdminData();

    const fetchTheaterData = async () => {
      const data = await getTheaterData(adminId);
      setTheatre(data);
    };
    fetchTheaterData();
  }, [adminId]);

  // Delete Theater
  const handleDeleteTheatre = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteTheatre(id);
      setTheatres(theater.filter((theatre) => theatre._id !== id));
      alert('Theater deleted successfully!');
    } catch (error) {
      alert('You are not authorized to delete this theater');
      console.log('Error:', error);
    }
  };

  return (
    <div className="admin">
      <h1 style={{ textAlign: 'center', marginTop: '2rem' }}>
        Admin Dashboard
      </h1>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          color: 'white',
          marginTop: '2rem',
        }}
      >
        {adminData && (
          <Box sx={{ width: '30%', p: 3, textAlign: 'center' }}>
            <AccountCircleIcon
              sx={{ fontSize: '10rem', mb: 2, color: 'white' }}
            />
            <Typography variant="h6" color="white">
              Name: {adminData.name}
            </Typography>
            <Typography variant="h6" color="white">
              Email: {adminData.email}
            </Typography>
            <Typography variant="h6" color="white">
              Phone no.: {adminData.phone}
            </Typography>
            <Typography variant="h6" color="white">
              Role: {adminData.role}
            </Typography>
          </Box>
        )}

        <Box sx={{ width: '70%', p: 3 }}>
          <Typography variant="h5" gutterBottom color="white">
            Theater Created by {adminData.name}
          </Typography>
          {theater.length > 0 ? (
            <Grid container spacing={3}>
              {theater.map((theater) => (
                <Grid item xs={12} sm={6} md={4} key={theater._id}>
                  <Card
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      cursor: 'pointer',
                      borderRadius: 2,
                      boxShadow: 3,
                    }}
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/theater/${theater._id}/movies`)}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={theater.image}
                      alt={theater.name}
                      sx={{
                        borderTopLeftRadius: 2,
                        borderTopRightRadius: 2,
                        filter: 'brightness(70%)',
                      }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        pb={1}
                        sx={{
                          fontWeight: 'bold',
                          color: 'white',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                          fontSize: '1.4rem',
                        }}
                      >
                        {theater.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="white"
                        sx={{
                          fontWeight: 'medium',
                          color: 'white',
                          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',
                          fontSize: '1.2rem',
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
                          {theater.city}
                        </Box>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="white"
                        sx={{
                          fontWeight: 'medium',
                          fontSize: '1.2rem',
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
                          &#8377; {theater.ticketPrice}
                        </Box>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="white"
                        sx={{
                          fontSize: '14px',
                          marginBottom: 1,
                        }}
                      >
                        Seats Available:
                        <Box
                          variant="body2"
                          sx={{
                            color: '#90A4AE',
                            display: 'inline',
                            marginLeft: 1,
                          }}
                        >
                          {theater.seats[0]}
                        </Box>
                      </Typography>
                      {userType === 'Admin' &&
                        adminId === theater.admin && ( // Only show if user is admin of this theater
                          <Button
                            variant="contained"
                            color="error"
                            onClick={(e) => handleDeleteTheatre(theater._id, e)}
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
                        )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="white">
              No theater created by this admin.
            </Typography>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Admin;
