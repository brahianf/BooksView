import '../css/home.css';
(async function load(){
  const window = require("global/window");
  function categoryItemtemplate(category) {
    return (
      `
      <li class="playlistFriends-item" data-id=${category.category_id} data-name=${category.name} data-nicename=${category.nicename}>
        <span>
        ◆ ${category.name}
        </span>
        <ul class="playlistFriends-subItem"></ul>
      </li>
      `
    );
  };

  function subCategoryItemTemplate(subCategory){  
    return (
     `
     <li class="playlistFriends-item" data-id=${subCategory.subcategory_id} data-name=${subCategory.name} data-nicename=${subCategory.nicename}>
       <span>
       • ${subCategory.name}
       </span>
     </li>
     `
   );
  };

  function renderCategoryList(listCategory, $playlistFriends) {
    // Show list Category in Sidebar Play list
    listCategory.forEach((category) => {
      const HTMLString = categoryItemtemplate(category);
      $playlistFriends.innerHTML += HTMLString;
    });
  };

  async function cacheExist(category){
    const listName=`${category}List`;
    const cacheList = window.localStorage.getItem('listName');
    if(cacheList){
      return JSON.parse(window.localStorage.getItem('listName'));
    }
    // debugger
    const data =  await getData(`${BASE_API}?category=${category}&criteria=most_viewed&order=newest`);
    window.localStorage.setItem(listName, JSON.stringify(data));
    return data;
  };

  function bookItemtemplate(book, category) {
    return (
      `
      <div class="primaryPlaylist-book" id="primaryPlaylist" data-id=${book.ID} data-category=${category}>
        <img class="imgList fadeIn" src=${book.cover} width="60" height="60" alt="${book.title}"></img>
        <div class="bookInformation" id="bookInformation">
          <p>Autor:  ${book.author}</p>
          <p>Fecha:  ${book.publisher_date}</p>
          <p>Páginas:  ${book.pages}</p>
          <p>Idioma:  ${book.language}</p>
          <p>Editor:  ${book.publisher}</p>
          <button class="bookInformation-btn secundary">Read More</button>
        </div>
      </div>
      `
    )
  }

  function findbyId(id, list){
    const book = list.find(book => book.ID === id);
    return book;
  };

  function findBook(id, category){
    if(category === 'Week'){
      return findbyId(id, ListView);
    } else {
      return findbyId(id, ListView);
    }
  };

  // Elements modal Books
  const $modal = document.getElementById('modal');
  const $modalTitle = $modal.querySelector('h1');
  const $modalImage = $modal.querySelector('img');
  const $modalContentAuthor = $modal.querySelector('p.modal-content-author');
  const $modalContentLanguage = $modal.querySelector('p.modal-content-language');
  const $modalContentPublisher = $modal.querySelector('p.modal-content-publisher');
  const $modalContentPublisherDate = $modal.querySelector('p.modal-content-publisher_date');
  const $modalContentDescription = $modal.querySelector('p.modal-content-description');

  // Elements Overlay Modal;
  const $overlay = document.getElementById('overlay');
  const $hideModal = document.getElementById('hide-modal');

  function hideModal(){
    $overlay.classList.remove('active');
    $modal.style.animation = 'modalOut .8s forwards';
  };

  $hideModal.addEventListener('click', hideModal);

  // const listFavorites = await cacheExist('list-favorites');
  let listFavorites = [];
  // renderfavoriteList(listFavorites);

  function removeFavoriteFromArr ( listFavorites, book) {
    for (var i =0; i < listFavorites.length; i++){
      if (listFavorites[i].ID === book.ID) {
        listFavorites.splice(i,1);
      }
    }
  }

  function favoriteItemTemplate(book){
    return (
      `
      <li class="playlistFriends-item listFavorites"  data-id=${book.ID} data-category=${book.category}">
        <a href="#${book.title}" >
          <img class="imgList fadeIn" src=${book.cover} width="60" height="60" alt="${book.title}"></img>
          <span>
            ${book.title}
          </span>
        </a>
      </li>
      `
    );
  };

  function renderfavoriteList(listFavorites){
    if(listFavorites){
      const $sidebarPlaylist = document.querySelector('ul.sidebarPlaylist-favorites');
      $sidebarPlaylist.innerHTML = '';
      listFavorites.forEach((book) => {
          const HTMLString = favoriteItemTemplate(book);
          $sidebarPlaylist.innerHTML += HTMLString;
      });
    }
    const $listFavorites = document.querySelectorAll('li.listFavorites');
    if($listFavorites){
      $listFavorites.forEach((favorite) => {
        favorite.addEventListener('click', async() => {
          showModal(favorite);
        });
      });
    }
  };
  
  function addFavoriteClick($addfavorites) {
    $addfavorites.addEventListener('click', () => {
      const id = $modal.dataset.id;
      const category = $modal.dataset.category;
      const title = $modalTitle.textContent;
      const cover = $modalImage.getAttribute('src');

      const book = {
        ID: id,
        category: category,
        title: title,
        cover: cover
      };

      if($addfavorites.textContent === 'Agregar a favoritos'){
        $addfavorites.textContent = 'Eliminar de favoritos';
        listFavorites.push(book);
      } else {
        $addfavorites.textContent = 'Agregar a favoritos';
        removeFavoriteFromArr(listFavorites, book);
      }
      renderfavoriteList(listFavorites);
    });
  };

  const $addfavorites = $modal.querySelector('button.secundary');
  addFavoriteClick($addfavorites);

  function showModal($element) {

    const id= $element.dataset.id;
    const book = findbyId($element.dataset.id, listFavorites);
    if(book){
      $addfavorites.textContent = 'Eliminar de favoritos'
    } else {
      $addfavorites.textContent = 'Agregar a favoritos';
    }
  
    $modal.style.animation = 'modalIn .6s forwards';
    $overlay.classList.add('active');
  
    const category = $element.dataset.category;
    const data = findBook(id,category);
    $modal.setAttribute('data-id', id);
    $modal.setAttribute('data-category', category);
    $modalTitle.textContent = data.title;
    $modalImage.setAttribute('src', data.cover);
    $modalContentAuthor.textContent = data.author;
    $modalContentLanguage.textContent = data.language;
    $modalContentPublisher.textContent = data.publisher;
    $modalContentPublisherDate.textContent = data.publisher_date;
    $modalContentDescription.textContent = data.content_short;
  };

  function addEventClick($btn, $element) {
    $btn.addEventListener('click', () => {
      showModal($element);
    });
  };

  function showInformation($element) {
    // $modal.style.animation = 'modalIn .8s forwards';
    const $bookInformation = $element.querySelector('div.bookInformation');
    $bookInformation.classList.add('is-active');
    const id = $element.dataset.id;
    const category = $element.dataset.category;
    const $btnBook= $element.querySelector('button.bookInformation-btn');
    addEventClick($btnBook,$element);
  };

  function hideInformation($element) {
    const $bookInformation = $element.querySelector('div.bookInformation');
    $bookInformation.classList.remove('is-active');
  };

  function addEventHover($element){
    $element.addEventListener('mouseenter', () => {
      showInformation($element);
    });
    $element.addEventListener('mouseleave', () => {
      hideInformation($element);
    });
  };

  function renderBookList(list, $container, category){
    $container.children[0].remove();
    const $homeprimarytags = document.querySelector('#home-primary-tags');
    $homeprimarytags.innerHTML = `<div class="home-primary-tags" id="home-primary-tags">
                                    <h2> ${category} </h2>
                                  </div>
                                  `;
    list.forEach((book) => {
      const HTMLString = bookItemtemplate(book,category);
      $container.innerHTML += HTMLString;
      // const $image=$container.querySelector('img.imgList')
      //const $image = document.querySelectorAll('img.imgList');
      // addEventListener($image);
    });
    const $primaryPlaylist = document.querySelectorAll('div.primaryPlaylist-book');
    $primaryPlaylist.forEach((book)=>{
      addEventHover(book);
    });
  };

  function squeletonImageLoad() {
    return (
      `
      <div class="primaryPlaylist">
        <div class="primaryPlaylist-list" id="action">
          <img src="src/images/loader.gif" width="100" height="140" alt="loader" margin="0 auto">
        </div>
      </div>
      `
    );
  };

  async function addEventSelectSubCategoryClick($element){
    $element.addEventListener('click', async() => {
      const id = $element.dataset.id;
      const name = $element.dataset.name;
      const nicename = $element.dataset.nicename;

      ListView = await cacheExist(`${nicename}`);
      const $booksContainer = document.querySelector('#booksContainer');
      const HTMLStringLoad = squeletonImageLoad();
      $booksContainer.innerHTML = HTMLStringLoad;
      renderBookList(ListView, $booksContainer,`${name}`);
    });
  };

  async function addEventSelectClick ($element, listSubCategory) {
    const $item = $element.querySelector('span');
    const $subCategoryItems = $element.querySelector('ul.playlistFriends-subItem');
    $item.addEventListener('click', async() => {
      if(listSubCategory.length===0){
        const id = $element.dataset.id;
        const name = $element.dataset.name;
        const nicename = $element.dataset.nicename;

        ListView = await cacheExist(`${nicename}`);
        const $booksContainer = document.querySelector('#booksContainer');
        const HTMLStringLoad = squeletonImageLoad();
        $booksContainer.innerHTML = HTMLStringLoad;
        renderBookList(ListView, $booksContainer,`${name}`);
      } else {
        if ($subCategoryItems.classList.contains('is-active')){
          $subCategoryItems.classList.remove('is-active');
        } else{
          $subCategoryItems.classList.add('is-active');
        }
      }
    });

    if(listSubCategory != 0){
      const $listSubCategory = $subCategoryItems.querySelectorAll('li.playlistFriends-item');
      $listSubCategory.forEach((subItem) => {
        addEventSelectSubCategoryClick(subItem);
      });
    }
  };

  async function renderSubCategoryList($playlistFriendsItem){
    $playlistFriendsItem.forEach(async (Category) => {
      const listSubCategory =  await cacheSubCategoryItems(Category.dataset.id);
      const $playlistFriendsubItem = Category.querySelector('ul.playlistFriends-subItem');
      listSubCategory.forEach((subCategory) => {
        const HTMLString = subCategoryItemTemplate(subCategory);
        $playlistFriendsubItem.innerHTML += HTMLString
      });
      addEventSelectClick(Category, listSubCategory);
    });
  };

  //Documentation API https://openlibra.com/es/page/public-api
  const BASE_API = 'https://www.etnassoft.com/api/v1/get/';

  async function getData(url){
    const response = await fetch(url);
    // await time end fetch
    const data = await response.json();
    // if(data.length > 0) {
      return data;
    // }
    // If not data continue
    // throw new Error('No se encontró ningún resultado');
  
  };

  async function cacheCategory(category){
    const listName=`${category}`;
    const cacheList = window.localStorage.getItem('listName');
    if(cacheList){
      return JSON.parse(window.localStorage.getItem('listName'));
    }
    // debugger
    const data =  await getData(`${BASE_API}?get_categories=all`);
    window.localStorage.setItem(listName, JSON.stringify(data));
    return data;
  };

  async function cacheSubCategoryItems(id){
    const listName=`${id}items`;
    const cacheList = window.localStorage.getItem('listName');
    if(cacheList){
      return JSON.parse(window.localStorage.getItem('listName'));
    }
    const data =  await getData(`${BASE_API}?get_subcategories_by_category_ID=${id}`);
    window.localStorage.setItem(listName, JSON.stringify(data));
    return data;
  };

  let ListView = await cacheExist('libros_software_libre');
  const $booksContainer = document.querySelector('#booksContainer');
  renderBookList(ListView, $booksContainer,'Week');

  // List Category of Api or cache, and Render in Sidebar
  const listCategory = await cacheCategory('list-category');
  const $playlistFriends = document.querySelector('#playlistFriends');
  renderCategoryList(listCategory, $playlistFriends);

  const $playlistFriendsItem = document.querySelectorAll('li.playlistFriends-item');
  renderSubCategoryList($playlistFriendsItem);

  const $sidebarButtons = document.querySelectorAll('button.sidebarPlaylist-title-btn');

  // Show or Hide SubItems categories or Favorites with CSS.
  $sidebarButtons.forEach((btn)=>{
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      if(category==='Categorias'){
        const $playlistFriends = document.querySelector('ul.playlistFriends');
        if ($playlistFriends.classList.contains('is-active')){
          $playlistFriends.classList.remove('is-active');
          $playlistFriends.classList.add('is-desactive');
        } else{
          $playlistFriends.classList.add('is-active');
          $playlistFriends.classList.remove('is-desactive');
        }
      }
      if(category==='myBoks') {
        const $sidebarPlaylistFavorites = document.querySelector('ul.sidebarPlaylist-favorites');
        if ($sidebarPlaylistFavorites.classList.contains('is-active')){
          $sidebarPlaylistFavorites.classList.remove('is-active');
          $sidebarPlaylistFavorites.classList.add('is-desactive')
        } else{
          $sidebarPlaylistFavorites.classList.add('is-active');
          $sidebarPlaylistFavorites.classList.remove('is-desactive');
        }
      }
    });
  });

  const $menuHeader = document.querySelectorAll('a.linkNav');
  $menuHeader.forEach((linkHeader) => {
    linkHeader.addEventListener('click', async () => {
      const category = linkHeader.dataset.category;
      const title = linkHeader.textContent;
      try {
        ListView = await cacheExist(category);
        const HTMLString = squeletonImageLoad();
        $booksContainer.innerHTML = HTMLString;
        renderBookList(ListView, $booksContainer, title);
      } catch(error){
        alert(error.message);
      };
    });
  });

  const $form = document.getElementById('form');

  $form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // $home.classList.add('search-active')
    const name = new FormData($form);
    try {
      ListView = await getData(`${BASE_API}?book_title="${name.get('name')}"&category=${name.get('name')}`);
      const HTMLString = squeletonImageLoad();
      $booksContainer.innerHTML = HTMLString;
      renderBookList(ListView, $booksContainer, `Resultados para ${name.get('name')}`);
    } catch(error){
      alert(error.message);
      $home.classList.remove('search-active');
    }
  });

  const $searchButton = document.querySelector('button.search-button ');
  $searchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    // $home.classList.add('search-active')
    const name = new FormData($form);
    try {
      ListView = await getData(`${BASE_API}?book_title="${name.get('name')}"&category=${name.get('name')}`);
      const HTMLString = squeletonImageLoad();
      $booksContainer.innerHTML = HTMLString;
      renderBookList(ListView, $booksContainer, `Resultados para ${name.get('name')}`);
    } catch(error){
      alert(error.message);
      $home.classList.remove('search-active');
    };
  });

  // Elements Home List, Tags for view of books
  const $home = document.getElementById('home');
  const $homeSidebar = $home.querySelector('div.home-sidebar');
  const $sidebar = $home.querySelector('div.sidebar');

  function hideShow(){
    if ($sidebar.classList.contains('show')){
      $sidebar.classList.remove('show');
      $homeSidebar.classList.remove('maxWidth');
      $home.classList.remove('max');
      $sidebar.classList.add('hide');
      $homeSidebar.classList.add('minWidth');
      $home.classList.add('min');
    } else{
      $homeSidebar.classList.remove('minWidth');
      $sidebar.classList.remove('hide');
      $home.classList.remove('min');
      $sidebar.classList.add('show');
      $homeSidebar.classList.add('maxWidth');
      $home.classList.add('max');

    }
  };

  // Burger Button for Screen max-width: 767px
  const $burgerButton = document.querySelector('#burger-menu');
  $burgerButton.addEventListener('click', hideShow);

})();