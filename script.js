const wrapper = document.querySelector(".wrapper"),
      infoText = wrapper.querySelector(".info-text"),
      searchInput = wrapper.querySelector("input"),
      volumeIcon = wrapper.querySelector(".word i"),
      removeIcon = wrapper.querySelector(".search span"),
      synonyms = wrapper.querySelector(".synonyms .list");

let audio;

function data(result, word) {
    if (result.title) {
        infoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please try to search for another word.`;
    } else {
        console.log(result);

        let meanings = result[0].meanings[0],
            definitions = meanings.definitions[0],
            phonetics = `${meanings.partOfSpeech} ${result[0].phonetics[0]?.text || ""}`;
        
        // Displaying word and phonetics
        wrapper.classList.add("active");
        document.querySelector(".word p").innerText = result[0].word; 
        document.querySelector(".word span").innerText = phonetics; 
        
        // Displaying definition
        document.querySelector(".content span").innerText = definitions.definition;

        // Displaying example if available, else showing a fallback message
        let example = definitions.example || "No example available";
        document.querySelector(".example span").innerText = example;

        // Setting up audio for pronunciation
        audio = new Audio(result[0].phonetics[0].audio);

        // Clearing previous synonyms before inserting new ones
        synonyms.innerHTML = '';

        // Displaying synonyms from result[0].meanings[0].synonyms, if available
        if (meanings.synonyms && meanings.synonyms.length > 0) {
            for (let i = 0; i < Math.min(5, meanings.synonyms.length); i++) {
                let span = document.createElement("span");
                span.textContent = meanings.synonyms[i];
                span.setAttribute("onclick", `search('${meanings.synonyms[i]}')`);
                synonyms.appendChild(span);
            }
            synonyms.parentElement.style.display = "block";
        } else {
            synonyms.parentElement.style.display = "none";
        }
    }
}

function fetchApi(word) {
    infoText.style.color = "#000";
    infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    
    fetch(url)
        .then(res => res.json())
        .then(result => data(result, word))
        .catch(() => {
            infoText.innerHTML = `Something went wrong. Please try again.`;
        });
}

function search(word) {
    searchInput.value = word;
    fetchApi(word);
}

searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

volumeIcon.addEventListener("click", () => {
    if (audio) audio.play();
});
removeIcon.addEventListener("click", ()=>{
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    infoText.style.color = "#09a9a9a";
    infoText.innerHTML = "Type a word and press enter to get meaning, example, pronunciation, and synonyms of that typed word.";
});