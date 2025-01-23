import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getAllMovies } from '../../api/Movie_api/getAllmovie';

const HeaderN = () => {

    const [menuOpen, setMenuOpen] = useState(false);
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
                `${movie.title.toLowerCase()} ${movie.genre.toLowerCase()} ${movie.director.toLowerCase()}`.includes(
                    query
                )
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
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                {/* Logo */}
                <a
                    href="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    <svg
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                    >
                        <path
                            d="M20 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm.001 6c-.001 0-.001 0 0 0h-.465l-2.667-4H20l.001 4zM15.5 15 10 18v-6l5.5 3zm-.964-6-2.667-4h2.596l2.667 4h-2.596zm-2.404 0H9.536L6.869 5h2.596l2.667 4zM4 5h.465l2.667 4H4V5z"
                            fill="#ffffff"
                            className="fill-000000"
                        ></path>
                    </svg>
                </a>
                {/* Right Section */}
                <div className="flex md:order-2">
                    {/* Desktop Search Input */}
                    <div className="relative hidden md:block">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                            <span className="sr-only">Search icon</span>
                        </div>
                        <input
                            type="text"
                            id="search-navbar"
                            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search..."
                            value={query}
                            onChange={handleSearch}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        data-collapse-toggle="navbar-search"
                        type="button"
                        className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                        aria-controls="navbar-search"
                        aria-expanded={menuOpen}
                    >
                        <span className="sr-only">Open main menu</span>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 17 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 1h15M1 7h15M1 13h15"
                            />
                        </svg>
                    </button>
                </div>

                {filteredMovies.length > 0 && (
                    <ul className="absolute w-1/2 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredMovies.map((movie) => (
                        <li
                          key={movie.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleMovie(movie.id)}
                        >
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className="w-10 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-white">{movie.title}</p>
                            <p className="text-xs text-gray-400">Genre: {movie.genre}</p>
                            <p className="text-xs text-gray-400">Director: {movie.director}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
            
                  {/* Popup for No Results */}
                  {showPopup && (
                    <div className="absolute w-full mt-2 text-sm text-center text-white bg-blue-600 rounded-lg shadow-lg">
                      No results found for your query.
                    </div>
                  )}

                {/* Navbar Links */}
                <div
                    className={`items-center justify-between ${menuOpen ? "block" : "hidden"
                        } w-full md:flex md:w-auto md:order-1`}
                    id="navbar-search"
                >
                    {/* Mobile Search Input */}
                    <div className="relative mt-3 md:hidden">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="search-navbar"
                            className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search..."
                            value={query}
                            onChange={handleSearch}
                            onKeyPress={handleKeyPress}
                        />
                    </div>
                    {/* Navigation Links */}
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                        <li>
                            <a
                                href="/"
                                className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                                aria-current="page"
                            >
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="/theater"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Theater
                            </a>
                        </li>
                        <li>
                            <a
                                href="/movie"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Movies
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                            >
                                Sign Up
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    )
}

export default HeaderN