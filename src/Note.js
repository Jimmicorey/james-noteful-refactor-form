import React from 'react'
import AppContext from './AppContext'
import PropTypes from 'prop-types'

class Note extends React.Component {
    static contextType=AppContext;


    render() {
        const {
            currentNote,
            handleDeleteClick,
            //loading
        } = this.context

        if (currentNote === this.props.note.id) {    
            return(
                <>
                    <div 
                        onClick={(e)=>this.props.handleNoteSelect(e)} 
                        id={this.props.note.id} 
                        className='note'
                    >
                        <div className='note-name'>
                            {this.props.note.name}
                        </div>

                        {this.props.note.modified}

                        <button 
                            //disabled={loading} 
                            id={this.props.note.id} 
                            onClick={(e)=>handleDeleteClick(e)} 
                            type='button'
                        >
                            DELETE
                        </button>
                    </div> 

                    <div className='note-content'>
                        {this.props.note.content}
                    </div>
                </>
            )
        } else {
            return (
                <div 
                    onClick={(e)=>this.props.handleNoteSelect(e)} 
                    id={this.props.note.id} 
                    className='note'
                >

                    <div className='note-name'>
                        {this.props.note.name}
                    </div>

                    {this.props.note.modified}

                    <button 
                        //disabled={loading} 
                        id={this.props.note.id} 
                        onClick={(e)=>handleDeleteClick(e)} 
                        type='button'
                    >
                        DELETE
                    </button>
                </div>
            )
        }
    }
}

Note.childContextType = {
    currentNote: PropTypes.string.isRequired,
    handleDeleteClick: PropTypes.func.isRequired
}

Note.propTypes = {
    note: PropTypes.object.isRequired,
    handleNoteSelect: PropTypes.func.isRequired
}

export default Note