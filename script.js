const frontPageLink = document.getElementById("front-page");
const categories = document.getElementById("categories");
const search = document.getElementById("search");
const edit = document.getElementById("edit");

frontPageLink.addEventListener("click", () => {
    window.location.reload();
});

const handleItemsClick = async (event) => {
    const categoryName = event.target.id;
};

const handleCategoryClick = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/categories");

    if (!response.ok) return alert("Something went wrong. Please contact the system administrators.");

    const html = await response.text();

    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = html;
};

const handleSearchClick = async (event) => {
    event.preventDefault();

    const response = await fetch(`http://localhost:3000/search`);

    if (!response.ok) return alert("Something went wrong. Please contact the system administrators.");

    const html = await response.text();

    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = html;
};

const handleAddClick = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:3000/edit");

    if (!response.ok) return alert("Something went wrong. Please contact the system administrators.");

    const html = await response.text();

    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = html;
};

// app data
const searchById = async (event) => {
    event.preventDefault();

    const children = event.target.elements;

    const id = children[0];

    const response = await fetch(`http://localhost:3000/searchbyid?id=${id.value}`);

    if (response.status === 404) {
        return alert("Annetulla ID:llä ei ole vastaavaa tuotetta.");
    }

    let movie = document.getElementById("movie-item");

    if (movie === null) {
        movie = document.createElement("div");
        movie.id = "movie-item";

        event.target.appendChild(movie);
    }
    
    movie.innerHTML = await response.text();
};

const searchByCategory = async (event) => {
    event.preventDefault();

    const children = event.target.elements;

    const id = children[0];

    const response = await fetch(`http://localhost:3000/searchbycategory?category=${id.value}`);

    if (response.status === 404) {
        return alert("Annetussa kategoriassa ei ole elokuvia.");
    }

    let list = document.getElementById("category-list");

    if (list === null) {
        list = document.createElement("div");
        list.id = "movie-item";

        event.target.appendChild(list);
    }
    
    list.innerHTML = await response.text();
};

const addProduct = async (event) => {
    event.preventDefault();

    const children = event.target.elements;

    const id = children[0];
    const category = children[1];
    const name = children[2];

    const data = {
        id: id.value,
        category: category.value,
        name: name.value,
    };

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    };

    const response = await fetch(`http://localhost:3000/addproduct`, options);

    if (response.status === 403) {
        return alert("Tuote annetulla ID:llä on jo olemassa.");
    }

    console.log(response);
    return alert("Tuote lisätty.");
};

const removeProduct = async (event) => {
    event.preventDefault();

    const children = event.target.elements;

    const id = children[0];

    const options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    };

    const response = await fetch(`http://localhost:3000/removeproduct?id=${id.value}`, options);

    if (response.status === 404) {
        return alert("Tuotetta annetulla ID:llä ei ole olemassa..");
    }

    console.log(response);
    return alert("Tuote poistettu.");
};


edit.addEventListener("click", handleAddClick);
search.addEventListener("click", handleSearchClick);
categories.addEventListener("click", handleCategoryClick);

