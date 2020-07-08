import React from 'react'
import AppContext from './AppContext'
import PropTypes from 'prop-types'

class Folder extends React.Component {
    static contextType=AppContext;

    render() {
        const {currentFolder} = this.context;

        if (currentFolder === this.props.id) {
                
                return (
                    <div onClick={(e)=>this.props.handleFolderSelect(e)} id={this.props.id} className='highlighted-folder'>
                        {this.props.name}
                    </div>
            )
        } else {
            return (
                <div className='folder-container'>
                        <div onClick={(e)=>this.props.handleFolderSelect(e)} id={this.props.id} className='folder'>
                            {this.props.name}
                        </div>           
                </div>
            )
        }
    }
}

Folder.childContextType = {
    currentFolder: PropTypes.string.isRequired
}

Folder.propTypes = {
    id: PropTypes.string.isRequired,
    handleFolderSelect: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
}

export default Folder