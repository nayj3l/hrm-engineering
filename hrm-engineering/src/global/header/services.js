document.addEventListener("DOMContentLoaded", function () {
  const paragraphs = document.querySelectorAll(".details > div");
  const colors = ["#e1e1e1", "#f3a95e", "#ee7d22", "#e54e21"];

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  shuffleArray(colors);

  paragraphs.forEach((p, index) => {
    p.style.backgroundColor = colors[index];
  });

  // scroll listener
  let elems = document.querySelectorAll(".details > div p")
  let details = document.querySelector(".services > .details")
  let divs = document.querySelectorAll(".details > div")

  let options = {
    rootMargin: "0px",
    threshold: .6,
  };

  let introCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        elems.forEach((elem) => {
          elem.style.flex = '1'
          elem.style.opacity = '1'
        })
      }
      else {
        elems.forEach((elem) => {
          elem.style.width = '0'
          elem.style.flex = '0'
          elem.style.opacity = '0'
        })
      }
    });
  }

  const observer = new IntersectionObserver(introCallback, options)
  observer.observe(details)

  // programatically hover
  divs.forEach((div) => {
    div.addEventListener("mouseover", e => {
      let pTag = e.currentTarget.querySelector("p");
      pTag.style.width = '0'
      pTag.style.flex = '0'
      pTag.style.opacity = '0'
    });

    div.addEventListener("mouseleave", e => {
      let pTag = e.currentTarget.querySelector("p");
      pTag.style.flex = '1'
      pTag.style.opacity = '1'
    });
  })

});
