/* ============ CONFIGURACIÓN: cambiá estos datos ============ */
const CONFIG = {
  whatsapp: "5490000000000"   // código de país + área + número, sin + ni espacios
};

/* Fotos y videos de los carruseles.
   - type: "img" o "video"
   - src: ruta de tu archivo (ej: "imagenes/camara1.jpg"). Si lo dejás vacío se muestra un marcador de ejemplo.
   - poster: (solo video) imagen de portada opcional
   - title: texto que aparece sobre la foto */
const CAMARAS = [
  { type:"img",   src:"Media/Camaras/33.jpeg", title:"Instalación de cámaras" },
  { type:"img",   src:"Media/Camaras/44.jpeg", title:"Instalación de cámaras" },
  { type:"img",   src:"Media/Camaras/55.jpeg", title:"Instalación de cámaras" },
  { type:"img",   src:"Media/Camaras/66.jpeg", title:"Instalación de teléfono fijo" },
  { type:"img",   src:"Media/Camaras/77.jpg", title:"Configuración del grabador (NVR)" },
  { type:"img",   src:"Media/Camaras/88.jpg", title:"Cámara de Seguridad Activos" },
  { type:"img",   src:"Media/Camaras/99.jpg", title:"Cámara de Seguridad Activos" },
  { type:"img",   src:"Media/Camaras/10.jpg", title:"Switcher en Funcionamiento" },
  { type:"img",   src:"Media/Camaras/12.jpeg", title:"Instalación de cámaras" },
  { type:"img",   src:"Media/Camaras/14.jpeg", title:"Cámaras desde el Celular" },
  { type:"img",   src:"Media/Camaras/15.jpeg", title:"Instalación de cámaras" },
  { type:"img",   src:"Media/Camaras/16.jpeg", title:"Instalación de cámaras" },
  { type:"img",   src:"Media/Camaras/17.jpeg", title:"Cámara de Seguridad Activos" },
  { type:"img",   src:"Media/Camaras/18.jpeg", title:"Cámara de Seguridad Activos" },
  { type:"img",   src:"Media/Camaras/13.jpeg", title:"Switcher en Funcionamiento" }
];
const ELECTRICIDAD = [
  { type:"img",   src:"Media/Electricidad/1.jpg", title:"Colocación de luminarias" },
  { type:"img",   src:"Media/Electricidad/2.jpg", title:"Colocación de luminarias" },
  { type:"video", src:"", poster:"", title:"" },
  { type:"img",   src:"Media/Electricidad/4.jpg", title:"Colocación de luminarias" },
  { type:"video", src:"", poster:"", title:"" },
  { type:"video", src:"", poster:"", title:"" },
];
/* ============================================================ */

const $ = (s, r=document) => r.querySelector(s);
const wa = msg => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;

/* Imagen de ejemplo (se genera sola) */
function ph(texto, w=400, h=500){
  const s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2d3642"/><stop offset="1" stop-color="#15191F"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#g)"/><g fill="none" stroke="#E5A62C" stroke-width="6"><rect x="${w/2-50}" y="${h/2-60}" width="100" height="70" rx="10"/><circle cx="${w/2}" cy="${h/2-25}" r="16"/></g><text x="${w/2}" y="${h/2+50}" fill="#DCE3EA" font-family="sans-serif" font-size="${Math.round(w/20)}" text-anchor="middle">${texto}</text><text x="${w/2}" y="${h/2+80}" fill="#E5A62C" font-family="sans-serif" font-size="${Math.round(w/26)}" text-anchor="middle">Imagen de ejemplo</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(s);
}
document.querySelectorAll("img[data-ph]").forEach(i => { i.src = ph(i.dataset.ph, 800, 1000); });

/* Enlaces de WhatsApp */
document.querySelectorAll("[data-wa]").forEach(a => {
  a.href = wa(a.dataset.wa); a.target = "_blank"; a.rel = "noopener";
});

/* Contacto -> WhatsApp (el mensaje es opcional) */
const MENSAJE_POR_DEFECTO = "Hola, vi tu página web y quisiera consultar por un presupuesto. ¿Podrías indicarme cómo solicitarlo?";
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const texto = e.target.mensaje.value.trim();
  window.open(wa(texto || MENSAJE_POR_DEFECTO), "_blank", "noopener");
});

/* Menú móvil */
const burger = $(".burger"), menu = $("#menu");
burger.addEventListener("click", () => {
  const abierto = menu.classList.toggle("abierto");
  burger.setAttribute("aria-expanded", abierto);
});
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("abierto"); burger.setAttribute("aria-expanded", false); } });
document.addEventListener("click", e => {
  if (!menu.classList.contains("abierto")) return;
  if (menu.contains(e.target) || burger.contains(e.target)) return;
  menu.classList.remove("abierto");
  burger.setAttribute("aria-expanded", false);
});

/* Ampliar imágenes */
const zoom = $("#zoom");
$(".cerrar", zoom).addEventListener("click", () => zoom.close());
zoom.addEventListener("click", e => { if (e.target === zoom) zoom.close(); });
function ampliar(src, alt){
  const img = $("img", zoom);
  img.src = src; img.alt = alt;
  zoom.showModal();
}
/* Ventana de video centrada */
const ventanaVideo = $("#ventana-video");
function abrirVideo(src, poster, titulo){
  const v = $("video", ventanaVideo);
  v.src = src;
  v.poster = poster || "";
  $(".titulo", ventanaVideo).textContent = titulo || "";
  ventanaVideo.showModal();
  v.play().catch(() => {});
}
function cerrarVideo(){
  const v = $("video", ventanaVideo);
  v.pause(); v.removeAttribute("src"); v.load();
  ventanaVideo.close();
}
$(".cerrar", ventanaVideo).addEventListener("click", cerrarVideo);
ventanaVideo.addEventListener("click", e => { if (e.target === ventanaVideo) cerrarVideo(); });
ventanaVideo.addEventListener("close", () => { $("video", ventanaVideo).pause(); });

/* Carrusel infinito */
function carrusel(root, items){
  const track = $(".track", root), dotsBox = $(".dots", root);
  const n = items.length, C = 3;           // C = copias a cada lado para el efecto infinito
  let idx = C, ultimo = 0, inicioX = null, dx = 0, capturado = false, huboArrastre = false;

  const crear = it => {
    const fig = document.createElement("figure");
    fig.className = "slide" + (it.type === "video" ? " vid" : "");
    if (it.type === "video" && it.src){
      fig.innerHTML = `<video src="${it.src}#t=0.1" ${it.poster ? `poster="${it.poster}"` : ""} playsinline muted preload="metadata"></video>`;
      fig.addEventListener("click", () => { if (!huboArrastre) abrirVideo(it.src, it.poster, it.title); });
    } else {
      const src = it.src || ph(it.title);
      fig.innerHTML = `<img src="${src}" alt="${it.title}" draggable="false" loading="lazy">`;
      if (it.type !== "video") $("img", fig).addEventListener("click", () => { if (!huboArrastre) ampliar(src, it.title); });
    }
    fig.insertAdjacentHTML("beforeend", `<figcaption>${it.title}</figcaption>`);
    return fig;
  };
  for (let k = -C; k < n + C; k++) track.appendChild(crear(items[((k % n) + n) % n]));

  const paso = () => track.children[1].offsetLeft - track.children[0].offsetLeft;
  const marcar = () => [...dotsBox.children].forEach((d, i) => d.classList.toggle("on", i === ((idx - C) % n + n) % n));
  const pintar = (anim = true, extra = 0) => {
    track.style.transition = anim ? "" : "none";
    track.style.transform = `translateX(${-idx * paso() + extra}px)`;
    marcar();
  };
  /* Si quedamos en una copia, saltamos (sin que se note) a la foto original */
  const normalizar = () => {
    if (idx >= n + C) idx -= n; else if (idx < C) idx += n; else return;
    pintar(false);
    void track.offsetWidth;
  };
  const libre = () => {
    const ok = performance.now() - ultimo > 350;
    if (ok) ultimo = performance.now();
    return ok;
  };
  const mover = d => { if (!libre()) return; normalizar(); idx += d; pintar(); };
  const irA = i => { if (!libre()) return; normalizar(); idx = i + C; pintar(); };
  track.addEventListener("transitionend", e => { if (e.target === track) normalizar(); });

  items.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Ir a la foto " + (i + 1));
    b.addEventListener("click", () => irA(i));
    dotsBox.appendChild(b);
  });

  $(".next", root).addEventListener("click", () => mover(1));
  $(".prev", root).addEventListener("click", () => mover(-1));

  /* Deslizar con el dedo o el mouse (la foto acompaña al dedo) */
  track.addEventListener("pointerdown", e => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    normalizar();
    inicioX = e.clientX; dx = 0; capturado = false; huboArrastre = false;
  });
  track.addEventListener("pointermove", e => {
    if (inicioX === null) return;
    dx = e.clientX - inicioX;
    if (!capturado && Math.abs(dx) > 8){ capturado = true; track.setPointerCapture(e.pointerId); }
    if (capturado){ huboArrastre = true; pintar(false, dx); }
  });
  const soltar = () => {
    if (inicioX === null) return;
    inicioX = null;
    if (capturado && Math.abs(dx) > 50 && libre()) idx += dx < 0 ? 1 : -1;
    capturado = false;
    pintar(true);
  };
  track.addEventListener("pointerup", soltar);
  track.addEventListener("pointercancel", soltar);
  track.addEventListener("lostpointercapture", e => { if (e.target === track) soltar(); });

  window.addEventListener("resize", () => pintar(false));
  pintar(false);
}
carrusel($("#car-camaras"), CAMARAS);
carrusel($("#car-electricidad"), ELECTRICIDAD);
