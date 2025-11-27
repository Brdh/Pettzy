// Script para controlar o menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const mobileBtn = document.getElementById('mobile_btn');
    const mobileMenu = document.getElementById('mobile_menu');

    // Adicionar evento de clique
    if (mobileBtn) {
        mobileBtn.addEventListener('click', function() {
            
            mobileMenu.classList.toggle('active');
        });
    }

    // Fechar o menu quando clicar em um link
    const mobileNavLinks = document.querySelectorAll('#mobile_nav_list a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });

    // Fechar o menu quando clicar fora dele
    document.addEventListener('click', function(event) {
        const isClickInsideHeader = document.querySelector('header').contains(event.target);
        
        if (!isClickInsideHeader && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
        }
    });
});