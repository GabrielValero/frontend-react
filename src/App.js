import React, { Component } from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import axios from 'axios';
import './App.css';

class App extends Component{
    state ={
        tasks: [],
        producto: {
            name: '',
            price: '',
            url: '',
            images: '',
            description: ''
        }
    }
    async componentDidMount(){
        this.getUser();
    }
    getUser = async ()=>{
        const response = await axios.get(process.env.REACT_APP_API_URL);
        this.setState({tasks: response.data});
    }
    Saved = ()=>{
        const url = document.getElementById('url');
        const name = document.getElementById('name');
        const price = document.getElementById('price');
        const images = document.getElementById('image_url');
        const description = document.getElementById('description');
        this.state.producto = {
            name:name.value,
            price:price.value,
            url:url.value,
            images:images.value,
            description:description.value
        }

        document.getElementById('url').value = '';
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';
        document.getElementById('image_url').value = '';
        document.getElementById('description').value = '';
    }
    Send = async (e) =>{
        e.preventDefault();
        await this.Saved();
        if(document.getElementById('Submit').value === 'Submit'){
            fetch(process.env.REACT_APP_API_URL,{
                method: 'POST',
                body: JSON.stringify(this.state.producto),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res=>{
             console.log(res)
             })
            .catch(err=> console.log(err))
            await this.getUser();
        }
        else if(document.getElementById('Submit').value === 'Update'){
            const id = document.getElementById('id').innerHTML; 
            console.log(id);
            fetch(`${process.env.REACT_APP_API_URL}${id}`,{
                method: 'PUT',
                body: JSON.stringify(this.state.producto),
                headers:{
                    'Content-Type': 'application/json'
                }
            })
            .then(res=>{
             console.log(res)
             })
            .catch(err=> console.log(err))
            await this.getUser();
        }
        this.Cancel();
        this.getUser();
    }

    deleteTask = async (id)=>{
        fetch(`${process.env.REACT_APP_API_URL}${id}`,{
            method: 'DELETE'
        })
        .then(res=>{
         console.log(res)
         })
        .catch(err=> console.log(err))
        await this.getUser();
    }

    editTask = async (id)=>{
        const response = await axios.get(`${process.env.REACT_APP_API_URL}${id}`);
        document.getElementById('url').value = response.data[0].url;
        document.getElementById('name').value = response.data[0].name;
        document.getElementById('price').value = response.data[0].price;
        document.getElementById('image_url').value = response.data[0].images;
        document.getElementById('description').value = response.data[0].description;
        document.getElementById('Submit').value = 'Update';
        document.getElementById('Submit').setAttribute("class", "btn btn-info");
        document.getElementById('Submit').setAttribute("onClick", "");
        document.getElementById('titulo').innerHTML = `Edita <span id="id">${id}</span>` 
    }

    Cancel = ()=>{
        document.getElementById('titulo').innerHTML = `Añade Productos`
        document.getElementById('Submit').setAttribute("class", "btn btn-primary");
        document.getElementById('Submit').value = 'Submit';
        document.getElementById('url').value = '';
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';
        document.getElementById('image_url').value = '';
        document.getElementById('description').value = '';
    }
    render() {
        return (
           <Router>
            <div className="productos row">
                <div>
                     <form id="form" onSubmit={this.Send} className="card">
                        <h3 id="titulo">Añade Productos</h3>
                        <div className="form-row">
                            <div className="form-group col-8">
                                <label htmlFor="name">Name </label>
                                <input id="name" type="text" name="name" className="form-control" placeholder="Name" required/>
                            </div>
                            <div className="form-group col-4">
                                <label htmlFor="price">Price $ </label>
                                <input id="price" type="number" name="price" className="form-control" placeholder="price" required/>
                            </div>
                        </div>
                        <div className="form-group">
                            <input id="url" type="text"  name="url" className="form-control" placeholder="Url"/>
                        </div>
                        <div className="form-group">
                            <input id="image_url" type="text"  name="image" className="form-control" placeholder="Image Url"/>
                        </div>
                       <div className="form-group">
                           <label htmlFor="description">Description </label>
                           <textarea id="description"className="form-control" placeholder="Description" name="description" type="text"></textarea>
                       </div>
                       <input id="Submit" type="submit" className="btn btn-primary" value="Submit"/>
                       <input id="cancel" type="button" className="btn btn-danger ml-3" value="Cancel" onClick={this.Cancel}/>
                    </form>
                </div>
                {this.state.tasks.map(task => 
                    
                    <div className = "card" key={task._id}>
                        <img className="card-img-top" src="https://res.cloudinary.com/dh7v1lmgl/image/upload/v1592357034/998.jpg" alt="Card image cap"/>
                        <div className="card-body">
                            
                            <div className="form-group">
                                <h2 className="card-title">Name: {task.name}</h2>
                                <p className="card-text">Price: ${task.price}</p>

                            </div>
                            <p className="card-text">Description: {task.description}</p>
                            <p className="btn-link">{task.url}</p>
                            <input type="button" className="btn btn-primary mr-2" value="Edit"
                            onClick={() => this.editTask(task._id)}/>
                            <input type="button" className="btn btn-danger" value="Delete" 
                            onClick={() => this.deleteTask(task._id)}/>
                        </div>

                    </div>
                )}
            </div>
           </Router>
        );
    }
}


export default App;
