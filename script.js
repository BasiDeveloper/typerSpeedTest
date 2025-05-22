const random_words = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "is", "are", "am", "was", "were", "had", "has", "did", "been", "being",
  "love", "hate", "feel", "walk", "run", "play", "read", "write", "talk", "eat",
  "drink", "sleep", "think", "open", "close", "stop", "start", "find", "lose", "call",
  "help", "show", "live", "stay", "move", "stand", "sit", "laugh", "cry", "drive",
  "ride", "cook", "clean", "jump", "watch", "listen", "buy", "sell", "cut", "grow",
  "build", "break", "carry", "draw", "paint", "sing", "dance", "smile", "shout", "win",
  "game", "home", "school", "city", "country", "animal", "friend", "family", "parent", "child",
  "mother", "father", "sister", "brother", "dog", "cat", "car", "bus", "bike", "train",
  "food", "water", "milk", "coffee", "tea", "fruit", "apple", "banana", "orange", "bread",
  "egg", "rice", "meat", "soup", "sugar", "salt", "happy", "sad", "tired", "angry",
  "hot", "cold", "fast", "slow", "big", "small", "long", "short", "young", "old",
  "early", "late", "hard", "easy", "light", "dark", "high", "low", "right", "left"
];


let input = document.getElementById("input")
let output = document.getElementById("output")
let divCaret = document.getElementById("caret")
let typer = document.querySelector('.typer')
let timerValue = document.getElementById("value")
let typeWrapper = document.querySelector(".typerWrapper")
let perWord = document.getElementById("perWord")
let mistakes = document.getElementById("mistakes")
let btnSelection= document.querySelectorAll(".btnSelection")
let start = document.getElementById("start")
let diff = document.querySelector(".difficulties")
let sel = window.getSelection();
let wordsLength = 0, scrolltop = 0, typing = false, inter, time = 6000/100;
let cnt = 0, delay = 0;

function combineWords(length = 181) {
   let generatedParagraph = ""
    for(let i = 0; i < length; i++) {
      let random = random_words[Math.floor(Math.random()*random_words.length)]
      generatedParagraph += random+" "
    }
  return generatedParagraph;
}

function generateWord() {
  let activeSel = document.querySelector(".btnSelection.active")
  input.innerText = ""
  output.innerText = ""
  scrolltop = 0
  cnt = 0
  delay = 0
  typing = false
  timerValue.style.width = `${cnt}%`
  typeWrapper.style.translate = `0 ${scrolltop})`
  input.setAttribute("contenteditable", "true")
  typer.classList.add('show');
  input.focus()
  
  let random = combineWords(parseInt(activeSel.value));
  let words = random.split(" ");
  
  for(let word of words) {
    let cel = document.createElement("span")
    cel.setAttribute("class", "word")
    for(const letter of word.split('')) {
      let span = document.createElement("span");
      span.setAttribute("class", "letter")
      span.innerText = letter;
      cel.appendChild(span)
    }
    
    let space = document.createElement("span");
    space.setAttribute("class", "letter space")
    space.innerText = " "
    output.appendChild(cel)
    output.appendChild(space)
  }
  wordsLength = words.length -1
  perWord.innerText = `0/${wordsLength}`
  divCaret.style.left = `${7}px`
  divCaret.style.top = `${12}px`
}

console.clear()
start.addEventListener("click", function() {
   if(start.classList.contains("begin")) {
     start.innerText = "Generate"
     generateWord()
  } 
  if(start.classList.contains("restart")) {
     window.cancelAnimationFrame(inter)
     diff.classList.add("show")
     start.innerText = "Generate"
     generateWord()
  }
})
input.addEventListener("keyup", function(e) {
  if(e.key === "ArrowLeft") {
    sel.setPosition(input.lastChild, input.innerText.length)
  }
})
typer.addEventListener("click", function (e) {
  input.click()
})
input.addEventListener("click", function() {
    if(input.lastChild) sel.setPosition(input.lastChild, input.innerText.length)
  input.focus()
})
input.addEventListener('blur', function(e) {
  divCaret.classList.remove("active")
})
input.addEventListener('focus', function(e) {
  divCaret.classList.add("active")
})

input.addEventListener("input", function(e) {
  console.clear()
  if(!typing) {
    timer()
    diff.classList.remove("show")
    start.classList.remove("begin")
    start.classList.add("restart")
    start.innerText = "Restart"
    typing = true
  }
 if(e.inputType === "insertParagraph") {
   input.innerText = input.innerText.replace(/\n/g, '');
   sel.setPosition(input.lastChild, input.innerText.length)
   return;
 }

  let letters = document.getElementsByClassName("letter");
  for(let i = 0; i < letters.length; i++) {
    let el = letters[i]
    if(i > sel.focusOffset -1) {
      el.classList.remove('error')
      el.classList.remove('correct')
    }
  }
  if(sel.focusOffset +1 >= letters.length -1) {
    window.cancelAnimationFrame(inter)
    input.setAttribute("contenteditable", "false")
    start.innerText = "New Game"
    typer.classList.remove('show');
    diff.classList.add("show")
  }
  if(sel.focusOffset <= 0) {
     divCaret.style.left = `${3}px`
  divCaret.style.top = `${12}px`
    mistakes.innerText = `${0}` 
    return;
  }

   //caret
 
  let caret = sel.getRangeAt(0).cloneRange();
  let parent = typeWrapper.getBoundingClientRect()
  let pos = caret.getClientRects()[0]
  divCaret.style.left = `${pos.left - parent.left -2}px`
  divCaret.style.top = `${pos.top - parent.top - 3}px`
  let rootParent = typer.getBoundingClientRect()
  if(pos.top - rootParent.top >= rootParent.height - 50 && parent.height > rootParent.height) { 
    scrolltop += 60
    typeWrapper.style.translate = `0 -${scrolltop}px`
  }
  if(e.inputType === "deleteContentBackward" && pos.top - rootParent.top < 0) {
    scrolltop -= 60
    typeWrapper.style.translate = `0 -${scrolltop}px`
  }
  
  let range = document.createRange();
  range.setStart(input.lastChild, sel.focusOffset-1);
  range.setEnd(input.lastChild, sel.focusOffset);
  let text = range.toString()
  let span = letters[sel.focusOffset -1];
  //for white spaces
  
  if(text.search(/\s/g) > -1 && span.innerText.search(/\s/g) > -1) {
    span.classList.remove("error")
  }
  if(text.search(/\s/g) > -1 && span.innerText.search(/\s/g) === -1) {
    span.classList.add("error")
  }
  console.log(text+span.innerText)
  //for words
  if(text.search(/\s/g) <= -1 && text === span.textContent) {
    span.classList.remove("error")
    span.classList.add("correct")
  }
  if(text.search(/\s/g) <= -1 && text !== span.innerText) {
    span.classList.remove("correct")
    span.classList.add("error")
  }

  let words = document.querySelectorAll("span.word");

   let corrects = Array.from(words).map((el, i) => {
   let children = Array.from(el.children);
   let isCorrect = children.every(c => c.classList.contains("correct"))
   if(isCorrect) return el
 }).filter(und => und !== undefined)
  let incorrects = document.getElementsByClassName("error")

  perWord.innerText = `${corrects.length -1}/${wordsLength}`
  mistakes.innerText = `${incorrects.length}`
})

window.addEventListener("resize", function() {
  if(sel.focusOffset <= 0) return
  let caret = sel.getRangeAt(0).cloneRange();
  let parent = typeWrapper.getBoundingClientRect()
  let pos = caret.getClientRects()[0]
  divCaret.style.left = `${pos.left - parent.left -2}px`
  divCaret.style.top = `${pos.top - parent.top - 3}px`
  
})


function timer() {
  delay += 1
  if(delay >= time) {
    cnt += 1
    timerValue.style.width = `${cnt}%`
    delay = 0
    if(cnt >= 100) {
    input.setAttribute("contenteditable", "false")
    start.innerText = "New Game"
    typer.classList.remove('show');
    window.cancelAnimationFrame(inter)
    return;
  }
  }
  inter = window.requestAnimationFrame(timer)
}
btnSelection.forEach(function(btn, i, arr) {
  btn.addEventListener("click", function() {
    arr.forEach(el => el.classList.remove("active"))
    btn.classList.add("active")
    start.click()
  })
})
