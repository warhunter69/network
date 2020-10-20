
document.addEventListener('DOMContentLoaded', function() {

  console.log("eeeeee");
  Newpost();
  Allposts();
    
  });


function Allposts(){
 //console.log(mailbox);
 console.log("s");
  fetch('/allposts')
  .then(response => response.json())
  .then(posts => {
      
    
      // ... do something else with emails ...
      
     
      var u = null
      try{
        u =  document.querySelector('#username').textContent;
      }catch(err)
      {
        console.log("error")
      }
     

      for (i = 0; i < posts.length; i++) {
        const Adiv = document.createElement('div');
        const div = document.createElement('div');
        const h5 =  document.createElement('H5');
        const a = document.createElement('a');
        
        a.innerHTML=`${posts[i]['user']}`;
      
        a.href = `profile/${posts[i]['user']}`
        h5.append(a)
        div.innerHTML = `${posts[i]['timestamp']} <br> <p>${posts[i]['content']}</p> `

        Adiv.style.border = "thin solid black";
        Adiv.style.padding = "0px 0px 0px 5px";
        Adiv.style.margin = "50px";
        
        Adiv.setAttribute("id", `id${posts[i]['id']}`);
        
        const username = posts[i]['user'];
        const id = posts[i]['id']
        const likers = posts[i]['likers']
        Adiv.className = "bg-white";
        Adiv.append(h5);
        Adiv.append(div);
        const lc = document.createElement('div');
        lc.textContent =`likes:${likers.length}`;
        
        Adiv.append(lc)
        if(u  !=  null){
        const but = document.createElement('BUTTON');
        //const editbutton = document.createElement('BUTTON');

        if(u === username){
          const editbutton = document.createElement('BUTTON');
          editbutton.textContent = 'edit';
          editbutton.className = "btn btn-primary";
          editbutton.addEventListener('click', ()=>{
            edit(id);
          })
          Adiv.append(editbutton);
        }
     
        
        //console.log(u)
        //but.style.margin = "1px";
        but.textContent = 'Like 👍 ';
        
        
        
       
        if(likers.includes(u)){
          
          but.className = "btn btn-primary";
        }
        else{
          but.className = "btn btn-sm btn-outline-primary";
        }
        //but.className = "btn btn-sm btn-outline-primary";
        but.addEventListener('click', ()=>{
          if(likers.includes(u)){
            var index = likers.indexOf(u);
            likers.splice(index, 1);
            console.log("out");
            but.className = "btn btn-sm btn-outline-primary";
          }
          else{
            console.log("in");
            likers.push(u);
            but.className = "btn btn-primary";
          }
          console.log(likers);
          like(id);
          lc.textContent =`likes:${likers.length}`;
          
        });
        
        
        
        Adiv.append(but);
      }
      
         
        
        
        
        document.querySelector('#posts_view').append(Adiv);
      }
      
  });



}


function Newpost(){
    if(document.querySelector('form')){
    document.querySelector('form').onsubmit = function() {

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
    
    };
    
  }
  

}


function like(id){

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



}

function edit(id){
  console.log(id)
  idn=`#id${id}`
  console.log(`#id${id}`);
  div= document.querySelector(idn);
  children = div.childNodes;
  ptag = children [1].childNodes;
  pvalue = ptag[3].textContent;
  const form = document.createElement('FORM');
  const textarea = document.createElement("TEXTAREA");
  textarea.className = "form-control";
  textarea.setAttribute("id", `textarea${id}`);
  const SubmitButton = document.createElement('BUTTON');
  SubmitButton.className = "btn btn-primary";
  SubmitButton.textContent = "Submit";
  SubmitButton.setAttribute("type","submit");
  //x = ptag[3];
  form.append(textarea);
  form.append(SubmitButton);

  form.onsubmit =  function(){
    console.log(textarea.value,id)
    const content = textarea.value
    p = document.createElement("p");
    p.append(content)
    children [1].replaceChild(p, ptag[3]);

    fetch(`/edit/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
      content:  content
      })
     })
    return false
  };
  
   
  //class="form-control" id="compose-body" placeholder="Body"
  //h5.textContent  ="hello"

  console.log(pvalue);

  children [1].replaceChild(form, ptag[3]);
}
