import React from 'react'
import Header from './Header'
import Folders from './Folders'
import Notes from './Notes'
import {Route, withRouter} from 'react-router-dom'
import AppContext from './AppContext'
import AddFolder from './AddFolder'
import AddNote from './AddNote'
import ErrorBoundary from './ErrorBoundary'

class App extends React.Component{
  state = {
    currentFolder: null,
    currentNote: null,
    folders: [],
    notes: [],
    noteFields: {
      name: {
        value: '',
        //touched: false,
      },
      content: {
        value: '',
        //touched: false,
      },
      folderName: {
        value: '',
        //touched: false,
      }
    },
    folderField: {value: '', touched: false},
    //loading: false
  }

  //When App mounts FETCH folders & notes database, assign them to state
  componentDidMount() {
    this.setState( {loading: true} )
    fetch(`http://localhost:9090/db`)
    .then(response => response.json())
    .then(data => {
      this.setState( {
        ...data,
        currentFolder: null,
        currentNote: null,
        loading: false
      })
    })
  }

  //FOLDER click
  handleFolderSelect = (e) => {
    this.setState( {
      currentFolder: e.target.id,
      currentNote: null
    })
    this.props.history.push(`/folders/${e.target.id}`)
  }

  //NOTE click
  handleNoteSelect = (e) => {
    this.setState( {currentNote: e.currentTarget.id} )
    this.props.history.push(`/notes/${e.currentTarget.id}`)
  }

  //HEADER click
  handleClickHeader= () => {
    this.setState( {currentNote: null, currentFolder: null} )
    this.props.history.push(`/`)
  }

  //BACK click
  handleBackClick= () => {
    this.setState( {currentNote: null} )
    this.props.history.goBack()
  }

  //DELETE click
  handleDeleteClick = (e) => {
    e.stopPropagation();
    const noteId = e.target.id;
    this.setState({
      loading:true
    })
    fetch(`http://localhost:9090/notes/${e.target.id}`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    })
    .then(response=>response.json())
    .then(() => {
      let newNotes = this.state.notes
     
      newNotes = newNotes.filter(note => note.id !== noteId)

      this.setState({
        notes: newNotes,
        currentNote:null,
        loading:false
      }, () => this.props.history.goBack() )
    })
  }

  //ADD FOLDER button click
  handleAddFolder = (e) => {
    this.props.history.push('/addfolder')
  }

  //ADD NOTE click
  handleAddNote = (e) => {
    this.props.history.push('/addnote')
  }

  //NEW NOTE submit
  handleAddNoteSubmit = (e) => {
    e.preventDefault();

    const {name, content} = this.state.noteFields;
    const id = e.target.closest('form').folderName.value;
    const date = new Date(Date.now());
    const newNote = {
      name: name.value,
      content: content.value,
      folderId: id,
      modified: date.toISOString()
    };

    this.setState( {loading: true} )

    fetch('http://localhost:9090/notes',{
      method:'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newNote)
    })
      .then(response => response.json())
      .then((result)=> {
        let newNotes=this.state.notes;
        newNotes.push(result);
        this.setState({
          notes: newNotes,
          loading: false,
          noteFields: {
            name: {
              value: '',
              touched: false,
            },
            content: {
              value: '',
              touched: false,
            },
            folderName: {
              value: '',
              touched: false,
            }
          }
        })
      }
    )

    this.props.history.goBack();
  }

  //UPDATE NOTE
  handleUpdateNoteFields = (e) => {
    let newNoteFields = this.state.noteFields
    newNoteFields[e.target.id].value = e.target.value;
    newNoteFields[e.target.id].touched = true;
    this.setState( {noteFields: newNoteFields} );     
  }

  //NEW FOLDER submit
  handleFolderSubmit = (e) => {
    e.preventDefault();
    const newFolder = {name: e.target.folderName.value}
    fetch('http://localhost:9090/folders', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(newFolder)
    })
    .then(response => response.json())
    .then((result) => {
      let newFolders = this.state.folders
      newFolders.push(result)
      this.setState({
        folders: newFolders,
        folderField: {value: '', touched: false} //<--- touched???
      })
    })  
    this.props.history.goBack();

  }

  //UPDATE FOLDER
  handleFolderFormOnChange = (e) => {
    let newFolderField = this.state.folderField;
    newFolderField.value = e.target.value;
    newFolderField.touched = true;
    this.setState({folderField: newFolderField});
  }

  render(){
    return (
      <AppContext.Provider value = { {
        folders:this.state.folders,
        notes:this.state.notes,
        currentFolder:this.state.currentFolder,
        currentNote:this.state.currentNote,
        handleClickHeader: this.handleClickHeader,
        handleDeleteClick: this.handleDeleteClick,
        handleAddFolder: this.handleAddFolder,
        handleAddNote: this.handleAddNote,
        handleAddNoteSubmit: this.handleAddNoteSubmit,
        handleUpdateNoteFields: this.handleUpdateNoteFields,
        noteFields: this.state.noteFields,
        handleFolderSubmit:this.handleFolderSubmit,
        handleFolderFormOnChange:this.handleFolderFormOnChange,
        folderField: this.state.folderField,
        loading:this.state.loading
      }}>

        <div className = 'App'>
          <ErrorBoundary>

          <Header />

          <main>
            {/* ROUTE - HOME FOLDERS */}
            <Route exact 
              path = '/' 
              render = {() => <Folders handleFolderSelect={this.handleFolderSelect}/>}
            />

            {/* ROUTE - HOME NOTES */}
            <Route
              exact
              path = '/'
              render = {() => <Notes 
                                currentFolder = {this.state.currentFolder} 
                                handleNoteSelect = {this.handleNoteSelect} 
                                currentNote = {this.state.currentNote} 
                                notes = {this.state.notes}
                              />
              }
            />
            
            {/* ROUTE - FOLDER */}
            <Route
              exact
              path = '/folders/:folderId' 
              render = {() => <Folders 
                                currentFolder = {this.state.currentFolder}    
                                handleFolderSelect = {this.handleFolderSelect}
                              />
              } 
            />

            {/* ROUTE - NOTES in FOLDER */}
            <Route
              path = '/folders/:folderId'
              render = {() => <Notes 
                                currentFolder = {this.state.currentFolder} 
                                handleNoteSelect = {this.handleNoteSelect} 
                                currentNote = {this.state.currentNote} 
                                notes = {this.state.notes}
                              />
              }
            />

            {/* ROUTE - NOTE */}
            <Route
              exact
              path = '/notes/:noteId' 
              render = {(routeProps) => <Folders 
                                          {...routeProps} 
                                          handleBackClick = {this.handleBackClick} 
                                          handleFolderSelect = {this.handleFolderSelect} 
                                        />
              } 
            />

            {/* ROUTE - NOTE */}
            <Route
              exact
              path = '/notes/:noteId'
              render = {() => <Notes 
                                currentFolder = {this.state.currentFolder}
                                handleNoteSelect = {this.handleNoteSelect} 
                                currentNote = {this.state.currentNote} 
                                notes = {this.state.notes}
                              />
              }
            />

            {/* ROUTE - ADD FOLDER */}
            <Route
              path = '/addfolder'
              render = {() => <AddFolder />}
            />

            {/* ROUTE - ADD NOTE */}
            <Route
              path = '/addnote'
              render = {() => <AddNote />}
            />  
          </main>

          </ErrorBoundary>
        </div>

      </AppContext.Provider>

    )
  }
}

export default withRouter(App)