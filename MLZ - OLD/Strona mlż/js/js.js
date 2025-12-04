const bodyE = document.querySelector("body"),
      lightButton = bodyE.querySelector(".lightButton");

lightButton.addEventListener("click", () => {

    bodyE.classList.toggle("light"); 

})

