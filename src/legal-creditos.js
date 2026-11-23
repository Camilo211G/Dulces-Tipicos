// Entrada de la página de créditos: monta las listas de atribución

import { setupLegalPage } from "./lib/legal-page.js";
import { CREDITOS } from "./lib/credits.js";

setupLegalPage();

const TITULOS = {
  foto: "Fotografías de terceros",
  ilustracion: "Ilustraciones del proyecto",
  pendiente: "Atribución pendiente",
};

for (const [tipo, host] of Object.entries({
  foto: document.querySelector('[data-credits="foto"]'),
  ilustracion: document.querySelector('[data-credits="ilustracion"]'),
  pendiente: document.querySelector('[data-credits="pendiente"]'),
})) {
  if (!host) continue;

  const items = CREDITOS.filter((c) => c.tipo === tipo);
  if (!items.length) continue;

  const lista = document.createElement("ul");
  lista.className = "credits__list";

  for (const item of items) {
    const li = document.createElement("li");
    li.className = "credits__item";

    const img = document.createElement("img");
    img.className = "credits__thumb";
    img.src = item.imagen;
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 56;
    img.height = 56;

    const data = document.createElement("div");
    data.className = "credits__data";

    const nombre = document.createElement("p");
    nombre.className = "credits__name";
    nombre.textContent = item.titulo;

    const meta = document.createElement("p");
    meta.className = "credits__meta";

    if (item.licencia) {
      meta.append(
        text("Autor: "),
        link(item.autor, item.autorUrl),
        text(" · Licencia: "),
        link(item.licencia, item.licenciaUrl),
        text(" · "),
        link("fuente", item.fuente)
      );
    } else {
      meta.append(text(item.nota));
    }

    data.append(nombre, meta);
    li.append(img, data);
    lista.appendChild(li);
  }

  const h3 = document.createElement("h3");
  h3.className = "sr-only";
  h3.textContent = TITULOS[tipo];

  host.replaceChildren(h3, lista);
}

function text(valor) {
  return document.createTextNode(valor);
}

function link(etiqueta, url) {
  const a = document.createElement("a");
  a.textContent = etiqueta;
  if (url) {
    a.href = url;
    a.rel = "noopener noreferrer";
    a.target = "_blank";
  }
  return a;
}
