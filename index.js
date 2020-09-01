window.onload = init;
let questions;
let questionCounter = 0;
let questionLimit = 2;
let correctAnswer;
let currentSource;

function init() {
    fetchQuestions();
    _("begin-button").addEventListener("click", function() {
	_("begin-button").style.display = "none";
	tag("main")[0].style.alignItems = "initial";
	tag("main")[0].style.paddingTop = "50px";
	_("quiz").style.display = "initial";
	_("next-button").addEventListener("click", nextQuestion);
    });
}

function fetchQuestions() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200) {
	    questions = JSON.parse(xhr.responseText);
	    nextQuestion();
	}
    };
    xhr.open("GET", "questions.json", true);
    xhr.send();
}

function nextQuestion() {
    let checked = false;
    let selected;
    _("message").className = "";
    document.getElementsByName("choice").forEach(function(button) {
	if(button.checked) {
	    checked = true;
	    selected = button.value;
	}
    });

    if(questionCounter > 0 && !checked) {
	_("message").innerHTML = "You must choose an answer.";
	_("message").style.visibility = "initial";
	return;
    }

    if(selected != correctAnswer) {
	document.querySelector("[data-index='" + selected + "']").classList.add("wrong");
	_("message").innerHTML = "Wrong choice. Try again.";
	_("message").classList.add("wrong");
	_("message").style.visibility = "initial";
	return;
    } else if(questionCounter > 0) {
	_("message").innerHTML = "Correct! <br> <span id='source'>Source: <a href='" + questionSource + "' target='_blank'>" + questionSource + "></span>";
	_("message").classList.add("right");
	_("message").style.visibility = "initial";
    }
    
    let question;
    _("choices").innerHTML = "";
    
    if(questionCounter == questionLimit) {
	tag("h4")[0].style.display = "none";
	_("question").innerHTML = "Refresh the page to do the quiz again.";
	_("next-button").style.display = "none";
	
	return;
    }
    
    if(questionCounter < questionLimit) {
	_("question-number").innerHTML = questionCounter + 1 + " of " + questionLimit;
	question = questions[questionCounter++];
	questionSource = question.source;
	_("question").innerHTML = question.question;
    } else {
	return;
    }
    
    question.choices.forEach(function(item, index) {
	let li = document.createElement("li");

	let radioButton = document.createElement("input");
	radioButton.type = "radio";
	radioButton.name = "choice";
	radioButton.value = index;
	li.appendChild(radioButton);

	let choiceText = document.createElement("p");
	choiceText.innerHTML = " " + item;
	choiceText.style.display = "inline";
	choiceText.dataset.index = index;
	li.appendChild(choiceText);
	
	_("choices").appendChild(li);
    });

    correctAnswer = question["correct-answer"];
    
    if(questionCounter == questionLimit) {
	_("next-button").innerHTML = "Finish";
    }
}

function _(id) {
    return document.getElementById(id);
}

function tag(id) {
    return document.getElementsByTagName(id);
}
