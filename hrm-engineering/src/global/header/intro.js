
let options = {
  rootMargin: "0px",
  threshold: .3,
};

let introCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const objs = document.querySelectorAll(".highlight");
      let end1 = parseInt(objs[0].textContent, 10);
      animateValue(objs[0], 0, 800, 2800, '+');

      let end2 = parseInt(objs[1].textContent, 10);
      animateValue(objs[1], 0, 20, 2000, '+');

      let end3 = parseInt(objs[2].textContent, 10);
      animateValue(objs[2], 0, end3, 1000);
    }
  });
}

const observer = new IntersectionObserver(introCallback, options)
observer.observe(document.querySelector(".highlight"))

function animateValue(obj, start, end, duration, concat='') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start) + concat;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}