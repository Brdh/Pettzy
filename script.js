$(document).ready(function () {
    const sections = $('section');
    const navItems = $('.nav-item');
    const header = $('header');


    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $(this).find('i').toggleClass('fa-x');
    });

    function updateActiveNav() {
        const scrollPosition = $(window).scrollTop() + header.outerHeight();
        let activeSectionIndex = 0;

        sections.each(function (i) {
            const section = $(this);
            const sectionTop = section.offset().top;
            const sectionBottom = sectionTop + section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        });

        navItems.removeClass('active');
        $(navItems[activeSectionIndex]).addClass('active');
    }


    $(window).on('scroll', function () {
        const scrollPosition = $(window).scrollTop();

        if (scrollPosition <= 0) {
            header.css('box-shadow', 'none');
        } else {
            header.css('box-shadow', '5px 1px 5px rgba(0, 0, 0, 0.1)');
        }

        updateActiveNav();
    });


    $('.nav-item a').on('click', function () {
        setTimeout(updateActiveNav, 100);
    });












    ScrollReveal().reveal('.reveal-banner', {
        delay: 300,
        duration: 1000,
        origin: 'right',
        distance: '50px',
        easing: 'ease-in-out'
    });


});

