function isTxtSuffix(name) {
    if(name.endsWith('.txt')
    || name.endsWith('.cc')
    || name.endsWith('.cpp')
    || name.endsWith('.h')
    || name.endsWith('.hpp')
    || name.endsWith('.py')
    || name.endsWith('.sh')
    || name.endsWith('.css')
    || name.endsWith('.js')
    || name.endsWith('.bzl'))
      return true;
    return false;
}

function getMyWebPathGitApi(){
    var uri = window.location.toString();
    if (uri.indexOf("?") > 0) {
    return uri.substring(0, uri.indexOf("?"));
    }else return uri;
}

function replaceTxtHref() {
  var x = document.getElementsByClassName("requestUserRepoContent");
  for (var i = 0; i < x.length; i++) {
      if(isTxtSuffix(x[i].href)) {
          x[i].href = "https://math-examples.github.io/web/receive-href-txt.html"+"?href="+x[i].href;
      }
   //alert(x[i].href);
  }
  //alert(x.length);
}

function irequestUserRepoContent(username, repository, reverse, cb){
if(!username || !repository)return;

    // Create new XMLHttpRequest object

    const xhr = new XMLHttpRequest();

    const repoAndPath = repository.split('/');
    let repo = repository;
    let path;
    if(repoAndPath.length>1){
        let ifirst = repository.indexOf('/');
        path = repository.substring(ifirst+1);
        repo = repository.substring(0, ifirst);
    }

    // GitHub endpoint, dynamically passing in specified username

    let url = `https://api.github.com/repos/${username}/${repo}/contents`;
    if(path)url+=`/${path}`;

    
//alert(url);
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
//alert(data.length);
        let ol = document.getElementById('userReposContent');

    let length = data.length;
    const myWebPrefix = getMyWebPathGitApi();

for (let j = 1; j <= length; ++j) {

let i = j-1;
if(reverse) i = length -j;

//alert(data[i].download_url);
//alert(data[i].name);
        // for (let i in data) {

let li = document.createElement('li');
var prefix = 'https://' + username + '.github.io/' + repository + '/';
if(repo===username+'.github.io')prefix = 'https://' + repository + '/';
let link ="";
let isfile =1;
if(data[i].download_url){ // file
    link = prefix + data[i].download_url.split('/').pop();
}else{ // folder
    isfile = 0;
    link = `${myWebPrefix}?user=${username}&repo=${repository}/${data[i].name}`;
}
        

        // var name = data[i].name.split('-').pop();

        var name = data[i].name;
//alert(name);
if(isfile){
    if (name.charAt(0) =='\('){
            let ii = name.indexOf('\)');
            if(ii+1<name.length)name = name.substr(ii+1);
        }
var ilast = name.lastIndexOf('.');
if(ilast>0)name = name.substring(0, ilast);
}
            // Create the html markup for each li

            li.innerHTML = (`

                <p><a class="requestUserRepoContent" href="${link}">${name}</a></p>

            `);

            

            // Append each li to the ul

            ol.appendChild(li);
} // end for

cb();
}; // end onload

// Send the request to the server
xhr.send();
}

function irequestUserRepos(username, reverse){
    if(!username)return;
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
//alert(data.length);
let ol = document.getElementById('userReposContent');

let length = data.length;
const myWebPrefix = getMyWebPathGitApi();

for (let j = 1; j <= length; ++j) {

let i = j-1;
if(reverse) i = length -j;

//alert(data[i].download_url);
//alert(data[i].name);
        // for (let i in data) {

let li = document.createElement('li');

let link = `${myWebPrefix}?user=${username}&repo=${data[i].name}`;
var name = data[i].name;
//alert(name);

            // Create the html markup for each li

            li.innerHTML = (`

                <p><a class="requestUserRepoContent" href="${link}">${name}</a></p>

            `);

            

            // Append each li to the ul

            ol.appendChild(li);
} // end for

}; // end onload
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
    irequestUserRepos(username, false);
}

function requestUserReposReverse(username){
    irequestUserRepos(username, true);
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