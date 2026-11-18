'use strict';

const catalog = document.querySelector('.catalog-grid');
for (const [collection, items] of Object.entries(window.PORTFOLIO_COLLECTIONS)) {
  for (const item of items) {
    const link = document.createElement('a');
    link.className = 'catalog-item';
    link.href = collection + '.html#' + item.id;
    const image = document.createElement('img');
    image.src = item.image;
    image.alt = '';
    image.loading = 'lazy';
    const title = document.createElement('h2');
    title.textContent = item.title;
    const caption = document.createElement('p');
    caption.textContent = item.material;
    link.append(image, title, caption);
    catalog.append(link);
  }
}
