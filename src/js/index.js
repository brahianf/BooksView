(async function load(){

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
  };

  async function addEventSelectSubCategoryClick($element){
    $element.addEventListener('click', async() => {
      const id = $element.dataset.id;
      const name = $element.dataset.name;
      const nicename = $element.dataset.nicename;

      ListView = await cacheExist(`${nicename}`);
      const $booksContainer = document.querySelector('#booksContainer');
      // const HTMLStringLoad = squeletonImageLoad();
      // $booksContainer.innerHTML = HTMLStringLoad;
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
        // const HTMLStringLoad = squeletonImageLoad();
        // $booksContainer.innerHTML = HTMLStringLoad;
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

})();