import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
import './Header.css';
import {
  Alert,
  alpha,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  Snackbar,
  styled,
  Typography,
} from '@mui/material';
import { getAllMovies } from '../../api/Movie_api/getAllmovie';

function Header() {
  const [value, setValue] = useState(0);
  const [openTheaterDialog, setOpenTheaterDialog] = useState(false);
  const [showPopup, setShowPopup] = useState();
  const [openMovieDialog, setOpenMovieDialog] = useState(false); // New state for movie dialog
  const [theater, setTheater] = useState({
    name: '',
    city: '',
    ticketPrice: '',
    seats: '',
    image: '',
  });
  const [movie, setMovie] = useState({
    title: '',
    image: '',
    language: '',
    genre: '',
    director: '',
    trailer: '',
    description: '',
    duration: '',
    startDate: '',
    endDate: '',
    timeSlots: [],
  }); // New state for movie form
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const userEmail = localStorage.getItem('userEmail') || '';
  const userInitial = userEmail ? userEmail.charAt(0).toUpperCase() : '';
  const userType = localStorage.getItem('userType') || '';
  console.log('type', userType);
  const inputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllMovies = async () => {
      const response = await getAllMovies();
      setMovies(response);
    };
    fetchAllMovies();
  }, []);

  useEffect(() => {
    document.body.style.inert =
      openTheaterDialog || openMovieDialog ? 'true' : 'false';
    return () => {
      document.body.style.inert = 'false';
    };
  }, [openTheaterDialog, openMovieDialog]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    navigate('/');
    window.location.reload();
  };

  const handleOpenTheaterDialog = () => {
    setOpenTheaterDialog(true); // Open Theater dialog
  };

  const handleCloseTheaterDialog = () => {
    setOpenTheaterDialog(false); // close Theater dialog
  };

  const handleOpenMovieDialog = () => {
    setOpenMovieDialog(true); // Open the movie dialog
  };

  const handleCloseMovieDialog = () => {
    setOpenMovieDialog(false); // Close the movie dialog
  };

  const handleTheaterChange = (e) => {
    const { name, value } = e.target;
    setTheater({
      ...theater,
      [name]: value,
    });
  };

  const handleMovieChange = (e) => {
    const { name, value } = e.target;
    setMovie({
      ...movie,
      [name]: value,
    });
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setQuery(query);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
    if (query.length > 0) {
      const filtered = movies.filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
      setFilteredMovies(filtered);
      if (filtered.length === 0 && query !== '') {
        setShowPopup(true);
      } else {
        setShowPopup(false);
      }
    } else {
      setFilteredMovies([]);
      setShowPopup(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleMovie(filteredMovies[0]._id);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddTimeSlot = () => {
    if (newTimeSlot) {
      setMovie({ ...movie, timeSlots: [...movie.timeSlots, newTimeSlot] });
      setNewTimeSlot('');
    }
  };

  const handleSaveTheater = async () => {
    if (
      !theater.name ||
      !theater.city ||
      !theater.ticketPrice ||
      !theater.seats ||
      !theater.image
    ) {
      alert('Please fill all the fields and provide an image URL.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      alert('You are not authenticated. Please log in.');
      return;
    }

    console.log('Token retrieved from localStorage:', token);

    const theaterData = {
      name: theater.name,
      city: theater.city,
      ticketPrice: parseFloat(theater.ticketPrice),
      seats: theater.seats.split(',').map(Number),
      image: theater.image,
    };

    try {
      const response = await fetch('http://localhost:5000/api/theatres/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(theaterData),
      });

      if (!response.ok) {
        throw new Error('Admin can create only one theater');
      }

      const result = await response.json();
      console.log('Theater added:', result);

      setTheater({
        name: '',
        city: '',
        ticketPrice: '',
        seats: '',
        image: '',
      });
      handleCloseTheaterDialog();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  const handleMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
    setQuery('');
    setFilteredMovies([]);
  };

  const handleSaveMovie = async () => {
    if (
      !movie.title ||
      !movie.description ||
      !movie.language ||
      !movie.genre ||
      !movie.director ||
      !movie.duration ||
      !movie.startDate ||
      !movie.endDate ||
      !movie.image ||
      !movie.trailer
    ) {
      alert('Please fill all the fields and provide necessary details.');
      return;
    }

    const token = localStorage.getItem('token');
    const adminId = localStorage.getItem('adminId');

    if (!token) {
      alert(
        'You are not authenticated or admin ID is missing. Please log in again.'
      );
      return;
    }

    console.log('Token retrieved from localStorage:', token);

    const movieData = {
      title: movie.title,
      description: movie.description,
      language: movie.language,
      genre: movie.genre,
      director: movie.director,
      duration: parseInt(movie.duration),
      startDate: movie.startDate,
      endDate: movie.endDate,
      image: movie.image,
      trailer: movie.trailer,
      adminId: adminId,
      timeSlots: movie.timeSlots,
    };

    try {
      const response = await fetch('http://localhost:5000/api/movies/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(movieData),
      });

      if (!response.ok) {
        throw new Error('Failed to add movie. Please check your inputs.');
      }

      const result = await response.json();
      console.log('Movie added:', result);

      setMovie({
        title: '',
        description: '',
        language: '',
        genre: '',
        director: '',
        duration: '',
        startDate: '',
        endDate: '',
        image: '',
        trailer: '',
        timeSlots: [],
      });
      handleCloseMovieDialog();
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <>
      <AppBar position="sticky" sx={{ background: 'black' }}>
        <Toolbar>
          <Box width={'10%'}>
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
              width="153pt" height="30pt" viewBox="0 0 1537.000000 357.000000"
              preserveAspectRatio="xMidYMid meet">
              <rect width="100%" height="100%" fill="#f0f0f0" />
              <g transform="translate(0.000000,357.000000) scale(0.100000,-0.100000)"
                stroke="none">
                <path d="M0 1785 l0 -1785 7685 0 7685 0 0 1785 0 1785 -7685 0 -7685 0 0
         -1785z m2292 1576 c549 -119 1000 -516 1174 -1036 63 -190 77 -277 78 -495 1
         -151 -3 -218 -18 -295 -119 -637 -599 -1128 -1240 -1267 -85 -19 -133 -22
         -306 -23 -178 0 -219 3 -314 23 -394 85 -743 309 -969 623 -76 107 -183 316
         -222 433 -57 175 -69 264 -69 491 0 227 12 316 70 491 39 119 145 328 221 433
         225 312 586 545 962 620 140 29 149 29 351 26 140 -3 208 -8 282 -24z m3901
         -2062 c27 -70 58 -94 120 -94 29 0 68 3 87 7 35 8 35 8 73 -60 28 -47 36 -71
         30 -82 -17 -27 -132 -59 -214 -60 -179 0 -279 78 -327 259 -13 46 -17 193 -23
         831 -4 426 -11 799 -14 828 -4 28 -3 52 2 53 4 1 60 6 123 13 l115 11 5 -830
         c5 -764 7 -834 23 -876z m7925 583 c5 2 107 112 227 246 l219 242 140 0 140 0
         -26 -27 c-14 -16 -114 -127 -223 -248 l-197 -220 -105 -41 -105 -41 104 -37
         103 -38 275 -324 c151 -179 281 -334 289 -345 13 -19 10 -19 -130 -18 l-144 0
         -285 337 -285 336 -3 -337 -2 -337 -115 0 -115 0 0 870 c0 587 -4 902 -11 970
         -7 55 -9 103 -6 107 4 3 60 11 124 17 l118 11 3 -563 c1 -310 6 -562 10 -560z
         m-3715 969 c75 -20 241 -93 253 -112 5 -9 -101 -149 -113 -149 -3 0 -34 13
         -67 29 -82 39 -126 50 -221 57 -154 11 -287 -36 -349 -124 -24 -33 -31 -56
         -34 -105 -9 -142 57 -208 335 -335 81 -38 182 -88 223 -112 138 -80 238 -198
         270 -318 14 -54 14 -193 0 -256 -39 -173 -171 -309 -369 -380 -84 -30 -91 -31
         -256 -30 -141 0 -183 4 -246 21 -88 25 -239 91 -239 106 0 9 99 177 104 177 2
         0 41 -18 88 -40 118 -55 202 -73 313 -67 231 12 370 134 368 322 -1 103 -49
         182 -157 259 -33 24 -148 87 -253 139 -106 53 -212 109 -235 125 -64 44 -146
         136 -170 189 -45 101 -32 267 29 370 74 126 240 231 408 257 63 9 242 -3 318
         -23z m-4778 -28 c-3 -21 -9 -65 -13 -98 l-7 -60 -394 -3 -393 -2 6 -48 c3 -26
         9 -149 12 -274 l7 -228 328 0 329 0 0 -90 0 -90 -330 0 -330 0 0 -450 0 -450
         -130 0 -130 0 0 808 c0 658 -3 825 -15 902 -8 52 -15 101 -15 108 0 9 115 12
         540 12 l540 0 -5 -37z m1405 -88 l0 -125 -120 0 -120 0 0 125 0 125 120 0 120
         0 0 -125z m732 -451 l3 -105 37 64 c43 75 74 94 208 128 207 53 384 -11 455
         -162 l22 -48 49 72 c55 81 106 115 215 143 86 22 216 15 280 -15 85 -40 143
         -115 175 -226 15 -52 18 -126 21 -582 l5 -523 -121 0 -121 0 0 498 c0 411 -3
         507 -15 548 -24 82 -75 117 -171 117 -71 0 -141 -28 -239 -94 l-60 -40 3 -515
         4 -514 -121 0 -120 0 -3 513 -3 513 -25 48 c-34 66 -80 90 -169 89 -77 -1
         -166 -33 -251 -91 l-55 -37 -3 -517 -2 -518 -115 0 -115 0 0 669 0 670 43 5
         c23 3 53 7 67 10 14 2 46 4 72 5 l47 1 3 -106z m3504 -349 c120 -329 173 -489
         198 -595 20 -90 35 -137 39 -125 3 11 20 79 36 150 20 88 81 269 190 565 182
         496 145 441 301 454 l80 7 -14 -38 c-73 -205 -496 -1359 -523 -1428 -136 -347
         -284 -502 -462 -481 -57 7 -150 47 -177 77 -16 17 -14 22 22 75 21 30 42 58
         46 60 4 3 21 -2 37 -11 17 -8 49 -15 73 -15 39 0 47 5 103 63 46 46 74 89 113
         167 l51 105 -254 699 c-140 385 -253 701 -251 703 6 6 158 21 195 19 l33 -1
         164 -450z m1386 353 l3 -102 35 60 c29 49 44 64 90 86 127 61 323 75 422 28
         57 -26 111 -80 138 -135 46 -94 50 -148 50 -687 l0 -508 -115 0 -114 0 -3 518
         c-3 502 -4 518 -24 557 -65 126 -244 119 -441 -17 l-43 -29 0 -514 0 -515
         -120 0 -120 0 0 669 0 670 58 6 c31 3 64 8 72 9 8 2 36 4 62 5 l47 1 3 -102z
         m-5622 -603 l0 -655 -115 0 -115 0 0 644 0 644 93 10 c50 5 102 10 115 11 l22
         1 0 -655z"/>
                <path d="M2509 2883 c154 -156 257 -341 319 -572 22 -85 25 -116 26 -276 1
         -157 -2 -191 -22 -265 -48 -177 -156 -355 -280 -459 -188 -157 -453 -240 -674
         -212 -293 38 -515 206 -603 457 -36 105 -45 267 -20 364 60 231 262 390 495
         390 126 0 206 -36 298 -134 125 -133 160 -311 86 -447 -33 -59 -75 -99 -147
         -136 -45 -24 -63 -28 -142 -28 -76 0 -97 4 -135 24 -93 49 -134 94 -170 187
         -17 45 -19 46 -20 19 0 -54 30 -149 65 -202 123 -185 380 -236 604 -118 188
         99 298 279 309 501 6 131 -14 225 -75 347 -135 269 -441 425 -762 389 -591
         -68 -956 -639 -785 -1231 100 -344 380 -632 725 -744 227 -74 532 -67 771 19
         489 176 787 652 738 1179 -38 409 -243 757 -565 956 -43 27 -82 49 -86 49 -4
         0 18 -26 50 -57z"/>
              </g>
            </svg>

          </Box>
          <Box
            sx={{
              maxWidth: { xs: '100%', sm: '50%', md: '30%' },
              width: '100%',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: '40px',
                marginLeft : '50px'
              }}
            >
              <TextField
                placeholder="Search…"
                value={query}
                onChange={handleSearch}
                onKeyPress={handleKeyPress}
                inputProps={{ 'aria-label': 'search' }}
                inputRef={inputRef}
                sx={{
                  backgroundColor: 'rgba(98, 101, 98, 0.4)',
                  borderRadius: '6px',
                  width: '100%',
                  height: '100%',
                  paddingRight: '40px',
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    padding: '0 12px',
                    height: '100%',
                    '& fieldset': {
                      border: 'none', // Removes the default border
                    },
                    '&:hover fieldset': {
                      border: 'none', // Ensures no border on hover
                    },
                    '&.Mui-focused fieldset': {
                      border: 'none', // Removes outline on focus
                    },
                  },
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none',
                }}
              >
                <SearchIcon />
              </Box>
            </Box>
            <Box sx={{ position: 'relative', width: '100%' }}>
              {filteredMovies.length > 0 && (
                <List
                  sx={{
                    width: '100%', // Full width relative to the parent
                    zIndex: 9999,
                    minWidth: '300px',
                    position: 'absolute',
                    top: 'calc(100% + 8px)', // Position below the search bar
                    left: '0', // Align with the left edge of the search bar
                    backgroundColor: 'rgb(31, 31, 31)',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                    maxHeight: '400px',
                    overflowY: 'auto', // Ensures scrollability
                    padding: 0,
                    '&::-webkit-scrollbar': {
                      display: 'none', // Hides the scrollbar
                    },
                    '@media (max-width: 600px)': {
                      maxWidth: '90%', // Adjust width for smaller screens
                      left: '5%', // Center it for mobile
                    },
                  }}
                >
                  {filteredMovies.map((movie, index) => (
                    <ListItem key={index} sx={{ padding: 0 }}>
                      <Card
                        sx={{
                          width: '100%',
                          boxShadow: 'none',
                          borderBottom: '1px solid white',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleMovie(movie._id)}
                      >
                        <CardContent
                          sx={{
                            '&:last-child': {
                              paddingBottom: '8px',
                            },
                            padding: '8px',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                            color: '#fff',
                            backgroundColor: 'rgb(31, 31, 31)',
                          }}
                        >
                          <Box
                            component="img"
                            src={movie.image}
                            alt={movie.title}
                            sx={{
                              width: '40px',
                              height: '50px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }}
                          />
                          <Box>
                            <Typography variant="body2" fontWeight="500" noWrap>
                              {movie.title}
                            </Typography>
                            <Box
                              sx={{ display: 'flex', flexDirection: 'column' }}
                            >
                              <Typography
                                variant="caption"
                                fontWeight="100"
                                noWrap
                              >
                                Genre: {movie.genre}
                              </Typography>
                              <Typography
                                variant="caption"
                                fontWeight="100"
                                noWrap
                              >
                                Director: {movie.director}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
            {showPopup && (
              <Snackbar
                open={showPopup}
                autoHideDuration={2000}
                disableWindowBlurListener={showPopup}
                onClose={handleClosePopup}
              >
                <Alert
                  onClose={handleClosePopup}
                  severity="info"
                  sx={{ width: '100%' }}
                >
                  No results found for your query.
                </Alert>
              </Snackbar>
            )}
          </Box>
          <Box display={'flex'} marginLeft={'auto'} sx={{ cursor: 'pointer' }}>
            <Tabs
              value={value}

              textColor="inherit"
              indicatorColor="secondary"
              onChange={(e, val) => setValue(val)}
            >
              <Tab
                label="Home"
                component={Link}
                to="/"
                sx={{ color: 'white' }}
              />
              <Tab
                label="Theater"
                component={Link}
                to="/theater"
                sx={{ color: 'white' }}
              />
              <Tab
                label="Movies"
                component={Link}
                to="/movie"
                sx={{ color: 'white' }}
              />
              {userType === 'Admin' && (
                <Box>
                  <Tab
                    label="Add Your Theater"
                    onClick={handleOpenTheaterDialog}
                    sx={{ color: 'white' }}
                  />
                  <Tab
                    label="Add Movie"
                    onClick={handleOpenMovieDialog}
                    sx={{ color: 'white' }}
                  />{' '}
                  {/* New Tab for adding movie */}
                </Box>
              )}

              {userInitial ? (
                <Box display="flex" alignItems="center">
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      backgroundColor: '#1b1b1b',
                      color: 'white',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      marginRight: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      if (userType === 'Admin') {
                        navigate('/admin');
                      } else if (userType === 'User') {
                        navigate('/user');
                      }
                    }}
                  >
                    {userInitial}
                  </Box>
                  <Button
                    variant="outlined"
                    sx={{ color: 'white', borderColor: 'white' }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              ) : (
                <Tab
                  label="Sign Up"
                  component={Link}
                  to="/register"
                  sx={{ color: 'white' }}
                />
              )}
            </Tabs>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Theater Dialog */}
      <Dialog
        open={openTheaterDialog}
        onClose={handleCloseTheaterDialog}
        style={{ width: '100%' }}
      >
        <DialogTitle>
          Add Theater
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseTheaterDialog}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleTheaterChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleTheaterChange}
          />
          <TextField
            margin="dense"
            name="ticketPrice"
            label="Ticket Price"
            type="number"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleTheaterChange}
          />
          <TextField
            margin="dense"
            name="seats"
            label="Seats"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleTheaterChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleTheaterChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseTheaterDialog}>Cancel</Button>
          <Button onClick={handleSaveTheater}>Save</Button>
        </DialogActions>
      </Dialog>
      {/* Movie Dialog */}
      <Dialog
        open={openMovieDialog}
        onClose={handleCloseMovieDialog}
        style={{ width: '100%' }}
      >
        <DialogTitle>
          Add Movie
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleCloseMovieDialog}
            aria-label="close"
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Title"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="language"
            label="Language"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="genre"
            label="Genre"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="director"
            label="Director"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="trailer"
            label="Trailer URL"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="duration"
            label="Duration (in minutes)"
            type="number"
            style={{ width: '100%' }}
            variant="standard"
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            style={{ width: '100%' }}
            variant="standard"
            InputLabelProps={{ shrink: true }}
            onChange={handleMovieChange}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="date"
            style={{ width: '100%' }}
            variant="standard"
            InputLabelProps={{ shrink: true }}
            onChange={handleMovieChange}
          />
        </DialogContent>

        {/* Time Slots Section */}
        <TextField
          margin="dense"
          label="Add Time Slot"
          type="text"
          style={{ width: '100%' }}
          variant="standard"
          value={newTimeSlot}
          onChange={(e) => setNewTimeSlot(e.target.value)}
        />
        <Button onClick={handleAddTimeSlot}>Add Time Slot</Button>
        <Box>
          {movie.timeSlots.map((slot, index) => (
            <Box key={index}>{slot}</Box>
          ))}
        </Box>
        <DialogActions>
          <Button onClick={handleCloseMovieDialog}>Cancel</Button>
          <Button onClick={handleSaveMovie}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Header;
