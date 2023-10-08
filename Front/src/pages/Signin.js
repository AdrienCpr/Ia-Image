import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import swal from 'sweetalert';
import env from "react-dotenv";


const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundSize: 'cover',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

async function loginUser(body) {
  return fetch(`${process.env.REACT_APP_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
      .then(data => data.json())
}

export default function Signin() {
  const classes = useStyles();
  const [email, setUserEmail] = useState();
  const [pseudo, setUserPseudo] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const response = await loginUser({
      pseudo,
      email,
      password
    });
    if ('token' in response) {
      swal("Success", "Welcome", "success", {
        buttons: false,
        timer: 2000,
      })
          .then(() => {
            sessionStorage.setItem('token', response['token']);
            window.location.href = "/home";
          });
    } else {
      let errors = ""
      response.errors.map(error => errors += `${error.msg}.\n`)
      swal("Failed", errors, "error")
    }
  }

  return (
      <Grid container className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} md={7} className={classes.image} />
        <Grid item xs={12} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form}  onSubmit={handleSubmit}>
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="pseudo"
                  name="pseudo"
                  label="Pseudo"
                  onChange={e => setUserPseudo(e.target.value)}
              />
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  onChange={e => setUserEmail(e.target.value)}
              />
              <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  onChange={e => setPassword(e.target.value)}
              />
              <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
              >
                Sign In
              </Button>
            </form>
          </div>
        </Grid>
      </Grid>
  );
}