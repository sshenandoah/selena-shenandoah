(function () {
  // Collect all lightbox-eligible images on the page
  var SELECTORS = [
    '.photo-item img',
    '.card-img img',
    '.about-portrait img',
    '[data-lb]'
  ];

  var overlay, imgEl, prevBtn, nextBtn;
  var images = [];   // flat array of src strings
  var current = 0;

  function buildOverlay() {
    overlay = document.createElement('div');
    overlay.className = 'lb-overlay';
    overlay.innerHTML = [
      '<button class="lb-close" aria-label="Close">&times;</button>',
      '<button class="lb-arrow lb-prev" aria-label="Previous">&#8592;</button>',
      '<div class="lb-inner"><img class="lb-img" src="" alt=""></div>',
      '<button class="lb-arrow lb-next" aria-label="Next">&#8594;</button>'
    ].join('');
    document.body.appendChild(overlay);

    imgEl   = overlay.querySelector('.lb-img');
    prevBtn = overlay.querySelector('.lb-prev');
    nextBtn = overlay.querySelector('.lb-next');

    overlay.querySelector('.lb-close').addEventListener('click', close);
    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); navigate(-1); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); navigate(1); });

    // Click outside image closes
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.classList.contains('lb-inner')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape')      close();
      if (e.key === 'ArrowLeft')   navigate(-1);
      if (e.key === 'ArrowRight')  navigate(1);
    });
  }

  function open(src) {
    current = images.indexOf(src);
    if (current === -1) { current = 0; }
    show();
  }

  function show() {
    imgEl.src = images[current];
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    var multiple = images.length > 1;
    prevBtn.style.display = multiple ? '' : 'none';
    nextBtn.style.display = multiple ? '' : 'none';
  }

  function navigate(dir) {
    current = (current + dir + images.length) % images.length;
    show();
  }

  function close() {
    overlay.classList.remove('open');
    imgEl.src = '';
    document.body.style.overflow = '';
  }

  function init() {
    buildOverlay();

    // Gather images (only from the same "gallery group" on the page)
    var seen = new Set();
    SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        var src = el.src || el.getAttribute('data-lb');
        if (src && !seen.has(src)) {
          seen.add(src);
          images.push(src);
        }
      });
    });

    // Attach click handlers
    SELECTORS.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        var src = el.src || el.getAttribute('data-lb');
        if (!src) return;
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          open(src);
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
