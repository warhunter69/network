
document.addEventListener('DOMContentLoaded', function() {

  //Newpost();
 
  
  
  });

function Newpost(){
  //document.querySelector('form').onsubmit = () => {
  const body = document.querySelector('#compose-body').value;
  console.log(body);
  fetch('/addpost', {
    method: 'POST',
    body: JSON.stringify({
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    
      console.log(result);

  });

//};
}


function like(id){
  div=document.querySelector(`#LC${id}`)
  button = document.querySelector(`#LB${id}`)
  
  but_type = button.textContent

  let likes_count = div.textContent
  var res = likes_count.split(" ");
  //console.log(but)
  if(but_type==="like"){
  res[1] = parseInt(res[1]) + 1
  button.textContent = "unlike"
  }
  else{
    res[1] = parseInt(res[1]) - 1
    button.textContent = "like"
  }
  div.textContent = `likes: ${res[1]}`
  fetch('/like', {
    method: 'POST',
    body: JSON.stringify({
        postid: id,
        
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
  });
  
  // button.addEventListener('click',()=>{
  //   console.log(id)
  //   unlike(id)
  // })
  
}


function edit(id){
  content_div = document.querySelector(`#content${id}`);
  initial_content = content_div.textContent;
  initial_node = content_div.childNodes[0];
  console.log(initial_content)
  const div = document.createElement('DIV');
  const form = document.createElement('FORM');
  const textarea = document.createElement("TEXTAREA");
  textarea.className = "form-control";
  textarea.setAttribute("id", `textarea${id}`);

  const SubmitButton = document.createElement('BUTTON');
  SubmitButton.className = "btn btn-primary";
  SubmitButton.textContent = "Submit";
  SubmitButton.setAttribute("type","submit");

  const CancelButton = document.createElement('BUTTON');
  CancelButton.className = "btn btn-primary";
  CancelButton.textContent = "Cancel";
  CancelButton.addEventListener('click',()=>{
    
    content_div.replaceChild(initial_node,div);

  })



  form.append(textarea);
  form.append(SubmitButton);
  //form.append(CancelButton);
  form.onsubmit = () =>{
    const new_content = textarea.value;
    console.log("submited",new_content)
    //content_div.textContent = new_content;
    content_div.innerHTML = `<p class="card-text blockquote mb-0">${new_content}<p>`
    fetch(`/edit/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
      content:  new_content
      })
     })
    return false;
  }
  div.append(form);
  div.append(CancelButton);
  content_div.replaceChild(div,content_div.childNodes[0])
}
