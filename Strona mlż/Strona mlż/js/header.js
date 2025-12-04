const body = document.querySelector("body"),
      menus = body.querySelector(".menus"),
      ListRoll = body.querySelector(".ListRoll");

menus.addEventListener("click", () => {

    ListRoll.classList.toggle("invisible"); 

})