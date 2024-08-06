async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
    const element = includeElements[i];
    file = element.getAttribute("w3-include-html"); // "includes/header.html"
    let resp = await fetch(file);
    if (resp.ok) {
      element.innerHTML = await resp.text();
    } else {
      element.innerHTML = 'Page not found';
    }
  }
}

let posts = [
  {
    'userImg': './img/logo/friends/princess.png',
    'author': 'Dragonprincess Aerie',
    'likes': 50,
    'isLiked': false,
    'location': 'Faerûn',
    'image': 'img/babyDragon.jpg',
    'post': 'Dieser süße Drache sucht ein Zuhause. Ich habe sie selbst mithilfe von Heizlüftern aus ihrem Ei gebrütet. Es handelt sich hierbei um eine reinrassige lila Dolchschwanz-Drachen-Lady. Bei Abgabe ist diese bereits entwurmt und besitzt einen Microchip sollte sie einmal ausbüchsen, sowie ein Starter-Paket für die ersten Tage mit ihren Lieblingsspielzeugen. Bei Anfrage PM an mich!',
    'comments': ["Drako: Hey, ich interessiere mich für die kleine. Kann man sie auch mit Bardagamen zusammen halten?", '<br>Dragonprincess Aerie: Klar, sollte normalerweise kein Problem sein.',]
  },
  {
    'userImg': './img/logo/friends/l33t.png',
    'author': 'L33tDr4gonGam34r',
    'likes': 5,
    'isLiked': true,
    'location': 'München',
    'image': 'img/1.jpg',
    'post': 'Charakteristischer Blick der Überlegenheit eines Drachen.',
    'comments': ['Bahamut: Pff, als ob so ein kleiner Wicht mit mir in irgendeiner Form verwandt sein soll',]
  },
  {
    'userImg': './img/logo/friends/bahamut.jpg',
    'author': 'Bahamut',
    'likes': 666,
    'isLiked': false,
    'location': 'London',
    'image': 'img/firedragon.jpg',
    'post': 'Kleines Selfie von mir mit meiner neuen Kamera ',
    'comments': [],
  },
  {
    'userImg': './img/logo/friends/drako.jpg',
    'author': 'Drako',
    'likes': 2,
    'isLiked': false,
    'location': 'Bangkok',
    'image': 'img/dragonFight.jpg',
    'post': 'Heute ist das Fest des Drachen in Bangkok.',
    'comments': ['Bahamut: Aaah endlich wieder ein leckeres Abendessen, vielleicht schaue ich auch mal vorbei.',]
  },
];

load();

function loadPage() {
  includeHTML();
  render();
}

function load() {
  let postAsText = localStorage.getItem('posts');
  if (postAsText) {
    posts = JSON.parse(postAsText);
  }
}

function save() {
  let postAsText = JSON.stringify(posts);
  localStorage.setItem('posts', postAsText);
}

function render() {
  document.getElementById('postContainer').innerHTML = ``;
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    let likedImage = 'img/logo/blackHeart.png';
    if (post['isLiked']) {
      likedImage = 'img/logo/redHeart.png';
    }
    postContainer(post, likedImage, i);
  }
}

function postContainer(post, likedImage, i) {
  document.getElementById('postContainer').innerHTML += /*html*/`
        <div>
          <div class="seperatorMid"></div>

          <div class="postAuthor">
            <img class="profilLogoPost" src="${post['userImg']}">
            <div>
              <div class="author">${post['author']}</div>
              <div class="location">${post['location']}</div>
            </div>
          </div>

          <img class="postedImage" src="${post['image']}">

          <div>
            <a id="Heart${i}" onclick="changeLikeStatus(${i})"><img class="logoPost" src="${likedImage}">${posts[i].likes}</a>
          </div>

          <div class="author">${post['author']}</div>

          <p class="post" id="moreButton${i}">${post['post'].substring(0, 40)}
          <button class="moreButton" onclick="readMore(${i})">...weiter</button></p>

          <div class="post d-none" id="post${i}">${post['post']}</div>

          <div id="comments${i}">
            <button class="comments" id="commentButton${i}" onclick="loadComments(${i})">${posts[i].comments.length} Kommentare anzeigen</button>
          </div>

          <div class="yourComment">
            <textarea class="comment" id="comment${i}" type="text" placeholder="Dein Kommentar..."></textarea>
            <a onclick="addComment(${i})"><img class="postButton" src="./img/logo/blackFeather.png"></a>
          </div>
        </div>
        `;
}

function addComment(i) {
  let post = posts[i];
  let comments = post['comments'];
  let comment = document.getElementById(`comment${i}`);
  let commentinBox = document.getElementById(`commentInBox${i}`);
  if (!commentinBox && !comment) {
    return
  }
  else if (comment.value) {
    loadComments(i);
    comments.push('<br>Alexander: ' + comment.value);
  }
  else if (commentinBox.value) {
    comments.push('<br>Alexander: ' + commentinBox.value);
  }
  document.getElementById(`comment${i}`).value = ``;
  document.getElementById(`commentInBox${i}`).value = ``;
  save();
  render();
  loadComments(i);
}

function changeLikeStatus(i) {
  if (posts[i].isLiked) {
    posts[i].likes--;
    posts[i].isLiked = false;
  }
  else {
    posts[i].likes++;
    posts[i].isLiked = true;
  }
  save();
  render();

}

function readMore(i) {
  document.getElementById(`moreButton${i}`).classList.add('d-none');
  document.getElementById(`post${i}`).classList.remove('d-none');
}

function loadComments(i) {
  let post = posts[i];
  let comment = post['comments'];
  showOverlay();
  showComments(comment, i);
}

function showComments(comment, i) {
  const post = posts[i];
  document.getElementById('commentSection').innerHTML = /*html*/`
      <img class="overlayImage" src="${post['image']}">
      <div>
        <p>${comment.join("")}</p>
        <div class="commentOverlay">
          <textarea class="commentBox" id="commentInBox${i}" type="text" placeholder="Dein Kommentar..."></textarea>
          <a onclick="addComment(${i})"><img class="postButton" src="./img/logo/blackFeather.png"></a>
        </div>
      </div>
        `
}

function showOverlay() {
  document.getElementById('overlay').classList.add('showOverlay');
  document.getElementById('commentSection').classList.add('showOverlay');
}

function hideOverlay() {
  document.getElementById('overlay').classList.remove('showOverlay');
  document.getElementById('commentSection').classList.remove('showOverlay');
}

function fakeSearch() {
  let check = document.getElementById('searchInput').classList.contains('d-none');
  let searchBox = document.getElementById('searchInput');
  if (!check) {
    searchBox.classList.add('d-none');
  }
  else {
    searchBox.classList.remove('d-none');
  }
}