const form = document.querySelector(".grocery-form");
const alert = document.querySelector(".alert");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false; //i am not editing
let editID = ""; //edit value is empty
//submit form
form.addEventListener("submit",addItem)
//clear items
clearBtn.addEventListener('click',clearItems)

// display items onload
window.addEventListener("DOMContentLoaded", setupItems);


function addItem(e){
    e.preventDefault();
    const value = grocery.value;

    const id = new Date().getTime().toString(); //this was used to create new id
    if(value && !editFlag){
        createListItem(id, value)
        //display alert
        displayAlert('item added to the list', 'success');
        //show container
        container.classList.add('show-container');
        // console.log(container)
        //add to local storage
        addToLocalStorage(id, value);
        //set back to default
        setBackToDefault()
    }else if(value && editFlag){
        console.log('editing');
        editElement.innerHTML = value; //the edit elemt is now the grocery value
        displayAlert("value changed", "success");

        // edit  local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else{
        displayAlert("Please enter value", "danger")
    }
}

    //display alert function, invoke it at the top 
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(function(){
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    }, 2000);
}

//clear items
function clearItems(){
    const items = document.querySelectorAll(".grocery-item");
    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item)
        })
    }
    container.classList.remove('show-container');

    displayAlert("empty list","danger");

    setBackToDefault();
    localStorage.removeItem('list');
   
}
//delete function
function deleteItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
  
    list.removeChild(element);
  
    if (list.children.length === 0) {
      container.classList.remove("show-container");
    }
    displayAlert("item removed", "danger");
  
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
  }

//edit functions
function editItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item by targeting the title class which is before the btn container
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML; //this makes what you want tp edit display in yhe placeholder
    console.log(grocery.value)
    editFlag = true;
    editID = element.dataset.id;

    submitBtn.textContent = "edit"
    console.log(element)
}


//set back to default function nd invoke it in the if statement
function setBackToDefault(){
    grocery.value = '';
    editFlag = false;
    editID = '';
    submitBtn.textContent ="submit";
}

//add to local storege function, nd invoke it in the if statement
function addToLocalStorage(id,value){
   const grocery ={id, value};
   let items = getlocalStorage();
//    console.log(items)
   items.push(grocery);
   localStorage.setItem('list' , JSON.stringify(items));
}


//REMOVE LOCALSTORAGE
function removeFromLocalStorage(id){
    let items = getlocalStorage();

  items = items.filter(function (item) {
    if (item.id !== id) {
      return item;
    }
  });

  localStorage.setItem("list", JSON.stringify(items));
}

//EDIT LOCALSTORAGE
function editLocalStorage(id, value){
    let items = getlocalStorage();

  items = items.map(function (item) {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list", JSON.stringify(items));
}

//GET LOCAL STORAGE
function getlocalStorage(){
   return localStorage.getItem('list') 
   ? JSON.parse(localStorage.getItem("list")) 
   : [];
}

//SET ITEMS

function setupItems(){
    let items = getlocalStorage();
    if(items.length> 0 ){
        items.forEach(function (item) {
            createListItem(item.id, item.value);
          });
        container.classList.add("show-container");
    }
}

function createListItem(id, value){
 //add the new element
 const element = document.createElement("article");
 //add the class, this class has been styled in css
 element.classList.add("grocery-item");
 //create the attribute
 const attr =  document.createAttribute("data-id")
 attr.value = id;
 //set node
 element.setAttributeNode(attr);
 element.innerHTML = `<p class="title">${value}</p>
                  <div class="btn-container">
                      <button type="button" class="edit-btn">
                          <i class="fas fa-edit"></i>
                      </button>
                      <button type="button" class="delete-btn">
                          <i class="fas fa-trash"></i>
                      </button>
                  </div>`;
  // add event listeners to both buttons;
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", deleteItem);
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click", editItem);              

  //append child to make the element display on the screen
  list.appendChild(element);
}