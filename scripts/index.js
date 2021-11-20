const wrapper = document.getElementById("wrapper");
const inputElement = document.getElementById("input-element");
const synonyms = document.getElementById("list");
const infoText = document.getElementById("info-text");
const volumeIcon = document.getElementById("volume-btn");
const clearIcon = document.getElementById("clear-icon");
let audio;

const data = (result, userInput) => {
  if (result.title) {
    infoText.innerHTML = `Can't find the meaning of <span>${userInput}</span>. Please, try searching another word.`;
  } else {
    wrapper.classList.add("active");

    const userInputWrapper = document.getElementById("user-input-wrapper");
    const phoneticsWrapper = document.getElementById("phonetics-wrapper");

    const meaningWrapper = document.getElementById("meaning-wrapper");
    const exampleWrapper = document.getElementById("example-wrapper");

    const definitions = result[0].meanings[0].definitions[0];
    const phonetics = `${result[0].meanings[0].partOfSpeech} - /${result[0].phonetics[0].text}/`;

    userInputWrapper.innerText = result[0].word;
    phoneticsWrapper.innerText = phonetics;

    meaningWrapper.innerText = definitions.definition;
    exampleWrapper.innerText = definitions.example;

    audio = new Audio(`https:${result[0].phonetics[0].audio}`);

    if (definitions.synonyms[0] === undefined) {
      synonyms.parentNode.parentNode.style.display = "none";
    } else {
      synonyms.parentNode.parentNode.style.display = "block";

      synonyms.innerHTML = "";

      for (let i = 0; i < 3; i++) {
        let tag = `<span onclick=searchSimilarMeaning('${definitions.synonyms[i]}')>${definitions.synonyms[i]},</span>`;
        if (!tag.includes("undefined")) {
          if (i === 2) {
            tag = `<span onclick=searchSimilarMeaning('${definitions.synonyms[i]}')>${definitions.synonyms[i]}</span>`;
          }
          synonyms.insertAdjacentHTML("beforeend", tag);
        }
      }
    }
  }
};

const searchSimilarMeaning = (similarMeaning) => {
  inputElement.value = similarMeaning;
  searchDictionary(similarMeaning);
};

const searchDictionary = (userInput) => {
  wrapper.classList.remove("active");

  infoText.style.color = "#000";
  infoText.innerHTML = `Searching the meaning of <span>"${userInput}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${userInput}`;

  fetch(url)
    .then((resp) => resp.json())
    .then((result) => data(result, userInput))
    .catch((err) => console.log(err));
};

inputElement.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && e.target.value) {
    searchDictionary(e.target.value);
  }
});

/* === Volume Control === */

volumeIcon.addEventListener("click", () => {
  volumeIcon.style.color = "#2196f3";
  audio.play();
  setTimeout(() => {
    volumeIcon.style.color = "#999";
  }, 1000);
});

/* === Clear User Input === */

clearIcon.addEventListener("click", () => {
  inputElement.value = "";
  inputElement.focus();
  wrapper.classList.remove("active");

  infoText.style.color = "#9a9a9a";
  infoText.innerText = `Type a word and hit enter to get the meaning, pronunciation, example, and synonyms of the word that you've typed in.`;
});
