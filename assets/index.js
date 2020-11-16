const fetchMovieData = async () => {
    try {
        let resp = await fetch("/movieData.json");
        let data = await resp.json();
        console.log("data", data);
        return data;
    } catch (err) {
        console.error(err);
    }
}

const buildMovie = async (title, connection, choice) => {
    try {
        const $movieContainer = document.querySelector("#movieContainer");

        // MOVIE STUFF
        const $movieArticle = document.createElement("article");
            $movieArticle.classList.add("movie");
        
        const $movieDetails = document.createElement("div");
            $movieDetails.classList.add("movie__details");

        const movieURL = buildURL("movie", title);
        let movieResp = await fetch(movieURL);
        let movieData = await movieResp.clone().json();
        console.log("movieData", movieData);

        const $movieTitle = document.createElement("h2");
            $movieTitle.classList.add("movie__details--title");
            $movieTitle.textContent = movieData.Title;

        const $movieYear = document.createElement("span");
            $movieYear.classList.add("movie__details--year");
            $movieYear.textContent = movieData.Year;
            $movieTitle.append(" ", $movieYear);

        const $moviePlot = document.createElement("p");
            $moviePlot.classList.add("movie__details--plot");
            $moviePlot.textContent = movieData.Plot;

        const $movieBadge = document.createElement("div");
        const $choiceImage = document.createElement("div");
            $choiceImage.style.backgroundImage = `url(/assets/images/${choice.charAt(0)}.jpg)`;
            $choiceImage.alt = choice;
        const $movieChoice = document.createElement("p");
            $movieBadge.classList.add("movie__details--badge");
            $movieBadge.classList.add(`${choice.charAt(0)}-choice`);
            $movieChoice.textContent = choice.charAt(0);
            $movieBadge.append($movieChoice, $choiceImage);
        
        // ACTOR STUFF
        if (connection) {

            const $castDiv = document.createElement("div");
                $castDiv.classList.add("movie__cast");

            const actors = buildActorArr(connection);
    
            for (let actor of actors) {
                const actorURL = buildURL("actor", actor)
                let actorResp = await fetch(actorURL);
                let actorData = await actorResp.clone().json();
                actorData = actorData[0];
                console.log("  actorData", actorData);

                const $actorFigure = document.createElement("figure");
                    $actorFigure.classList.add("movie__cast--fig");

                const $actorImage = document.createElement("img");
                    $actorImage.classList.add("movie__cast--image");
                    $actorImage.src = actorData.person.image.medium;
                    $actorImage.alt = actorData.person.name;
                    $actorFigure.append($actorImage);

                const $actorCaption = document.createElement("figcaption");
                    $actorCaption.classList.add("movie__cast--caption");
                    $actorCaption.textContent = actorData.person.name;
                    $actorFigure.append($actorCaption);

                $castDiv.append($actorFigure);

            }

            $movieArticle.prepend($castDiv)

        }

        $movieDetails.append($movieBadge, $movieTitle, $moviePlot);
        $movieArticle.append($movieDetails);
        $movieContainer.append($movieArticle);
        
    } catch(err) {
        console.error(err);
    }
}

const buildURL = (type, searchTerm) => {
    return `https://script.google.com/macros/s/AKfycbxRN7kgi2aBantcl6vnBxUaX3O3jF2Le7uTC7-X4gscD2UAmnk/exec?type=${type}&q=${searchTerm}`;
}

const buildMovieContainer = () => {
    const $main = document.querySelector("main");
    const $movieContainer = document.createElement("section");
        $movieContainer.id = "movieContainer";
    $main.append($movieContainer);
}

const buildActorArr = (connection) => {
    let arr;
    if (connection.includes(",")) {
        arr = connection.split(",");
    } else {
        arr = [ connection ];
    }
    return arr;
}

const buildSpinner = () => {
    console.log(`building spinner`);
    const $main = document.querySelector("main");

    const $spinner = document.createElement("div");
        $spinner.id = "spinner";
    const $spinnerText = document.createElement("p");
        $spinnerText.textContent = "GETTING MORE MOVIES";
    const $spinnerDots = `<span>.</span><span>.</span><span>.</span>`;
    $spinnerText.innerHTML += $spinnerDots;
    $spinner.append($spinnerText);

    $main.append($spinner);
}

const removeSpinner = () => {
    console.log(`removing spinner`);
    const $spinner = document.querySelector("#spinner");
    if ($spinner) { $spinner.remove() };
}

const init = async () => {
    buildMovieContainer();
    buildSpinner();
    const movies = await fetchMovieData();
    for (let movie of movies) {
        // await buildMovie(movies[2].title, movies[2].connection, movies[2].choice);
        await buildMovie(movie.title, movie.connection, movie.choice);
    }
    removeSpinner();
}

window.addEventListener("load", (e) => {
    init();
});