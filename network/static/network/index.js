
document.addEventListener('DOMContentLoaded', function() {

  console.log("eeeeee");
  Newpost();
  Allposts();
    
  });


function Allposts(){
 //console.log(mailbox);
  fetch('/allposts')
  .then(response => response.json())
  .then(posts => {
      
  
      // ... do something else with emails ...
      
      
      for (i = 0; i < posts.length; i++) {
        var Adiv = document.createElement('div');
        var div = document.createElement('div');
        var h5 =  document.createElement('H5');
        h5.innerHTML = `${posts[i]['user']}`;
        div.innerHTML = `<br> ${posts[i]['timestamp']} <br> <p>${posts[i]['content']}</p> `

        Adiv.style.border = "thin solid black";
        Adiv.style.padding = "0px 0px 0px 5px";
        Adiv.style.margin = "50px";
        
        Adiv.setAttribute("id", posts[i]['id']);
        
        const username = posts[i]['user'];
        //  const id = posts[i]['id']
        
        h5.addEventListener('click', ()=>{
          profile(username);
        });
        Adiv.append(h5);
        Adiv.append(div);
        
        document.querySelector('#posts_view').append(Adiv);
      }
      
  });



}


function Newpost(){

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
          // Print result
          console.log(result);
         
          
      });
    //   load_mailbox('sent')
        return false;
      
      
      
      
    };
    Allposts();
}

function profile(username){
  document.querySelector('#profile_view').style.display = 'block';
  document.querySelector('#posts_view').style.display = 'none';
  document.querySelector('#Newpost_view').style.display = 'none';

  console.log(username)
  fetch(`/profile/${username}`)
  .then(response => response.json())
  .then(user => {

    var div = document.createElement('div')
    div.style.margin = "50px";
    div.innerHTML = `<br> <h3>${user['username']}</h3> <br> ${user['email']} <br>data joined: ${user['date_joined']} <br>following: ${user['following']} followers: ${user['followers']}`
    console.log(user)
    const but = document.createElement('BUTTON');
    but.className = "btn btn-sm btn-outline-primary";
    but.style.margin = "1px";
    but.textContent = 'Follow';
    
    document.querySelector('#profile_view').append(div);
    document.querySelector('#profile_view').append(but);
    console.log(document.querySelector('#username').textContent)
    but.addEventListener('click', ()=>{
    
        
    
    console.log("hello")
        
    });
  });

//buttons
}