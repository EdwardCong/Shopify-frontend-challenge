import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { Grid, Card, Container, Button, TextField, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';

// styling
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  card: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    alignItems: "center",
    alignContent: "space-between"
  },
}));

// This was built on the assumption that the search only returns one movie, 
// because the API has only returned 1 movie when searching 
// by title in the API page example, however it is possible to scale this
// if the API ever returns more than one movie when searching
function App() {
  const classes = useStyles();

  const mykey = 'ffaff682'; // change this key to your own omdbAPI key
  const [filter, setFilter] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [nominatedList, setNominatedList] = useState([]);

  // hit api when filter is changed
  useEffect(() => {
    requestFilms();
  }, [filter])

  // change the filter for movie searches
  const changeFilter = e => {
    const value = e.target.value
    setFilter(value);
  }

  // hitting the api
  const requestFilms = () => {
    axios.get(`http://www.omdbapi.com/?t=${filter}&apikey=${mykey}`)
      .then(res => {
        setSearchResults(res.data)
      })
  }

  // check if movie is already nominated
  // useEffect(() => {
  //   if (nominatedList.Title.contains(searchResults.Title)) {

  //   }
  // }, [searchResults, nominatedList])

  // const nominateButton = () => {
  //   const button = 
  // };

  // fill data for search results
  const ResultsList = (props) => {
    const result = props.results;
    // check if the searched movie is in the nominations list by filtering the name
    let copyList = nominatedList;
    copyList = copyList.filter(item => item.Title === result.Title)
    // check if a movie was found or not, the API response will be True or False

    if (result.Response === 'True') {
      // if movie is already nominated grey out button
      if (copyList.length > 0) {
        return (
          <ul>
            <li>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <Typography>{result.Title} ({result.Year})</Typography>
                </Grid>
                <Grid item>
                  <Button variant='outlined' disabled>Nominate</Button>
                </Grid>
              </Grid>
            </li>
          </ul>
        )
      } else {
        return (
          <ul>
            <li>
              <Grid container direction="row" spacing={2}>
                <Grid item>
                  <Typography>{result.Title} ({result.Year})</Typography>
                </Grid>
                <Grid item>
                  <Button variant='outlined' color='primary' onClick={() => addNominee(result)}>Nominate</Button>
                </Grid>
              </Grid>
            </li>
          </ul>
        )
      }
      
      
    } else {
      return (
        <Typography>No Movies Found!</Typography>
      )
    }
  }

  // add the current search result 
  const addNominee = (e) => {
    const tempList = nominatedList;
    setNominatedList([...tempList, {...e, listId: tempList.length}]);
  }

  // remove nominee
  const removeNominee = (e) => {
    let tempList = nominatedList;
    tempList = tempList.filter(item => item.listId !== e)
    setNominatedList(tempList);
  }

  // fill the nominated movies card
  const NominatedMovies = (props) => {
    const nominated = props.nominated;
    // check if any movies have been nominated
    if (nominated.length > 0) {
      const nominees = nominated.map((nominee) =>
        <li>
          <Grid container direction="row" spacing={2}>
            <Grid item>
              <Typography>{nominee.Title} ({nominee.Year})</Typography>
            </Grid>
            <Grid item>
              <Button variant='outlined' color='primary' onClick={() => removeNominee(nominee.listId)}>Remove</Button>
            </Grid>
          </Grid>
        </li>
      )
      return (
        <ul>
          {nominees}
        </ul>
      )
    } else {
      return (
        <Typography>No Movies have been nominated yet!</Typography>
      )
    }
  }

  // display banner when 5 movies are nominated
  const Banner = () => {
    if (nominatedList.length === 5) {
      return (
        <Alert severity="success">Congratulations, you have completed your nomination list!</Alert>
      )
    } else {
      return null
    }
  }
  return (
    <Container>
      <Grid container spacing={3} direction="row">
        <Grid item xs={12}>
          <Banner />
          <h2> The Shoppies </h2>
          <form class="form-inline">
            <TextField
              id="outlined-basic"
              label="Search Title"
              variant="outlined"
              value={filter}
              onChange={changeFilter}
              fullWidth />
          </form>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            Results for "{filter}" <br /><br />
            <ResultsList results={searchResults} />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card className={classes.card}>
            Nominations <br /><br />
            <NominatedMovies nominated={nominatedList} />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
