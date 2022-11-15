// const EMPTY_HEART = '♡'
// const FULL_HEART = '♥'

//fetches data for the show
const init = () => {
    let tvID = "3252"
    fetch(`https://api.tvmaze.com/shows/${tvID}/episodes`)
    .then(res => res.json())
    .then(data => {
        render(data)
        filter(data)
        console.log(data)
    })
}

let rating = 0

//renders show info to page
const render = (data) => {
    data.forEach(show => { 
        const cardInfo = document.querySelector('.show')
        const div = document.createElement("div")
        div.setAttribute('class', "episodes")
        const img = document.createElement('img')
        img.src = show.image.medium
        const cardRandom = document.querySelector('#card-random')
        const name = document.createElement('h3')
        name.innerText = show.name
        const type = document.createElement('h3')
        rating = show.rating.average 
        type.innerText = `Rating: ${rating}/10`
        const text = document.createElement('p')
        text.innerHTML = show.summary
        const likeButton = document.createElement('button')
        likeButton.innerText = "Like"
        const watchButton = document.createElement('button')
        watchButton.innerText= 'Add to Watch List'
        watchButton.setAttribute('class', 'watch-button')

        
        cardInfo.append(div)
        div.append(name, img, type, likeButton, watchButton, text)

        buttonListen(likeButton, rating, type)
        addToList(watchButton, show)
        
   })
}

//adds a value to the shows rating
const buttonListen = (likeButton, rating, type) => {
    likeButton.addEventListener('click', (e) => {
        rating = rating + 1
        type.innerText = `Rating: ${rating}/10`
    })
}

//creates drop down options for each season
const toggle = () => {
    const seasons = ["all", 1, 2, 3, 4, 5, 6]
    const search = document.querySelector(".search-bar")
    const select = document.createElement('select')
    for (let i = 0; i < seasons.length; i++){
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
    const filterButton = document.querySelector('#search')
    const select = document.querySelector('select')
    filterButton.addEventListener('click', (e) => {
        e.preventDefault()
        //if select value = 0 then return all episodes
        if (select.value == 0){
            //clears previous search and renders all episodes from data
            clearSearch()
            render(data)
        } else {
            let season = data.filter(episode => {
                return select.value == episode.season
            })
            //clears previous search and renders for selected season
            clearSearch()
            render(season)
        }
    })
}

//adds name of episode to watch list
const addToList = (watchButton, show) => {
    const ul = document.querySelector(".watch-list")
    watchButton.addEventListener('click', (e) => {
        console.log(e.target)
        const li = document.createElement('li')
        ul.append(li)
        li.innerText = show.name
    })
}

const clearSearch = () => {
    const cardInfo = document.querySelector('.show')
    cardInfo.innerHTML = ""
}


init()
toggle()