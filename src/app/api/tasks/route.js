let tasks = [
  { id: 1, title: "Hacer la compra", completed: true},
  { id: 2, title: "Sembrar trigo", completed: false },
  { id: 3, title: "Comprar zapatillas", completed: false }
];

export async function GET() {
  return new Response(JSON.stringify(tasks), {
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