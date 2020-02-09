import React from 'react';
import {Form, Container, Button} from "semantic-ui-react";
import { useState } from 'react';
import axios from "axios";

function App() {

	const [file,setFile] = useState(null);
	const [gist,setGist] = useState(null);

	const handleSubmit = e => {
		e.preventDefault();
		if(file === null) return;
		let formData= new FormData();
		formData.append("case",file);
		axios.post("/api/case",formData,{
			headers : {
				'content-type': 'multipart/form-data'
			}
		})
		.then(res => setGist(res.data))
		.catch(err => console.error(err.response.data));
	}

	return (
		<Container>
			{gist === null?
				<Form onSubmit={handleSubmit}>
					<Form.Field>
						<label htmlFor="file">Submit the case File</label>
						<input onChange={({ target }) => { setFile(target.files[0]) }} type="file" />
					</Form.Field>
					<Button type="submit">Submit</Button>
				</Form>
				:
				JSON.stringify(gist)
			}
			
		</Container>
	);
}

export default App;