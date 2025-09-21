import faviconDm from "../img/favicon-dm.svg";
import appleTouchDm from "../img/apple-touch-icon-dm.png";
import maskIconDm from "../img/safari-pinned-tab-dm.svg";
import manifestDm from "../img/site-dm.webmanifest?url";

import faviconLight from "../img/favicon.svg";
import appleTouchLight from "../img/apple-touch-icon.png";
import maskIconLight from "../img/safari-pinned-tab.svg";
import manifestLight from "../img/site.webmanifest?url";

const init = () => {
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  if (darkModeMediaQuery.matches) {
    setDarkModeFavicon();
  }

  darkModeMediaQuery.addEventListener("change", (e) => {
    if (e.matches) {
      setDarkModeFavicon();
    } else {
      setLightModeFavicon();
    }
  });
};

const setDarkModeFavicon = () => {
  document.querySelector('link[rel="icon"]').href = faviconDm;
  document.querySelector('link[rel="apple-touch-icon"]').href = appleTouchDm;
  document.querySelector('link[rel="mask-icon"]').href = maskIconDm;
  document.querySelector('link[rel="manifest"]').href = manifestDm;
};

const setLightModeFavicon = () => {
  document.querySelector('link[rel="icon"]').href = faviconLight;
  document.querySelector('link[rel="apple-touch-icon"]').href = appleTouchLight;
  document.querySelector('link[rel="mask-icon"]').href = maskIconLight;
  document.querySelector('link[rel="manifest"]').href = manifestLight;
};

export default init;
