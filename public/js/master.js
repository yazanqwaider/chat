const menuBtn = document.getElementById('menu-btn');
menuBtn.addEventListener('click', function() {
    const headerMenuItems = document.getElementById('header-menu-items');
    headerMenuItems.classList.toggle('collapse-header-menu');
});