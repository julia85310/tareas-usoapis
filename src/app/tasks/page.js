'use client';
import {useState, useEffect} from 'react';

export default function TasksPage(){
  const emptyForm = {title: ''};
  const [tareas, setTareas] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [mensaje, setMensaje] = useState('');
  const [filter, setFilter] = useState('all');

  async function getData() {
    let url = "/api/tasks"

    if(filter !== "all"){
      url = url + "?filter=" + filter
    }
    const res = await fetch(url);
    const data = await res.json();
    setTareas(data);
  }

  useEffect( () => {
    getData()
   }, [filter])

   async function addTarea(e){
    e.preventDefault();
    if(!formData.title.trim()){
      setMensaje('Introduce el titulo de la tarea');
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje(`Tarea añadida: ${data.task.title}`);
        setFormData(emptyForm);
        getData();
      } else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje('Error estableciendo la conexión');
    }
   }

   async function updateTarea(idUpdate){
    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: idUpdate}),
      });

      const data = await res.json();

      if (res.ok) {
        getData();
      } else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje('Error estableciendo la conexión');
    }
   }

   async function deleteTarea(taskDelete){
    const result = window.confirm(`¿Deseas eliminar la tarea ${taskDelete.title}?`);
    if (!result) {
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/tasks", {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: taskDelete.id}),
      });

      const data = await res.json();

      if (res.ok) {
        getData();
      } else {
        setMensaje(`Error: ${data.error}`);
      }
    } catch (error) {
      setMensaje('Error estableciendo la conexión');
    }
   }


  return <div>
    <h1>Tareas</h1>
    <input type='radio' name='filtroTareas' defaultChecked value='all' onChange={() => setFilter('all')}/>Todas
    <input type='radio' name='filtroTareas' value='completed' onChange={() => setFilter('completed')}/>Completadas
    <input type='radio' name='filtroTareas' value='incompleted' onChange={() => setFilter('incompleted')}/>Incompletas
    <ul>
      {tareas.map((task) =>
        <li key={task.id}>
        <input type='checkbox' checked={task.completed} onChange={() => updateTarea(task.id)}></input>
        {task.completed? <s>{task.title}</s>: task.title}
        <button onClick={() => deleteTarea(task)}>Eliminar</button>
        </li>
      )}
    </ul>
    <h1>Añadir tareas</h1>
    <form onSubmit={(e) => addTarea(e)}>
      <input required type="text" placeholder="Introduce la tarea" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}></input>
      <input type="submit" value='Add'></input>
    </form>
    {mensaje}
  </div>
}