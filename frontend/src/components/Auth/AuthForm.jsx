import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Signup, Login } from '../../api/Authentication_api/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function AuthForm() {
  const labelStyle = { mt: 1, mb: 1 };
  const [isSignup, setIsSignup] = useState(false);
  const [userType, setUserType] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const navigate = useNavigate()
  const handleInputValue = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userType === "") {
      alert("Please select a user type.");
      return;
    }

    //const endpoint = userType === 'Admin' ? "http://localhost:5000/api/admin/signup" : "http://localhost:5000/api/users/register";

    try {
      const res = await Signup(input, userType, secretKey);
      console.log(res);

      if (userType === 'Admin') {
        alert(`Signup successful! Your Secret Key is: ${input.name}. Please keep it safe.`);
      } else {
        alert("Signup successful! You can now log in.");
      }
      setInput({ name: "", email: "", password: "", phone: "" });
      setIsSignup(false);
    }
    catch (err) {
      console.log(err.message);
      alert("An error occurred during signup.");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    //const endpoint = userType === 'Admin' ? "http://localhost:5000/api/admin/login" : "http://localhost:5000/api/users/login";

    try {
      const res = await Login(input, userType, secretKey);
      console.log('login', res);

      // localStorage.setItem("token", res.data.token);
      localStorage.setItem("token", res.token);
      localStorage.setItem("userEmail", input.email);
      localStorage.setItem("userType", userType);

      if (userType === 'Admin') {
        localStorage.setItem("adminId", res.id);
      } else if (userType === 'User') {
        localStorage.setItem("userId", res.user._id);
      }
      console.log('adminId', localStorage.getItem('adminId'));
      console.log('userId', localStorage.getItem('userId'));

      navigate("/");
      window.location.reload();
    }
    catch (err) {
      console.log(err.message);
      alert("Invalid credentials or secret key.");
    }
    finally {
      setInput({ name: "", email: "", password: "", phone: "" });
    }
  };

  return (
    <>
      <Dialog open={true} PaperProps={{ style: { borderRadius: 20, overflow: 'hidden', width: 500 ,padding: '2rem',  background: 'linear-gradient(to bottom, #ffffff, #f0f4f8)'},}}>
        {/* <Box sx={{ ml: 'auto', padding: 1 }}>
          <IconButton component={Link} to="/">
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
          <Box display={'flex'} sx={{
            transform: 'translateY(-2rem)', // Adjust the value as needed
          }} >
            <Typography padding={3} variant='h5' textAlign={'left'}>
              {isSignup ? "Sign Up as" : "Login as"}
            </Typography>

            <Typography variant='h6' sx={{ paddingRight: '1.4rem', marginBottom: '1rem' }}>
              <input
                type="radio"
                name="UserType"
                value="User"
                checked={userType === 'User'}
                onChange={(e) => setUserType(e.target.value)}
                style={{ marginTop: '2rem' }}
              /> User
            </Typography>

            <Typography variant='h6'>
              <input
                type="radio"
                name="UserType"
                value="Admin"
                checked={userType === 'Admin'}
                onChange={(e) => setUserType(e.target.value)}
                style={{ marginTop: '2rem' }}
              /> Admin
            </Typography>
          </Box>
          <Typography paddingLeft={3} variant='h6' display={"flex"} textAlign={'left'}>
            {isSignup ? "" : "Don't have an account"}
            <Typography variant='h6' paddingLeft={2}>
              <Button sx={{ borderRadius: 10 , transform: 'translateY(-2rem)' }} style={{ width: '100%' }} variant='standard' onClick={() => setIsSignup(!isSignup)}>
                {isSignup ? "Login" : "Sign Up"}
              </Button>
            </Typography>
          </Typography>
        </Box> */}

<Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" fontWeight="bold">
          {isSignup ? 'Sign Up' : 'Login'}
        </Typography>
        <IconButton component={Link} to="/">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box mt={3}>
        <RadioGroup
          row
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          sx={{ justifyContent: 'center', mb: 3 }}
        >
          <FormControlLabel
            value="User"
            control={<Radio />}
            label="User"
            sx={{ mx: 2 }}
          />
          <FormControlLabel
            value="Admin"
            control={<Radio />}
            label="Admin"
            sx={{ mx: 2 }}
          />
        </RadioGroup>
      </Box>

        <form onSubmit={isSignup ? handleSubmit : handleLoginSubmit} >
          {/* <Box padding={6}  sx={{transform: 'translateY(-2rem)' }} display={"flex"} justifyContent={"center"} flexDirection="column" width={400} margin="auto" alignContent={"center"}>
            {isSignup && (
              <>
                <FormLabel>Name</FormLabel>
                <TextField
                  type={'text'}
                  value={input.name}
                  onChange={handleInputValue}
                  name='name'
                  variant='standard'
                  margin='normal'
                  sx={{ mb: 4 }}
                />
              </>
            )}
            <FormLabel>Email</FormLabel>
            <TextField
              type={'email'}
              value={input.email}
              onChange={handleInputValue}
              name='email'
              variant='standard'
              margin='normal'
              sx={{ mb: 4 }}
            /> */}
            <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={2}
          mt={2}
        >
          {isSignup && (
            <TextField
              label="Name"
              name="name"
              value={input.name}
              onChange={handleInputValue}
              variant="outlined"
              fullWidth
            />
          )}
          <TextField
            label="Email"
            name="email"
            value={input.email}
            onChange={handleInputValue}
            variant="outlined"
            fullWidth
          />
            {/* <FormLabel sx={labelStyle}>Password</FormLabel>
            <TextField
              type={'password'}
              value={input.password}
              onChange={handleInputValue}
              name='password'
              variant='standard'
              margin='normal'
              error={input.password.length > 0 && input.password.length < 6}
              helperText={input.password.length > 0 && input.password.length < 6 ? "Password must be at least 6 characters long" : ""}
            />
            {isSignup && (
              <>
                <FormLabel>Phone</FormLabel>
                <TextField
                  type={'text'}
                  value={input.phone}
                  onChange={handleInputValue}
                  name='phone'
                  variant='standard'
                  margin='normal'
                  sx={{ mb: 4 }}
                  error={input.phone.length > 0 && input.phone.length !== 10}
                  helperText={input.phone.length > 0 && input.phone.length !== 10 ? "Phone number must be exactly 10 digits" : ""}
                />

              </>
            )} */}
              <TextField
            label="Password"
            name="password"
            type="password"
            value={input.password}
            onChange={handleInputValue}
            variant="outlined"
            error={input.password.length > 0 && input.password.length < 6}
            helperText={input.password.length > 0 && input.password.length < 6 ? "Password must be at least 6 characters long" : ""}
            fullWidth
          />
          {isSignup && (
            <TextField
              label="Phone"
              name="phone"
              value={input.phone}
              onChange={handleInputValue}
              variant="outlined"
              error={input.phone.length > 0 && input.phone.length !== 10}
              helperText={input.phone.length > 0 && input.phone.length !== 10 ? "Phone number must be exactly 10 digits" : ""}
              fullWidth
            />
          )}
            {/* {!isSignup && userType === 'Admin' && (
              <>
                <FormLabel>Secret Key</FormLabel>
                <TextField
                  type={'password'}
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  name='secretKey'
                  variant='standard'
                  margin='normal'
                  sx={{ mb: 4 }}
                />
              </>
            )} */}

          {!isSignup && userType === 'Admin' && (
            <TextField
              label="Secret Key"
              name="secretKey"
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              variant="outlined"
              fullWidth
            />
          )}
            {/* <Button
              type='submit'
              sx={{ mt: 2, borderRadius: 10 }}
              style={{ width: '100%' }}
              variant='contained'
              bgcolor='#1b1b1b'
            >
              {isSignup ? "Sign Up" : "Login"}
            </Button> by them*/ }
            {/* <Button
              type='submit'
              sx={{
                mt: 2,
                borderRadius: 10,
                transform: 'translateY(-1.7rem)', // Adjust the value as needed
              }}
              style={{ width: '100%' }}
              variant='contained'
              bgcolor='#1b1b1b'
            >
              {isSignup ? "Sign Up" : "Login"}
            </Button>

          </Box>
        </form>
      </Dialog> */}
      <Button
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 5,
              mt: 3,
              width: '100%',
              py: 1.5,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#125ea1' },
            }}
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </Button>
        </Box>
      </form>
      <Box mt={3} textAlign="center">
        <Typography>
          {isSignup
            ? 'Already have an account?'
            : "Don't have an account?"}{' '}
          <Button
            onClick={() => setIsSignup(!isSignup)}
            sx={{ textTransform: 'none', color: '#1976d2' }}
          >
            {isSignup ? 'Login' : 'Sign Up'}
          </Button>
        </Typography>
      </Box>
    </Dialog>
    </>
  );
}
