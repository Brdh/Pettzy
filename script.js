$(document).ready(function () {
    const sections = $('section');
    const navItems = $('.nav-item');
    const header = $('header');


    $('#mobile_btn').on('click', function () {
        $('#mobile_menu').toggleClass('active');
        $(this).find('i').toggleClass('fa-x');
    });

    function updateActiveNav() {
        const scrollPosition = $(window).scrollTop();
        const viewportCenter = scrollPosition + $(window).height() / 2;

        // Remove a classe 'active' de todos os itens primeiro
        navItems.removeClass('active');

        let activeAnchorId = '';

        // 1. Encontra a seção que está mais próxima do centro da viewport
        sections.each(function () {
            const section = $(this);
            const sectionTop = section.offset().top;
            const sectionBottom = sectionTop + section.outerHeight();
            const sectionCenter = sectionTop + section.outerHeight() / 2;

            const viewportTop = scrollPosition;
            const viewportBottom = scrollPosition + $(window).height();

            // Verifica se a seção está visível na viewport
            if (viewportBottom > sectionTop && viewportTop < sectionBottom) {

                // Usa a distância do centro como critério de "active"
                const distance = Math.abs(viewportCenter - sectionCenter);

                // Mantemos a seção mais próxima do centro
                if (activeAnchorId === '' || distance < closestDistance) {
                    closestDistance = distance;
                    activeAnchorId = section.attr('id'); // Pega o ID da seção (ex: 'reviews')
                }
            }
        });

        // 2. Se uma seção ativa foi encontrada, encontra o item de menu correspondente
        if (activeAnchorId) {
            // Encontra o item de menu cujo link (href) termina com o ID da seção
            $(`#nav_list a[href$="#${activeAnchorId}"]`).parent().addClass('active');
            $(`#mobile_nav_list a[href$="#${activeAnchorId}"]`).parent().addClass('active');
        }
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


});

