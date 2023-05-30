import React from "react";
import { Image } from '@aws-amplify/ui-react';
import DeleteIcon from '@mui/icons-material/Delete';

function Note (props){
    function handleClick(){
        props.onDelete(props.id, props.name);

    }
    return (<div className="note">
         <h1>{props.name}</h1>
         <p>{props.description}</p>
        {props.image && <Image src={props.image} />}
         <button onClick={handleClick}><DeleteIcon /></button>
    </div>
    );
}

export default Note;
