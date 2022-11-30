// now we need the API
// first let's create some functions
const mealEl_container = document.querySelector('.meal');

// Accessing the favourite meal container
const fav_meals_container = document.querySelector('.fav-meals');

// Accessing the pop-up container variables
const popup_container = document.querySelector('.pop-up-container');
const close_popup_btn = document.querySelector('.pop-up > i');
const popup = document.querySelector('.pop-up-inner');

fetchFavMeals();

// Fetches the Meal from Local Storage
function getMealLS() {
  const mealIds = JSON.parse(localStorage.getItem('mealIds'));

  return mealIds === null ? [] : mealIds;
}

// Fetches the Meal based on the ID associated with it
async function getMealById(id) {
  const resp = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const respData = await resp.json();
  const meal = respData.meals[0];

  return meal;
}

// It Performs Operation to fetch favourite Meals
async function fetchFavMeals() {
  fav_meals_container.innerHTML = '';
  const mealIds = getMealLS();
  const meals = [];
  for (let i = 0; i < mealIds.length; i++) {
    const mealID = mealIds[i];
    meal = await getMealById(mealID);
    addMealToFav(meal);
    meals.push(meal);
  }
}

// Adding Meals to Favourites Page upon click on heart Icon from Home Page
function addMeal(meal) {
  const meal_card = document.createElement('div');
  meal_card.classList.add('meal-card');
  meal_card.innerHTML = `
        <div class="meal-card-img-container">
            <img
            src="${meal.strMealThumb}"
            />
        </div>
        <div class="meal-name">
            <p>${meal.strMeal}</p>
            <i class="fa-regular fa-heart"></i>
        </div>`;

  const btn = meal_card.querySelector('.fa-heart');
  btn.addEventListener('click', () => {
    if (btn.classList.contains('fa-regular')) {
      btn.setAttribute('class', 'fa-solid fa-heart');
      addMealLS(meal.idMeal);
    } else {
      btn.setAttribute('class', 'fa-regular fa-heart');
      removeMealLS(meal.idMeal);
    }
    fetchFavMeals();
  });
  mealEl_container.appendChild(meal_card);
}

// Function to add Meal to Favourites page
function addMealToFav(meal) {
  const fav_meals = document.createElement('div');
  fav_meals.innerHTML = `
    <div class="single">
        <div class="top">
            <div class="img-container">
                <img
                src="${meal.strMealThumb}"
                />
            </div>
            <div class="text">
                <p>${meal.strMeal}</p>
            </div>
        </div>
        <i class="fa-solid fa-x"></i>
    </div>`;

  const x = fav_meals.querySelector('.fa-x');

  x.addEventListener('click', () => {
    removeMealLS(meal.idMeal);

    const heart_btns = document.querySelectorAll('.fa-heart');
    heart_btns.forEach((heart_btn) => {
      heart_btn.setAttribute('class', 'fa-regular fa-heart');
    });
    fetchFavMeals();
  });

  fav_meals.firstChild.nextSibling.firstChild.nextSibling.addEventListener(
    'click',
    () => {
      showMealPopup(meal);
    }
  );

  fav_meals_container.appendChild(fav_meals);
}

// Remove the favourite Meals
function removeMealLS(mealID) {
  const mealIds = getMealLS();
  localStorage.setItem(
    'mealIds',
    JSON.stringify(mealIds.filter((id) => id !== mealID))
  );
}

// Closes the Pop-up Modal
close_popup_btn.addEventListener('click', () => {
  popup_container.style.display = 'none';
});

// Displays the Meal Details
function showMealPopup(meal) {
  popup.innerHTML = '';

  const newPopup = document.createElement('div');
  newPopup.classList.add('pop-up-inner');

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  newPopup.innerHTML = `<div class="left">
  <div class="meal-card">
    <div class="meal-card-img-container">
      <img
        src="${meal.strMealThumb}"
      />
    </div>
    <div class="meal-name">
      <p>${meal.strMeal}</p>
      <i class="fa-regular fa-heart"></i>
    </div>
  </div>
  <div class="recipe-link">
    <a href="${meal.strYoutube}" target="_blank">
      <button type="button" class="btn btn-outline-success">
        Watch Recipe
      </button>
    </a>
  </div>
</div>
<div class="right">
  <div>
    <h2>Instructions</h2>
    <p class="meal-info">
     ${meal.strInstructions}
    </p>
  </div>
  <div>
    <h2>Ingredients / Measures</h2>
    <ul>
      ${ingredients.map((e) => `<li>${e}</li>`).join('')}
    </ul>
  </div>
</div>`;

  popup.appendChild(newPopup);
  popup_container.style.display = 'flex';
}
