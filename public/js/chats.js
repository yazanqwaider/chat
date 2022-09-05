const toggleChatsMenuBtn = document.querySelector('.toggle-chats-menu-btn');
toggleChatsMenuBtn.addEventListener('click', function() {
    const peopleLayout = document.querySelector('.people-layout');
    const left = (peopleLayout.style.left.split('px')[0] < 0)? 0 : peopleLayout.clientWidth;
    peopleLayout.style.left = `-${left}px`;

    this.querySelector('.fa-solid').classList.toggle('fa-angles-right');
    this.querySelector('.fa-solid').classList.toggle('fa-angles-left');
});

