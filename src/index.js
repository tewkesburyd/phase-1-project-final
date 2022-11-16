
//search for a show
const searchForShow = () => {
    const searchButton = document.querySelector('#search-button')
    searchButton.addEventListener('click', (e) => {
        const input = document.querySelector('#search-show')
        const showName = input.value
        fetch(`https://api.tvmaze.com/search/shows?q=${showName}`)
        .then(res => res.json())
        .then(data => {
            clearSearch()
            render(data)
        })
        const title = document.querySelector('h1')
        title.innerText = upper(input.value) + ' Finder'
        input.value = ''
        const searchBar = document.querySelector(".search-bar")
        searchBar.innerHTML = ""
    })
}

//upper case first letter of search and passes it pack to the title
const upper = (string) => {
    return string[0].toUpperCase() + string.slice(1)
}
let rating = 0

//renders show info to page
const render = (data) => {
    data.forEach(show => { 
        const cardInfo = document.querySelector('.show')
        const div = document.createElement("div")
        div.setAttribute('class', "episodes")
        const img = document.createElement('img')
        img.src = (show.show.image) ? show.show.image.medium : "https://www.freeiconspng.com/uploads/no-image-icon-15.png"
        img.className = 'click-image'
        img.style.height = '290px';
        img.style.width = '200px';
        const name = document.createElement('h3')
        name.innerText = show.show.name ? show.show.name: show.name;
        const type = document.createElement('h3');
        const rating = show.show.rating.average
        type.innerText = rating > 0 ? `Rating: ${rating}/10` : 'Rating Unavailable';
        const text = document.createElement('p')
        text.className = "summary"
        text.innerHTML = show.show.summary ? show.show.summary : show.summary;
     
        cardInfo.append(div)
        div.append(name, img, type, text)

        divButton(show, img)
   })
}

//creates drop down options for each season
const toggle = (data) => {
    const arrayLength = data.length -1
    const seasons = data[arrayLength].season
    const search = document.querySelector(".search-bar")
    const select = document.createElement('select')
    for (let i = 0; i <= seasons; i++){
        let option = document.createElement('option')
        if(i === 0){
            option.setAttribute('value', i )
            option.innerText = "All Seasons"
            select.append(option)
        } else {
            option.setAttribute('value', i )
            option.innerText = "Season " + (i )
            select.append(option)
        }
    } 
    search.append(select)
}


//Needs to filter data for the selected season then calls render()
const filter = (data) => {
    toggle(data)
    const searchBar = document.querySelector('.search-bar')
    const filterButton= document.createElement('button')
    filterButton.id = "filter-button"
    filterButton.innerText = "Search"
    const select = document.querySelector('select')
    searchBar.append(filterButton)
    filterButton.addEventListener('click', (e) => {
        e.preventDefault()
        //if select value = 0 then return all episodes
        if (select.value == 0){
            //clears previous search and renders all episodes from data
            clearSearch()
            secondRender(data)
        } else {
            let season = data.filter(episode => {
                return select.value == episode.season
            })
            //clears previous search and renders for selected season
            clearSearch()
            secondRender(season)
        }
    })
}


//clears search results
const clearSearch = () => {
    const cardInfo = document.querySelector('.show')
    cardInfo.innerHTML = ""
}

//click on show to fetch episodes
const divButton = (show, img) => {
    img.addEventListener('click', (e) => {
        const id = show.show.id
        fetch(`https://api.tvmaze.com/shows/${id}/episodes`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            clearSearch()
            secondRender(data)
            filter(data)
        })
    })
}

//renders episode information. Only slightly different than render. Can teriary fix this?
const secondRender = (data) => {
    data.forEach(show => { 
        const cardInfo = document.querySelector('.show')
        const div = document.createElement("div")
        div.setAttribute('class', "episodes")
        const img = document.createElement('img')
        img.src = (show.image) ? show.image.medium : "https://www.freeiconspng.com/uploads/no-image-icon-15.png";
        const name = document.createElement('h3')
        name.innerText = show.name
        const type = document.createElement('h3')
        rating = show.rating.average
        type.innerText = rating > 0 ? `Rating: ${rating}/10` : 'Rating Unavailable';
        const text = document.createElement('p')
        text.className = "summary"
        text.innerHTML = show.summary
        const watchButton = document.createElement('button')
        watchButton.innerText= 'Add to Watch List'
        watchButton.setAttribute('class', 'watch-button')

        cardInfo.append(div)
        div.append(name, img, type, watchButton, text)

        addToList(watchButton, show)
   })
}

//adds name of episode to watch list
const addToList = (watchButton, show) => {
    const ul = document.querySelector(".watch-list")
    watchButton.addEventListener('click', (e) => {
        fetch('http://localhost:3000/watch', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(show)
        })
        .then(res => {
            if(res.status == 500){
                setTimeout(window.alert(`${show.name} is already in your watchlist`), 3000)
            } else {
                res.json()
            }
        })
        .catch(error => {console.log(error)})
    })
}

//watch list button that fetches db.json with episodes that have been added to watch list
const showWatchList = () =>{
    const watchListButton = document.querySelector('.watch-list')
    watchListButton.addEventListener('click', (e) => {
    fetch('http://localhost:3000/watch')
    .then(res => res.json())
    .then(data => {
        clearSearch()
        toWatch(data)
        const searchBar = document.querySelector('.search-bar')
        searchBar.innerHTML = ''
        const title = document.querySelector('h1')
        title.innerText = 'Watch List'
        })
    })
}

//renders episode data from db.json
const toWatch = (data) => {
    data.forEach(show => { 
        const cardInfo = document.querySelector('.show')
        const div = document.createElement("div")
        div.setAttribute('class', "episodes")
        const img = document.createElement('img')
        img.src = (show.image) ? show.image.medium : "https://www.freeiconspng.com/uploads/no-image-icon-15.png";
        const name = document.createElement('h3')
        name.innerText = show.name
        const type = document.createElement('h3')
        rating = show.rating.average
        type.innerText = rating > 0 ? `Rating: ${rating}/10` : 'Rating Unavailable';
        const text = document.createElement('p')
        text.className = "summary"
        text.innerHTML = show.summary
        const removeButton = document.createElement('button')
        removeButton.innerText= 'Remove From Watch List'
        removeButton.setAttribute('class', 'watch-button')

        cardInfo.append(div)
        div.append(name, img, type, removeButton, text)

        removeFromList(show, removeButton)
   })
}

//removes episodes from db.json then fetches db.json and updates page
const removeFromList = (show,removeButton) => {
    removeButton.addEventListener('click', (e) => {
        fetch(`http://localhost:3000/watch/${show.id}`, {
            method: 'DELETE',
        })
        .then(res => res.json())
        .catch(error => console.log(error))

        fetch('http://localhost:3000/watch')
        .then(res => res.json())
        .then(data => {
            clearSearch()
            toWatch(data)
            const searchBar = document.querySelector('.search-bar')
            searchBar.innerHTML = ''
            })
    })
}

//on load fetches db.json watch list
const init = () => {
    fetch('http://localhost:3000/watch')
    .then(res => res.json())
    .then(data => {
        clearSearch()
        toWatch(data)
        const searchBar = document.querySelector('.search-bar')
        searchBar.innerHTML = ''
        const title = document.querySelector('h1')
        title.innerText = 'Watch List'
        })
}

init()
searchForShow()
showWatchList()

