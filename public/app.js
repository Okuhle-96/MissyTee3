let seasonFilter = 'All';
let genderFilter = 'All';

const seasonOptions = document.querySelector('.seasons');
const genderOptions = document.querySelector('.genders');
const searchResultsElem = document.querySelector('.searchResults');
const priceRangeElem = document.querySelector('.priceRange');
const showPriceRangeElem = document.querySelector('.showPriceRange');

const userInput = document.querySelector('.textInput');
const addUserBtn = document.querySelector('.userLogin')

const garmentsTemplateText = document.querySelector('.garmentListTemplate');
const garmentsTemplate = Handlebars.compile(garmentsTemplateText.innerHTML);

genderOptions.addEventListener('click', function (evt) {
	genderFilter = evt.target.value;
	filterData();
});

const garmentsList = () => {
	axios
		.get('http://localhost:4017/api/garments')
		.then(function (result) {
			console.log(result.data);
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		})
}
garmentsList();

const priceEndpoint = () => {
	axios
		.get('http://localhost:4017/api/garments/price/:price')
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments,
			})

		})
}
priceEndpoint();

function filterData() {
	axios
		.get(`/api/garments?gender=${genderFilter}&season=${seasonFilter}`)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
}

priceRangeElem.addEventListener('change', function (evt) {
	const maxPrice = evt.target.value;
	showPriceRangeElem.innerHTML = maxPrice;
	axios
		.get(`/api/garments/price/${maxPrice}`)
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		});
});

filterData();

addUserBtn.addEventListener('click', function () {
	let username = userInput.value
	loginRoute(username);
})

const loginRoute = (username) => {
	axios
		.post(`http://localhost:4017/api/login`, {
			username
		})
		.then(function (result) {
			loginScreenToggle();
			showHiddenSections();
			filterData();
			token = result.data
			localStorage.setItem('token', JSON.stringify(token));

		})
}

const postRoute = () => {
	axios
		.get(`http://localhost:4017/api/posts`, {})
		.then(function (result) {
			searchResultsElem.innerHTML = garmentsTemplate({
				garments: result.data.garments
			})
		})
}
postRoute();

seasonOptions.addEventListener('click', function (evt) {
	seasonFilter = evt.target.value;
	filterData();
});