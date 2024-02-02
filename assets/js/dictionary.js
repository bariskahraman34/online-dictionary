const fontType = document.querySelectorAll('.font-type');
const darkThemeBtn = document.querySelector('#dark-theme-selector');
const searchForm = document.querySelector('#search-form');
const searchResultContainer = document.querySelector('.search-result-container');

searchForm.addEventListener('submit', e => sendRequest(e));

function sendRequest(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${formObj.word}`)
    .then(res => res.json())
    .then(data => {
        if(data.title){
            return searchResultContainer.innerHTML = 
            `
            <div class="no-found-icon">
            😕
            </div>
            <div class="no-found">${data.title}</div>
            <div class="message">${data.message + data.resolution}</div>
            `;
            
        }
        displayResult(data[0])
    })
}

function displayResult(data){
    searchResultContainer.innerHTML = 
    `
        <div class="search-result">
            <div class="search-result-text-container">
                <h2 class="result-text">${data.word}</h2>
                ${data.phonetic ? `<span class="result-pronunciation">${data.phonetic}</span>` : ""}
                
            </div>
            ${data.phonetics[0] && data.phonetics[0].audio && data.phonetics[0].audio !== "" ? `
            <div class="voiceover" onclick="playAudio()">
                <audio id="audio">
                    <source src=${data.phonetics[0].audio} type="audio/mp3">
                </audio>
            </div>` : ""}
        </div>
        <div class="word-type">
            <span class="word-type-text">${data.meanings[0].partOfSpeech}</span>
            <div class="line"></div>
        </div>
        <div class="meaning-container">
            <h3>Meaning</h3>
            <ul class="meaning-description-list">
                ${data.meanings[0].definitions.map(definition => `<li class="description-element">${definition.definition}</li>`).join('')}
            </ul>
        </div>
        ${data.meanings[0].synonyms.length != 0 ? `<div class="synonim-container">
        <span class="synonyms-title">Synonyms</span>
        ${data.meanings[0].synonyms.map(synonym => `<a href="#" class="synonyms-content">${synonym}</a>`)}
        </div>` : ""}
        ${data.meanings[0].antonyms.length != 0 ? `<div class="synonim-container">
        <span class="synonyms-title">Anthonyms</span>
        ${data.meanings[0].antonyms.map(antonym => `<a href="#" class="synonyms-content">${antonym}</a>`)}
        </div>` : ""}
        ${data.meanings[1] && data.meanings[1].partOfSpeech ? 
        `<div class="word-type">
            <span class="word-type-text">${data.meanings[1].partOfSpeech}</span>
            <div class="line"></div>
        </div>
        <div class="meaning-container">
            <h3>Meaning</h3>
            <ul class="meaning-description-list">
                ${data.meanings[1].definitions.map(definition => `<li class="description-element">${definition.definition}</li>`).join('')}
            </ul>
            ${data.meanings[1].definitions[0].example ? `<span class="example">"${data.meanings[1].definitions[0].example}"</span>` : ""}
            
        </div>` : ""}
        
        <div class="line last-line"></div>
        <div class="source-container">
            <span class="source-title">Source</span>
            <div class="source-link-container">
                <a class="source-link" target="_blank" href="${data.sourceUrls[0]}">${data.sourceUrls[0]}</a>
                <img src="assets/icons/source-link.svg" alt="">
            </div>
        </div>
    `;
    const similarWordsBtns = document.querySelectorAll('.synonyms-content');

    for (const similarBtn of similarWordsBtns) {
        similarBtn.addEventListener('click', e => displayClickedResult(e))
    }
}



function displayClickedResult(e){
    e.preventDefault();
    console.log(e.target.innerHTML)
    const searchInput = document.querySelector('#search');
    searchInput.value = e.target.innerHTML;
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${e.target.innerHTML}`)
    .then(res => res.json())
    .then(data => {
        if(data.title){
            return searchResultContainer.innerHTML = 
            `
            <div class="no-found-icon">
            😕
            </div>
            <div class="no-found">${data.title}</div>
            <div class="message">${data.message + data.resolution}</div>
            `;
        }
        console.log(data[0])
        displayResult(data[0])
    })
}