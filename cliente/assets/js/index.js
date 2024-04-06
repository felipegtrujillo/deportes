
const nombre = document.getElementById("nombre");
const precio = document.getElementById("precio");
const btnAdd = document.getElementById("btnAdd");
const btnDelete = document.getElementById("btnDelete"); 
const btnConsulta = document.getElementById("btnGet");
const btnEditar = document.getElementById("btnEditar");

let idsProcesados = [];

btnAdd.addEventListener("click", async function (event) {
    event.preventDefault();
  
    try {   
      const nombreDeporte  = nombre.value;
      const precioDeporte  = precio.value;

      const regexLetras = /^[A-Za-zÁÉÍÓÚáéíóúÜüÑñ\s]+$/;
      const regexNumeros = /^[0-9]+$/;
  
      if (!regexLetras.test(nombreDeporte)) {
         alert("El nombre solo debe contener letras");
         throw new Error("El nombre solo debe contener letras");
      }

      if (!regexNumeros.test(precioDeporte)) {
        alert("El precio solo debe contener valores numericos");
        throw new Error("El precio solo debe contener valores numericos");;
     }
  
      if (!nombreDeporte) {
        throw new Error("Debes ingresar el nombre del deporte");
      }
      if (!precioDeporte) {
        throw new Error("Debes ingresar un precio valido");
      }
  
      const response = await fetch('http://localhost:3000/agregarDeporte', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre : nombreDeporte , precio: precioDeporte }),
      });
  
      const data = await response.json();
  
       try { (data.status === "ok") 
        console.log("Registro agregado correctamente.");
     
      } catch(error) {
        console.log("No se pudo guardar el deporte", data.error);

      }
    } catch (error) {
      console.log("Hubo un error:", error);
      // Aquí puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje al usuario
    }
  
  });
  
btnConsulta.addEventListener("click", async function (event) {
    event.preventDefault();
  
    try {   

      const response = await fetch('http://localhost:3000/consultaDeportes');
      const data = await response.json();
  
     try { (data.status === "ok") 
         // Obtener el cuerpo de la tabla
      const deportesLista = JSON.parse(data.response);
        // Obtener el cuerpo de la tabla
      const cuerpoTabla = document.getElementById('cuerpo');

    // Generar filas de la tabla con los datos del arreglo
     deportesLista.forEach((deporte, index) => {

  // Verificar si el ID ya está en el registro de IDs procesados
    if (!idsProcesados.includes(deporte.id)) {
    const fila = document.createElement('tr');
    fila.id = deporte.id;

      // Crear el evento click para la fila
    fila.addEventListener('dblclick', function() {

        const modalBody = document.getElementById('modal-content');
        const id    = document.getElementById('campoId');
        const nombre = document.getElementById('nombreModal');
        const precio = document.getElementById('precioModal');

        // Rellenar el contenido del modal con los datos de la fila
        id.value = deporte.id;
        nombre.value = deporte.nombre;
        precio.value = deporte.precio;

        $('#exampleModal').modal('show');
        
    });

      const idColumna = document.createElement('th');
      idColumna.setAttribute('scope', 'row');
      idColumna.textContent = deporte.id;

      const nombreColumna = document.createElement('td');
      nombreColumna.textContent = deporte.nombre;

      const precioColumna = document.createElement('td');
      precioColumna.textContent = `$${deporte.precio}`;

      const textoEdit= document.createElement('td');
      textoEdit.textContent = 'Doble Click para Editar';


      fila.appendChild(idColumna);
      fila.appendChild(nombreColumna);
      fila.appendChild(precioColumna);
      fila.appendChild(textoEdit); 

      cuerpoTabla.appendChild(fila);
     // Agregar el ID al registro de IDs procesados
      idsProcesados.push(deporte.id);   
    }
    console.log("ID's Procesados al Agregar" , idsProcesados);
    });
     
      } catch(error) {
        console.log("No se recibir la peticion", error);

      }
    } catch (error) {
      console.log("Hubo un error:", error);
      // Aquí puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje al usuario
    }
  
  });

  btnEditar.addEventListener("click", async function (event) {
    event.preventDefault()

    const campoID   = document.getElementById('campoId');
    const nombre = document.getElementById('nombreModal');
    const precio = document.getElementById('precioModal');

    try {   

        const id = campoID.value;
        const nombreDeporte  = nombre.value;
        const precioDeporte  = precio.value;
    
        if (!nombreDeporte) {
          throw new Error("Debes ingresar el nombre del deporte");
        }
        if (!precioDeporte) {
          throw new Error("Debes ingresar un precio valido");
        }

        const response = await fetch(`http://localhost:3000/editarPrecio?id=${id}&nombre=${nombreDeporte}&precio=${precioDeporte}`, {
            method: 'PUT'
          });
    
        const data = await response.json();
    
         try { (data.status === "ok") 
          alert("entreo ok");
       
        } catch(error) {
          console.log("No se pudo guardar el deporte", data.error);
  
        }
      } catch (error) {
        console.log("Hubo un error:", error);
        // Aquí puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje al usuario
      }

  });

  btnDelete.addEventListener("click", async function (event) {
    event.preventDefault()

    const campoID   = document.getElementById('idDeporte');

    try {   

        const idBorrar = campoID.value;
        console.log("idBorrar", idBorrar);
    
        if (!idBorrar) {
          throw new Error("Debes ingresar un ID");
        }

        const response = await fetch(`http://localhost:3000/borrarID?id=${idBorrar}`, {
            method: 'DELETE'
          });
    
        const data = await response.json();
    
         try { (data.status === "ok") 
          idsProcesados = idsProcesados.filter(item => item !== idBorrar);
          const fila = document.getElementById(idBorrar);
          fila.remove();
          console.log("ID's Procesados al borrar " , idsProcesados);
          alert("Registro Eliminado Correctamente");
       
        } catch(error) {
          console.log("No se pudo eliminar el deporte", data.error);
          alert("No se pudo eliminar el deporte, favor verifique que el ID exista.");
  
        }
      } catch (error) {
        console.log("Hubo un error:", error);
        // Aquí puedes manejar el error de acuerdo a tus necesidades, como mostrar un mensaje al usuario
      }
    
  });


  
  