let tasks = [
  { id: 1, title: "Hacer la compra", completed: true},
  { id: 2, title: "Sembrar trigo", completed: false },
  { id: 3, title: "Comprar zapatillas", completed: false }
];

export async function GET(request) {
  const url = new URL(request.url)
  const filter = url.searchParams.get("filter")

  let filterTasks = tasks;

  if (filter == 'completed'){
    filterTasks = tasks.filter((task) => task.completed)
  } else if (filter == 'incompleted'){
    filterTasks = tasks.filter((task) => !task.completed)
  }

  return new Response(JSON.stringify(filterTasks), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newTask = {
      id: tasks.length + 1,
      completed: false,
      ...body
    };

    if (!newTask.title) {
      return new Response(
        JSON.stringify({ error: "Titulo para la tarea requerido" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    tasks.push(newTask);
    return new Response(
      JSON.stringify({ message: "Tarea añadida correctamente", task: newTask }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error, no se ha podido realizar la petición" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return new Response(
        JSON.stringify({ error: "No se especifica el id de la tarea" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    let completed;
    tasks = tasks.map((task) => {
      if(task.id == body.id){
        completed = !task.completed;
        return {...task, completed: completed};
      }else{
        return task;
      }
    });
    return new Response(
      JSON.stringify({ message: "Tarea cambiada a ", completed }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error, no se ha podido realizar la petición" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();

    if (!body.id) {
      return new Response(
        JSON.stringify({ error: "No se especifica el id de la tarea" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    tasks = tasks.filter((task) => task.id != body.id);
    return new Response(
      JSON.stringify({ message: "Tarea eliminada" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error, no se ha podido realizar la petición" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
}