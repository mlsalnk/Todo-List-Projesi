// Tüm elementleri seçme
const form = document.querySelector("#todo-form"); //todoyu eklemek için ilk başta formu seçmemiz gerekiyor. Burada getelementbyId de kullanabiliriz. 
const todoInput = document.querySelector("#todo"); /* Buradaki inputu seçer. */
const todoList = document.querySelector(".list-group"); /* ul etiketini seçmemiz gerekiyor çünkü bunun içine ekleyeceğiz yani parent olarak seçmemiz gerekiyor. Burada class'ına göre seçebiliriz çünkü zaten bir tane list-group'umuz var.  */ 
const firstCardBody = document.querySelectorAll(".card-body")[0];  /* daha sonra buradaki kartımızı seçmemiz gerekiyor çünkü buraya bir tane alert ekleyeceğiz. Örneğin bir todo eklediğimiz zaman todo başarılı şekilde eklendi diye. O yüzden bunu da parent olarak seçmemiz gerekiyor. Yani ilk cardbody'i seçeceğiz. Queryselectorall diyoruz çünkü iki tane cardbody'imiz var ve bunun 0. indexini almak istiyoruz. */
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter"); /*Filter input alanını seçer */
const clearButton = document.querySelector("#clear-todos");

eventListeners();

 function eventListeners(){ // Tüm event listenerlar 
    form.addEventListener("submit",addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup",filterTodos);
    clearButton.addEventListener("click",clearAllTodos);
}
function clearAllTodos(e){
    if (confirm("Tümünü silmek istediğinizden emin misiniz?")) {
        // Arayüzden todoları temizleme
        // todoList.innerHTML = ""; tüm todoları siler ancak yavaş bir yöntemdir.Proje çok büyük değilse kullanılabilir.
        while(todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        localStorage.removeItem("todos"); // Local Storage'deki tüm todoları siler.Todos Application'da ki keydir. Key silinince local storage silinir.
    }

    


}
function filterTodos(e){
    const filterValue = e.target.value.toLowerCase(); // Küçük harfe çevirir.
    const listItems = document.querySelectorAll(".list-group-item"); // Classname'i li-group*item olan li'leri seçer.

    listItems.forEach(function(listItem){ // li'lerin üzerinde gezinir.
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1){
            // Bulamadı

            listItem.setAttribute("style","display : none !important");
        }
        else {
            listItem.setAttribute("style","display : block");
        }



    });
}
function deleteTodo(e){

    //  console.log(e.target); Cardbody'de nereye basıldığını verir

    if (e.target.className === "fa fa-remove"){
        e.target.parentElement.parentElement.remove();
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success","Todo başarıyla silindi...")
    }
        
}
function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if (todo === deletetodo){
            todos.splice(index,1); //Arrayden değerimizi silebiliriz.
        }

    })

    localStorage.setItem("todos",JSON.stringify(todos));

}
function loadAllTodosToUI(){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo){
        addTodoToUI(todo);
    })

}
function addTodo(e){
    const newTodo = todoInput.value.trim(); /* Inputun içindeki değeri alır trim=inputtaki baştaki ve sondaki boşlukları siler */
    if (newTodo === "") {
      
        showAlert("danger","Lütfen bir todo girin..."); // Eğer yeni todo boşsa bildirim göster fonksiyonu
    }
    else {
        addTodoToUI(newTodo); /* arayüze todoyu ekler*/
        addTodoToStorage(newTodo);
        showAlert("success","Todo başarıyla eklendi...")
    }
  

    e.preventDefault();
}
function getTodosFromStorage(){ //Storagedan Todoları Alma
    let todos;

    if (localStorage.getItem("todos") === null){
        todos = [];
    }
    else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;



}
function addTodoToStorage(newTodo){
   let todos = getTodosFromStorage();

   todos.push(newTodo);

   localStorage.setItem("todos",JSON.stringify(todos)); //Arrayleri stringe çevirmek için JSON.stringify kullanılır 


}
function showAlert(type,message){
    const alert = document.createElement("div") // Dinamik olarak div elementi oluşturur

    alert.className = `àlert alert-${type}`;

    alert.textContent = message;

    firstCardBody.appendChild(alert);

   // alert.remove(); Alert eklendikten çok kısa bir süre sonra silinir alerti göremeyiz

    // setTimeout Method - Belli bir saniye verdikten sonra bildirimi siler
    setTimeout(function(){
        alert.remove(); //1000 ms yani 1 sn sonra bildirimi silicek.
    },1000);


}
function addTodoToUI(newTodo){ // String değerini list item olarak UI'ya ekleyecek.
/*
<li class="list-group-item d-flex justify-content-between">
                            Todo 1
                            <a href = "#" class ="delete-item">
                                <i class = "fa fa-remove"></i>
                            </a>

                        </li>
*/
// List Item Oluşturma
const listItem = document.createElement("li"); /* Yeni bir li elementi yaratır */
// Link Oluşturma
const link = document.createElement("a"); /* li'nin içindeki linki oluşturur */
link.href = "#";/* linke href özelliği verir */ 
link.className = "delete-item"; /*linke classname verir */
link.innerHTML = "<i class = 'fa fa-remove'></i>";

listItem.className = "list-group-item d-flex justify-content-between"; //List Item'a classname verir

// Text Node Ekleme

listItem.appendChild(document.createTextNode(newTodo));
listItem.appendChild(link); // Oluşturduğumuz linki ekler

// Todo List'e List Item'ı ekleme
todoList.appendChild(listItem);
todoInput.value = ""; // Inputa değer girdikten sonra inputtaki değeri siler. T

}