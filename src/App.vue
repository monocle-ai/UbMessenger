<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      PageName: "UbMessenger"
    };
  },
  mounted: function() {
    if (window.timer != null) {
      clearInterval(window.timer);
      window.timer = null;
    }
  },

  methods: {
    moveToSettings() {
      this.$router.push({ name: "Settings" });
      //closeNavBar();
    },
    moveToHome() {
      this.$router.push({ name: "ConvList" });
    }
  }
};

// nav bar :
document.addEventListener("DOMContentLoaded", () => {
  // Get all "navbar-burger" elements
  const $navbarBurgers = Array.prototype.slice.call(
    document.querySelectorAll(".navbar-burger"),
    0
  );

  // Check if there are any navbar burgers
  if ($navbarBurgers.length > 0) {
    // Add a click event on each of them
    $navbarBurgers.forEach(el => {
      el.addEventListener("click", () => {
        closeNavBar(el);
      });
    });
  }
});

function closeNavBar(el) {
  // Get the target from the "data-target" attribute
  const target = el.dataset.target;
  const $target = document.getElementById(target);

  // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
  el.classList.toggle("is-active");
  $target.classList.toggle("is-active");
}

// load navigation bar
/*
async function fetchHtmlAsText(url) {
    return await (await fetch(url)).text();
}

// this is your `load_home() function`
async function loadHome() {
    const contentDiv = document.getElementById("menubar");
    contentDiv.innerHTML = await fetchHtmlAsText("home.html");
}*/
</script>