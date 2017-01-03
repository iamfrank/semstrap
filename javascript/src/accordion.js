var btns = document.querySelectorAll('.accordion [aria-controls]');

for (var i = 0; i < btns.length; ++i) {
    var b = btns[i];
    var accContent = document.getElementById( b.getAttribute('aria-controls') );
    
    if (b.getAttribute('aria-expanded') === 'true') {
        accContent.style.display = 'block';
    };
    
    b.addEventListener('click', function(ev) {
        var el = ev.target;
        var panel = document.getElementById( el.getAttribute('aria-controls') )
        if (el.getAttribute('aria-expanded') === 'true') {
            el.setAttribute('aria-expanded', 'false');
            panel.style.display = 'none';
        } else {
            el.setAttribute('aria-expanded', 'true');
            panel.style.display = 'block';
        };
    });
};
