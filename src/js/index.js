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

  async function renderSubCategoryList($playlistFriendsItem){
    $playlistFriendsItem.forEach(async (Category) => {
      const listSubCategory =  await cacheSubCategoryItems(Category.dataset.id);
      const $playlistFriendsubItem = Category.querySelector('ul.playlistFriends-subItem');
      listSubCategory.forEach((subCategory) => {
        const HTMLString = subCategoryItemTemplate(subCategory);
        $playlistFriendsubItem.innerHTML += HTMLString
      });
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

  // List Category of Api or cache, and Render in Sidebar
  const listCategory = await cacheCategory('list-category');
  const $playlistFriends = document.querySelector('#playlistFriends');
  renderCategoryList(listCategory, $playlistFriends);

  const $playlistFriendsItem = document.querySelectorAll('li.playlistFriends-item');
  renderSubCategoryList($playlistFriendsItem);

})();