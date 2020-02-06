import React, { Component } from 'react'
import api from '../api'

import {
  Title,
  Wrapper,
  Label,
  InputText,
  Button,
  CancelButton,
} from './styled-components/MoviesInsertSC'

class MoviesInsert extends Component {
  state  = {
      name: '',
      rating: '',
      time: '',
  }

  handleChangeInputName = async event => {
       const name = event.target.value
       this.setState({ name })
   }

   handleChangeInputRating = async event => {
       const rating = event.target.validity.valid
           ? event.target.value
           : this.state.rating

       this.setState({ rating })
   }

   handleChangeInputTime = async event => {
       const time = event.target.value
       this.setState({ time })
   }

   handleIncludeMovie = async () => {
       const { name, rating, time } = this.state
       const arrayTime = time.split('/')
       const payload = { name, rating, time: arrayTime }

       await api.insertMovie(payload).then(res => {
           window.alert(`Movie inserted successfully`)
           this.setState({
               name: '',
               rating: '',
               time: '',
           })
       })
   }

   render() {
       const { name, rating, time } = this.state
       return (
           <Wrapper>
               <Title>Create Movie</Title>

               <Label>Name: </Label>
               <InputText
                   type="text"
                   value={name}
                   onChange={this.handleChangeInputName}
               />

               <Label>Rating: </Label>
               <InputText
                   type="number"
                   step="0.1"
                   lang="en-US"
                   min="0"
                   max="10"
                   pattern="[0-9]+([,\.][0-9]+)?"
                   value={rating}
                   onChange={this.handleChangeInputRating}
               />

               <Label>Time: </Label>
               <InputText
                   type="text"
                   value={time}
                   onChange ={this.handleChangeInputTime}
               />

               <Button onClick={this.handleIncludeMovie}>Add Movie</Button>
               <CancelButton href={'/movies/list'}>Cancel</CancelButton>
           </Wrapper>
       )
   }
}

export default MoviesInsert
