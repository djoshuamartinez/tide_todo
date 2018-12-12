import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class Task extends Component{
    constructor(props){
	super(props);
	this.state= {
	    editing: false,
	    updatedTask: props.task.name
	};
    }
    deleteTask(taskId){
	axios.delete('http://front-test.tide.mx/api/tasks/'+taskId).then(()=>{this.props.updater()});
    }
    updateTask(taskId){
	axios.put('http://front-test.tide.mx/api/tasks/'+taskId,{
	    name: this.state.updatedTask,
		limitDate: "2018-01-24T20:30",
		endDate: "2018-01-24T20:30"
	}).then(()=>{
	    this.props.updater();
	    this.setState({editing: false});
	});
	console.log('http://front-test.tide.mx/api/tasks/'+taskId);
	//axios.delete('http://front-test.tide.mx/api/tasks/'+taskId);
    }


    render(){
    return (
	<li className='list-group-item'>

	{this.state.editing?

	 <span>
	 <input type='text' onChange={e=>{
	     this.setState({updatedTask:e.target.value});
	 }} className='form-control'/>
	 <a href="#" onClick={e=>{this.updateTask(this.props.task.id)}}>Guardar</a><br/>
	    <a href="#" onClick={e=>{
		e.preventDefault();
		this.setState({editing: false});
	    }}>Cancelar</a>
	 </span>
	 :
	 <span>
	 <p>{this.props.task.name}
	 <a href="#" onClick={e=>{this.deleteTask(this.props.task.id)}}>&nbsp;x</a>&nbsp;
	    <a href="#" onClick={e=>{
		e.preventDefault();
		this.setState({editing: true});
	    }}>Editar</a>
</p>
	 </span>
	}
	    </li>
    );
    }
}

class TaskList extends Component{
    constructor(props){
	super(props);
	this.state = {
	    newTask: ''
	}
    }
    saveTask(listId){
	axios.post('http://front-test.tide.mx/api/tasks',{
	    name: this.state.newTask,
	    taskList: listId,
	    limitDate: "2018-01-24T20:30",
	    endDate: "2018-01-24T20:30"
 }).then(res=>{
     this.setState({newTask: ''});
     this.props.updater();
});
    }

    render(){
    return (
	    
	<div className='panel panel-default task-list'>
	    <div className='panel-heading'>
	    <h4 className='panel-title'>{this.props.list.name}</h4>
	    </div>
	    <div className='panel-body'>
	    <form className='input-group'>
	    <input type='text' className=' form-control' onChange={e=>{
		console.log(e.target.value);
		this.setState({newTask: e.target.value});
	    }}/>
	    <a className='btn btn-success input-group-addon' onClick={e=>{
		e.preventDefault();
		this.saveTask(this.props.list.id);
	    }}>Guardar</a>
	    </form>
	    <ul className='list-group'>
	    {this.props.list.tasks.map(t=>{
		return <Task key={t.id} task={t} updater={this.props.updater}/>;
	    })}
	</ul>
	</div>
	</div>
    );
    }
}

class App extends Component {
    constructor(props){
	super(props);
	this.state = {tasksList:[], newList:''};
    }

    updateAll(){
	axios.get('http://front-test.tide.mx/api/task_lists').then(res=>{

	    var tasks = res.data;
	    this.setState({
		tasksList: tasks
	    });
	});

    }
    componentDidMount(){
	this.updateAll();
    }

    saveList(){
	axios.post('http://front-test.tide.mx/api/task_lists', {name: this.state.newList})
	    .then(res=>{
		this.setState({
		    tasksList: [...this.state.tasksList, res.data]});
	    });


    }

  render() {
    return (
      <div className="App">
	    <h1>To-Do List</h1>
	    
	<div className="row">
	<div className="col-sm-2 side-bar" >
	    <div className='input-group'>
	    <input type='text' className="form-control" onChange={e=>{
		this.setState({newList: e.target.value});
	    }}/>
	    <a href="#" className="btn btn-success input-group-addon" onClick={e=>{this.saveList()}}>Agregar lista</a>
	    </div>
	    </div>
	    <div className="col-sm-2"></div>
	    <div className="main-section panel-group col-sm-6">
	    {this.state.tasksList.map(tl=>{
		return <TaskList updater={()=>{this.updateAll()}} key={tl.id} list={tl}/>;
	    })}
	</div>
	    </div>
      </div>
    );
  }
}

export default App;
