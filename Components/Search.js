
//Pour créer un component faut importer React
import React from 'react'
// Importer les components qu'on veut de reacte-native
import { StyleSheet, View, Button, TextInput, FlatList, Text, ActivityIndicator } from 'react-native'
import Films from '../Helpers/filmsData'
import FilmItem from './FilmItem'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
// Les components sont sous forme de classes



class Search extends React.Component {

  constructor (props){
    super(props)


    this.searchedText = ""  // Initialisation de notre donnée searchedText en dehors du state
    this.page = 0
    this.totalPages = 0



    this.state = {
      films: [],
      isLoading: false // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche

    }
  }

  _loadFilms() {
      if (this.searchedText.length > 0) { // Seulement si le texte recherché n'est pas vide
        this.setState({ isLoading: true })
        getFilmsFromApiWithSearchedText(this.searchedText).then(data => {
            this.setState({
              films: data.results,
              isLoading: false,
             })
        })
      }
  }

  _searchedTextInputChanged(text){
    this.searchedText = text // Modification du texte recherché à chaque saisie de texte, sans passer par le setState comme avant
  }

  _displayLaoding(){
    if (this.state.isLoading){
      return (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />

        </View>
      )
    }
  }


  render() {
    //console.log(this.state.isLoading)

    return(
      <View style={styles.main_container}>
        <TextInput style={styles.textInput}
        placeholder="Titre du film"
        onChangeText= {(text) => this._searchedTextInputChanged(text)}
        onSubmitEditing={() => this._loadFilms()}

        />

        <Button style={{ height: 50}} title="Rechercher" onPress={() => this._loadFilms()}/>

        <FlatList
          data={this.state.films} //Données qu'on souhaite afficher
          KeyExtractor={(item) => item.id.toString()}// Définir une clé unique pour le alignItems

          renderItem={({item}) => <FilmItem Films={item}/>  }          //rendu des données de notre liste en tant que templa
          onEndReachedThreshold={0.5}
          onEndReached={() => {
          console.log("onEndReached")
          }}



        />
        {this._displayLaoding()}
      </View>

    )

  }
}
//Externaliser le style : on peut utiliser 'textInput' dans un autre style
const styles = StyleSheet.create({

  main_container:{
    marginTop: 20,
    flex: 1
  },

  textInput: {
    marginLeft: 5,
    marginRight: 5,
    height: 50,
    borderColor: '#000000',
    borderWidth: 1,
    paddingLeft: 5

  },

  loading_container:{
  position: 'absolute',
   left: 0,
   right: 0,
   top: 100,
   bottom: 0,
   alignItems: 'center',
   justifyContent: 'center'
  }





})
//flex => pour que le vue occupe dynamiquement tout l'écran
//flexDirection : row => alignement en colonne
//justifyContent :center => pour centrer les vues sur l'axe Y
//alignItems :center =>  pour centrer les vues sur l'axe X



export default Search // pour pouvoir utiliser le component
