document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form').addEventListener('submit', setUser);
});


const base_URL = 'https://api.github.com'
let user = ""

function showUser(){
    console.log('Fetching user info...');

    let userList = document.getElementById('user-list');
    let repoList = document.getElementById('repos-list');
    let main = document.getElementById('main');

    userList.innerHTML = ''; 
    repoList.innerHTML = ''; 

    fetch(`${base_URL}/users/${user}`)
    .then(res => {
        if (!res.ok) {
            throw new Error('User not found');
        }
        return res.json();
    })
    .then(data => {
        console.log('User data:', data);

        
        let userDetails = document.getElementById('user-details');
        if (userDetails) {
            userDetails.remove(); 
        }

        userDetails = document.createElement('div');
        userDetails.id = "user-details";
        userDetails.innerHTML = `
            <li><strong>Username:</strong> ${data.login}</li>
            <li><img src="${data.avatar_url}" width="100"></li>
            <li><strong>Profile:</strong> <a href="${data.html_url}" target="_blank">${data.html_url}</a></li>
        `;

        main.appendChild(userDetails);

        document.getElementById('user-info').style.display = 'none'; 

        if (!document.getElementById('repos-btn')) {
            let repoButton = document.createElement('button');
            repoButton.id = 'repos-btn';
            repoButton.textContent = "Get User's Repos";
            repoButton.addEventListener('click', getRepos);
            main.appendChild(repoButton);
        }
    })
    .catch(error => {
        console.error(error);
        main.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    });
}

function setUser(event){
    event.preventDefault();
    user = document.getElementById('search').value.trim();
    document.getElementById('search').value = '';

    if (user === '') {
        alert('Please enter a GitHub username.');
        return;
    }

    document.getElementById('user-info').style.display = 'block'; 
    showUser()
}

function getRepos(){
    console.log('Fetching repos...');
    
    const list = document.getElementById('user-list');
    list.innerHTML = ''; 

    fetch(`${base_URL}/users/${user}/repos`)
    .then(res => {
        if (!res.ok) {
            throw new Error('Repositories not found');
        }
        return res.json();
    })
    .then(data => {
        console.log(data);

        if (data.length === 0) {
            list.innerHTML = `<li>No repositories found for ${user}.</li>`;
            return;
        }

        data.forEach(repo => {
            list.innerHTML += `
                <li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>
            `;
        });
    })
    .catch(error => {
        console.error(error);
        list.innerHTML = `<li style="color: red;">Error: ${error.message}</li>`;
    });
}