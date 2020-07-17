import React from 'react'
import AppContext from './AppContext'
import PropTypes from 'prop-types'

class AddNote extends React.Component {

    static contextType = AppContext;

    render () {
        const {
            handleAddNoteSubmit, 
            handleUpdateNoteFields, 
            //noteFields, 
            folders, 
            currentFolder, 
            //loading
        } = this.context;

        let validation = [];
        
        ////////////////////////////////////////////////////
        ////////////////////////////////////////////////////
        /*
        if (noteFields.name.value.length === 0 && noteFields.name.touched === true) {
            validation.push('Your Note Needs A Name');
        }

        if (noteFields.folderName.touched === true && folders.find(folder => folder.id === noteFields.folderName.value) === undefined){
            validation.push('Please Choose Another Folder');
        }

        validation = validation.map((requirement, index)=>{
            return(
                <li key = 'index'>
                    {requirement}
                </li>
            )
        })
        */
        //////////////////////////////////////////////////////
        //////////////////////////////////////////////////////

        let options=folders.map((folder,i) => {
            let option
            let currentFolderId
            if (currentFolder) {
                currentFolderId=folders.find((folder) => folder.id === currentFolder).id
                if (folder.id === currentFolderId) {
                    option=<option key={i} value={folder.id}>{folder.name}</option>
                } else {
                    option=<option key={i} value={folder.id}>{folder.name}</option>
                }
            } else {
                option=<option key={i} value={folder.id}>{folder.name}</option>
            }
            
            return (
                option                
            )
        })
        /*
        let disabled = false;
        if (validation.length !== 0 || noteFields.name.touched === false || loading === true) {
            disabled = true
        }
        */
        /////////////////////////////////////////////////////////
        
        return (
            <div>
                <form onSubmit={e=>handleAddNoteSubmit(e)}>
                    <legend></legend>

                    <fieldset>
                        <div>
                            <label htmlFor='name'>
                                What's it called:  
                            </label>

                            <input 
                                name='name' 
                                id='name' 
                                onChange={e=>handleUpdateNoteFields(e)}
                                required
                            >
                            </input>
                        </div>

                        <div>
                            <label>What's in it:  </label>
                            <input 
                                id='content' 
                                onChange={e=>handleUpdateNoteFields(e)}
                                required
                            >
                            </input>
                        </div>

                        <div>
                            <label>Where's it go:  </label>
                            <select 
                                id='folderName' 
                                onChange={e=>handleUpdateNoteFields(e)}
                            >
                                {options}
                            </select>
                        </div>

                        <button 
                            type='submit' 
                            //disabled={disabled}
                        >
                            SAVE
                        </button>
                    </fieldset>
                </form>

                <ul>
                  {validation} 
                </ul>
            </div>
        )
    }
}

AddNote.childContextType = {
    handleAddNoteSubmit: PropTypes.func.isRequired, 
    handleUpdateNoteFields: PropTypes.func.isRequired, 
    noteFields: PropTypes.object.isRequired,
    folders: PropTypes.array.isRequired
}

export default AddNote