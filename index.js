var Redux       = window.Redux,
    createStore = Redux.createStore;

var ADD = 'ADD', UPDATE = 'UPDATE', DELETE = 'DELETE', FILTER = 'FILTER';

//Actions REDUX
/*
* ADD PERSONA
* Agregar una persona
*/
function addPersona(persona){
	return {
		type: ADD,
		persona: persona
	}
}

/*
* FILTER TABLE
* Filtrar la tabla
*/
function filterTableByArea(area){
	return {
		type: FILTER,
		area: area
	}
}

/*
* UPDATE PERSONA
* Actualizar una persona
*/
function updatePersona(persona){
	return {
		type: UPDATE,
		persona: persona
	}
}
/*
* DELETE PERSONA
* Eliminar una persona
*/
function deletePersona(personaId){
	return {
		type: DELETE,
		id: personaId
	}
}

function applyFilterTable(todos, area){
	var tableBody = document.getElementById('todolist')

	while(tableBody.firstChild) {
  tableBody.removeChild(tableBody.firstChild)
 }

	if(area === 'todo'){
		todos.forEach(function(persona){
			return addTablePersona(persona)
		})
	}else{
		todos.filter(function(persona){
			return persona.area === area
		}).forEach(function(persona){
		 return addTablePersona(persona)
		})
	}
}

function updateTablePersona(todos, personaUpdate){
	return todos.map(function(persona){
		if(persona.id === personaUpdate.id){

			var newPersona = {}

			if(personaUpdate.name){
				newPersona.name = personaUpdate.name
				var cellName = persona.tableRow.firstChild
				while(cellName.firstChild){
					cellName.removeChild(cellName.firstChild)
				}

				cellName.appendChild( document.createTextNode(personaUpdate.name) )
			}

			if(personaUpdate.area){
				newPersona.area = personaUpdate.area
				var cellArea = persona.tableRow.childNodes[1]
				while(cellArea.firstChild){
					cellArea.removeChild(cellArea.firstChild)
				}

				cellArea.appendChild( document.createTextNode(personaUpdate.area) )
			}

			return Object.assign({}, persona, newPersona)
		}
		return persona
	})
}

function todoList(state, action){
	state = state || {
		todos: []
	}

	switch(action.type){
		case ADD:
		 if(!action.persona.id){
		 	action.persona.id = state.todos.length + 1
		 }
		 return Object.assign({}, state, {
		 	todos: state.todos.concat(action.persona)
		 })
		case FILTER: 
		 applyFilterTable([].concat(state.todos), action.area)
		 return state
		case UPDATE:
		 return Object.assign({}, state, {
		 	todos: updateTablePersona(state.todos, action.persona)
		 })
		case DELETE: 
		 return Object.assign({}, state, {
		 	todos: deleteTablePersona(state.todos, action.id)
		 })
		default: 
			return state
	}
	return state
}

var store = createStore(todoList)

function deleteTablePersona(todos, idPersona){
	var prevTodos = todos,
	    buttonBack = document.getElementById('button-back');
	    
	return todos.filter(function(persona){
		if(persona.id === idPersona){
			persona.tableRow.parentNode.removeChild(persona.tableRow)
		}
		return persona.id !== idPersona
	})
}

function filterTodo(e){
	var select = e.target || this
	var area = select.value

	store.dispatch( filterTableByArea(area) )
}

function addTodo(e){
	if(e && ( e.preventDefault || e.stopPropagation ) ){
		e.preventDefault() && e.stopPropagation()
	}

	var inputName = document.getElementById('inputName'),
	    selectArea = document.getElementById('selectArea'),
	    name = inputName.value,
	    area = selectArea.value,
	    persona = {
	    	name: name,
	    	area: area
	    };

	 var storePersona = addTablePersona(persona)
	 store.dispatch(addPersona(storePersona))

	 inputName.value = ''
}

/*
* Manejadores de los eventos para los botones de las personas
*/

/*
* UPDATE PERSONA
*/
function handleUpdatePersona(persona){
	var formUpdate = document.getElementById('form-add-persona'),
	    inputName = document.getElementById('inputName'),
	    selectArea = document.getElementById('selectArea'),
	    buttonCalcel = document.createElement('button'),
	    btnAdd = document.getElementById('btn-add');

	    function changeUpdateToAdd(){
	    	formUpdate.onsubmit = addTodo
	    	formUpdate.removeChild(buttonCalcel)
		    while(btnAdd.firstChild){
		    	btnAdd.removeChild(btnAdd.firstChild)
		    }

		    btnAdd.appendChild( document.createTextNode('Agregar') )
	    	inputName.value = ''
	    }

	    buttonCalcel.setAttribute('class', 'btn btn-default')
	    buttonCalcel.appendChild( document.createTextNode('Cancelar') )

	    buttonCalcel.onclick = changeUpdateToAdd

	    formUpdate.appendChild(buttonCalcel)
	    while(btnAdd.firstChild){
	    	btnAdd.removeChild(btnAdd.firstChild)
	    }

	    btnAdd.appendChild( document.createTextNode('Modificar') )

	    inputName.value = persona.name
	    selectArea.value = persona.area


	formUpdate.onsubmit = function(e){
		e.preventDefault()
		var newPersona = Object.assign({}, persona, {name: inputName.value, area: selectArea.value})
		store.dispatch(updatePersona(newPersona))

		changeUpdateToAdd()
	}

}

/*
* DELETE PERSONA
*/
function handleDeletePersona(idPersona){
	return store.dispatch(deletePersona(idPersona))
}

//Agregar una fila a tabla con la nueva persona
function addTablePersona(persona){
	var table = document.getElementById('todolist'),
	    tableRow = document.createElement('tr'),
	    tableCellName = document.createElement('td'),
	    tableCellArea = document.createElement('td'),
	    tableCellTools = document.createElement('td'),
	    buttonUpdate = document.createElement('button'),
	    buttonDelete = document.createElement('button');

	   buttonDelete.appendChild( document.createTextNode('Eliminar') )
	   buttonUpdate.appendChild( document.createTextNode('Actualizar') )

	   buttonDelete.setAttribute('class', 'btn btn-default')
	   buttonUpdate.setAttribute('class', 'btn btn-default')

	   buttonDelete.onclick = function(){
	   	handleDeletePersona(persona.id)
	   }

	   buttonUpdate.onclick  = function(){
	   	handleUpdatePersona(persona)
	   }

	  tableCellArea.appendChild( document.createTextNode(persona.area) )
	  tableCellName.appendChild( document.createTextNode(persona.name) )
	  tableCellTools.appendChild( buttonUpdate )
	  tableCellTools.appendChild( buttonDelete )
	 tableRow.appendChild(tableCellName)
	 tableRow.appendChild(tableCellArea)
	 tableRow.appendChild(tableCellTools)
	table.appendChild(tableRow)
	persona.tableRow = tableRow
 return persona
}

function showState(){
	console.log(store.getState())
}

store.subscribe(showState)