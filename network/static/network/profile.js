document.addEventListener('DOMContentLoaded', function() {
Allposts();
});

function Allposts(){
 
    ////
    name=document.querySelector('#UserName').textContent;
    
    
     fetch(`/allposts/${name}`)
    ////
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
           //<a  href="{% url 'categoryitems'  l.category %}">{{ l.category }}</a>
           const a = document.createElement('a');
           
           a.innerHTML=`${posts[i]['user']}`;
         
           a.href = `profile/${posts[i]['user']}`
           h5.append(a)
           div.innerHTML = `${posts[i]['timestamp']} <br> <p>${posts[i]['content']}</p> `
   
           Adiv.style.border = "thin solid black";
           Adiv.style.padding = "0px 0px 0px 5px";
           Adiv.style.margin = "50px";
           
           Adiv.setAttribute("id", posts[i]['id']);
           
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
           
        
           
           //console.log(u)
           //but.style.margin = "1px";
           but.textContent = 'Like';
           
           
           
          
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
  