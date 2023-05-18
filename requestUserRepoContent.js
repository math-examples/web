function replaceTxtHref() {
  var x = document.getElementsByClassName("requestUserRepoContent");
  for (var i = 0; i < x.length; i++) {
      if(x[i].href.endsWith('.txt')) {
          x[i].href = "https://math-examples.github.io/web/receive-href-txt.html"+"?href="+x[i].href;
      }
   //alert(x[i].href);
  }
  //alert(x.length);
}

function irequestUserRepoContent(username, repository, reverse, cb){

    

    // Create new XMLHttpRequest object

    const xhr = new XMLHttpRequest();

    

    // GitHub endpoint, dynamically passing in specified username

    const url = `https://api.github.com/repos/${username}/${repository}/contents`;

    

    // const url = `https://api.github.com/users/${username}/repos`;

    // /repos/{owner}/{repo}/contents/{path}

    // /repos/{owner}/{repo}/zipball/{ref}

    // https://api.github.com/repos/math-papers/2022/zipball

   //  https://api.github.com/repos/math-papers/2022/contents

   

   

    // Open a new connection, using a GET request via URL endpoint

    // Providing 3 arguments (GET/POST, The URL, Async True/False)

    xhr.open('GET', url, true);

    

    // When request is received

    // Process it here

      xhr.onload = function () {

    

        // Parse API data into JSON

        const data = JSON.parse(this.response);

        

        let ol = document.getElementById('userReposContent');

    let length = data.length;

let text = "<ul>";
for (let j = 1; j <= length; ++j) {

let i = j-1;
if(reverse) i = length -j;
        // Loop over each object in data array

        // for (let i in data) {

            

            let li = document.createElement('li');

            

        var prefix = 'https://' + username + '.github.io/' + repository + '/';

        link = prefix + data[i].download_url.split('/').pop();

        // var name = data[i].name.split('-').pop();

        var name = data[i].name;

        if (name.charAt(0) =='\(')name = name.substr(name.indexOf('\)')+1);

var ilast = name.lastIndexOf('.');
if(ilast!=-1)name = name.substr(0, ilast);

            // Create the html markup for each li

            li.innerHTML = (`

                <p><a class="requestUserRepoContent" href="${link}">${name}</a></p>

            `);

            

            // Append each li to the ul

            ol.appendChild(li);

        

        }

cb();
    }

    

    // Send the request to the server

    xhr.send();

    

}

function requestUserRepoContent(username, repository){
    irequestUserRepoContent(username, repository, false, replaceTxtHref);
}

function requestUserRepoContentReverse(username, repository){
    irequestUserRepoContent(username, repository, true, replaceTxtHref);
}

function requestUserRepos(username){

    

    // Create new XMLHttpRequest object

    const xhr = new XMLHttpRequest();

    

    // GitHub endpoint, dynamically passing in specified username

    // const url = `https://api.github.com/repos/${username}/${repository}/contents`;

    

    const url = `https://api.github.com/users/${username}/repos`;

   

    // Open a new connection, using a GET request via URL endpoint

    // Providing 3 arguments (GET/POST, The URL, Async True/False)

    xhr.open('GET', url, true);

    

    // When request is received

    // Process it here

      xhr.onload = function () {

    

        // Parse API data into JSON

        const data = JSON.parse(this.response);


        // Loop over each object in data array

        for (let i in data) {

        var repository = data[i].name;

        requestUserRepoContent(username, repository);

        

        }

    }

    

    // Send the request to the server

    xhr.send();
}

function getUserRepoZip(username, repository){

    const url = `https://api.github.com/repos/${username}/${repository}/zipball`;

    return url;

}

function downloadUserRepo(username, repository) {

var url = getUserRepoZip(username, repository);

saveAs(url, repository + '.zip');

// alert(links)
}