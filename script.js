const container = document.querySelector("main");
const popupBlock = document.querySelector(".popup-wrapper");
const popupAddWr = document.querySelector("#popupAdd-wrapper");
const popupUpdWr = document.querySelector("#popupUpd-wrapper");
const popupInfoWr = document.querySelector("#popupInfo-wrapper");
const infoContent = document.querySelector("#popup__infoContent");

const updCatForm = document.querySelector("#updCatForm");

const addForm = document.forms.addCatForm;
const updForm = document.forms.updCatForm;

const infoCards = document.getElementsByClassName("cardInfo");
const cards = document.getElementsByClassName("card");

document.getElementById("user").addEventListener("click", () => {
	localStorage.removeItem("catUser");
});

let user = localStorage.getItem("catUser");
if (!user) {
	user = prompt("Представьтесь, пожалуйста")
	localStorage.setItem("catUser", user);
}

document.querySelector("#addCat").addEventListener("click", (e) => {
	e.preventDefault();
    popupBlock.classList.add("active");
});

popupAddWr.querySelector(".popup__close").addEventListener("click", () => {
	popupBlock.classList.remove("active");
});

popupInfoWr.querySelector(".popup__close").addEventListener("click", () => {
	popupInfoWr.classList.remove("active");
    infoContent.innerHTML = "";
});

popupUpdWr.querySelector(".popup__close").addEventListener("click", () => {
	popupUpdWr.classList.remove("active");
    updForm.dataset.id = "";
});

const createInfoCard = (cat, parent) => {
    const cardInfo = document.createElement("div");
    cardInfo.className ="cardInfo";
    cardInfo.dataset.id = cat.id;

    const infoImg = document.createElement("div");
    infoImg.className ="card__img";
    infoImg.style.backgroundImage = `url(${cat.img_link})`;

    if(cat.img_link) {
        infoImg.style.backgroundImage = `url(${cat.img_link})`;
    } else {
        infoImg.style.backgroundImage = "url(https://github.com/jennyfil/CuteCats/blob/main/img/NoCat.jpg)";
        infoImg.style.backgroundSize = "contain";
        infoImg.style.backgroundColor = "transparent";
    }

    const catInfoBlock = document.createElement("div");
    catInfoBlock.className = "catInfo";

    const nameInfo = document.createElement("h2");
    nameInfo.innerText = cat.name;

    const ageInfo = document.createElement("h3");
    switch(true) {
        case (cat.age === 1): ageInfo.innerText = "1 год";
        break;
        case (cat.age > 1 && cat.age < 5): ageInfo.innerText = `${cat.age} года`;
        break;
        case (cat.age > 4 && cat.age < 21): ageInfo.innerText = `${cat.age} лет`;
        break;
        default: ageInfo.innerText = "Кот-долгожитель";
    }

    const rateInfo = document.createElement("div");
    rateInfo.className = "rateInfo";

    const heart = document.createElement("span");
    heart.innerText = "\u{1F5A4}";
    if (cat.rate === 0) {
        heart.innerText = "";  
    } else {
        for (let i = 1; i < cat.rate; i++) {
            heart.innerText = heart.innerText + "\u{1F5A4}";
        }
    }

    rateInfo.append(heart);

    const descriptionInfo = document.createElement("p");
    descriptionInfo.className = "catDescription"
    descriptionInfo.innerText = cat.description;

    const idInfo = document.createElement("p");
    idInfo.innerText = `Номер котика: ${cat.id}`;

    const updCatBtn = document.createElement("button");
    updCatBtn.className = "btn";
    updCatBtn.innerText = "Изменить";

    catInfoBlock.append(nameInfo, idInfo, ageInfo, rateInfo, descriptionInfo, updCatBtn);
    cardInfo.append(infoImg, catInfoBlock);
    parent.append(cardInfo);

    updCatBtn.addEventListener("click", (e) => {
        popupUpdWr.classList.add("active");
        showForm(cat);
		updForm.setAttribute("data-id", cat.id);
    })
}

const showForm = (data) => {
	// console.log(data);
	for (let i = 0; i < updForm.elements.length; i++) {
		let el = updForm.elements[i];
        // console.log(el.name);
		if (el.name) {
			if (el.type !== "checkbox") {
				el.value = data[el.name] ? data[el.name] : "";
			} else {
				el.checked = data[el.name];
			}
		}
	}
}

const createCard = (cat, parent) => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = cat.id;

    const cardLike = document.createElement("div");
    cardLike.innerText = "\u{2764}";
    cardLike.className = "card__fav";

    if(cat.favourite === true) {
        cardLike.style.color = 'rgb(227, 80, 80)';
    } else {
        cardLike.style.color = 'rgb(236, 176, 176)';
    }

    cardLike.addEventListener("click", (e) => {
        if(cat.favourite === false) {
            cat.favourite = true;
            cardLike.style.color = 'rgb(227, 80, 80)';
        } else {
            cat.favourite = false;
            cardLike.style.color = 'rgb(236, 176, 176)';
        }
        updCat(cat, card.dataset.id);
    })
    const img = document.createElement("div");
    img.className ="card__img";

    if(cat.img_link) {
        img.style.backgroundImage = `url(${cat.img_link})`;
    } else {
        img.style.backgroundImage = "url(https://github.com/jennyfil/CuteCats/blob/main/img/NoCat.jpg)";
        img.style.backgroundSize = "contain";
        img.style.backgroundColor = "transparent";
    }

    const name = document.createElement("h3");
    name.innerText = cat.name;

    const del = document.createElement("button");
    del.id = cat.id;
    del.className = "btn";
    del.innerText = "Удалить";
    del.addEventListener("click", (e) => {
		let id = e.target.id;
		deleteCat(id, card);
	});

    card.append(cardLike, img, name, del);
    parent.append(card);

    card.addEventListener("click", (e) => {
        if(e.target != del && e.target != cardLike) {
            popupInfoWr.classList.add("active");
            showCat(cat);
        }
    });
}

const showCat = (cat) => {
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show/${cat.id}`)
    .then(res => res.json())
    .then(data => {
        if(data.message === "ok") {
            createInfoCard(cat, infoContent);
        }
    })
}


fetch(`https://sb-cats.herokuapp.com/api/2/${user}/show`)
    .then(res => res.json())
    .then(result => {
        if(result.message === "ok") {
            // console.log(result.data);
            result.data.forEach((el) => {
                createCard(el, container);
            })
        }
    })


const deleteCat = (id, tag) => {
    fetch(`https://sb-cats.herokuapp.com/api/2/${user}/delete/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        if (data.message === "ok") {
            tag.remove();
        }
    })
}

const addCat = (cat) => {
	fetch(`https://sb-cats.herokuapp.com/api/2/${user}/add`, {
		method: "POST",
		headers: { 
			"Content-Type": "application/json"
		},
		body: JSON.stringify(cat)
	})
    .then(res => res.json())
    .then(data => {
        // console.log(data);
        if (data.message === "ok") {
            createCard(cat, container);
            addForm.reset();
            popupBlock.classList.remove("active");
        }
    })
}

addForm.addEventListener("submit", (e) => {
	e.preventDefault();
	let body = {}; 

	for (let i = 0; i < addForm.elements.length; i++) {
		let el = addForm.elements[i];
		// console.log(el);
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}
	// console.log(body);
	addCat(body);
});

const updCat = (cat, id) => {
	fetch(`https://sb-cats.herokuapp.com/api/2/${user}/update/${id}`, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(cat)
	})
    .then(res => res.json())
    .then(answer => {
        if (answer.message === "ok") {
            updCard(cat, id);
            updInfoCard(cat, id);
            updForm.reset();
            updForm.dataset.id = "";
        }
    })
}


updForm.addEventListener("submit", (e) => {
	e.preventDefault();
	let body = {}; 
	for (let i = 0; i < updForm.elements.length; i++) {
		let el = updForm.elements[i];
		if (el.name) {
			body[el.name] = el.name === "favourite" ? el.checked : el.value;
		}
	}
	delete body.id;
	// console.log(body);
	updCat(body, updForm.dataset.id);
    popupUpdWr.classList.remove("active");
});

const updCard = (data, id) => {
	for (let i = 0; i < cards.length; i++) {
		let card = cards[i];

		if (card.dataset.id === id) {
			card.querySelector(".card__img").style.backgroundImage = data.img_link ? `url(${data.img_link})` : `url(https://github.com/jennyfil/CuteCats/blob/main/img/NoCat.jpg)`;
            card.querySelector("h3").innerText = data.name || "noname";
		}
	}
}

const updInfoCard = (data, id) => {
	for (let i = 0; i < infoCards.length; i++) {
		let card = infoCards[i];
        // console.log(card);
		if (card.dataset.id === id) {

			card.querySelector(".card__img").style.backgroundImage = data.img_link ? `url(${data.img_link})` : `url(https://github.com/jennyfil/CuteCats/blob/main/img/NoCat.jpg)`;
            card.querySelector("h2").innerText = data.name || "noname";

            let currentAge;
            switch(true) {
                case data.age == 1: currentAge = `1 год`;
                break;
                case (data.age > 1 && data.age < 5): currentAge = `${data.age} года`;
                break;
                case (data.age > 4 && data.age < 21): currentAge = `${data.age} лет`;
                break;
                default: currentAge = "Кот-долгожитель";
            }
			card.querySelector("h3").innerText = currentAge || "";
        
            const rateInfo = card.querySelector(".rateInfo");
            rateInfo.innerText = "";

            if (data.rate === 0) {
                rateInfo.innerText = "";  
            } else {
                for (let i = 0; i < data.rate; i++) {
                    rateInfo.innerText = rateInfo.innerText + "\u{1F5A4}";
                }
            }

            card.querySelector(".catDescription").innerText = data.description || "";    
		}
	}
}
