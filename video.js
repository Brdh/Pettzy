// script.js

// 1. Seleciona o elemento de vídeo pelo ID
const demoVideo = document.getElementById('meuVideoDemo');

if (demoVideo) {
    // 2. Garante que o vídeo esteja MUDO, o que é necessário para autoplay
    // e impede que o navegador bloqueie o início da reprodução.
    demoVideo.muted = true;
    
    // 3. Cria um novo Intersection Observer
    // Ele vai monitorar quando o vídeo entrar na área visível
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            // Se o vídeo estiver INTERSECTANDO (visível na tela)
            if (entry.isIntersecting) {
                // Tenta dar PLAY
                demoVideo.play().catch(error => {
                    console.warn('Falha ao iniciar o play automático, o usuário precisará clicar.', error);
                });
            } else {
                // Se o vídeo NÃO estiver mais visível, DÁ PAUSE
                demoVideo.pause();
                // Opcional: Volta o vídeo para o começo ao sair da tela
                // demoVideo.currentTime = 0; 
            }
        });
    }, {
        // Opções do Observer:
        threshold: 0.5 // 0.5 significa que o vídeo deve estar 50% visível para o play/pause acontecer
    });

    // Inicia a observação no elemento de vídeo
    observer.observe(demoVideo);
} else {
    console.error('Elemento de vídeo (meuVideoDemo) não encontrado!');
}


// Opcional: Integração com o ScrollReveal (se você ainda quiser a animação)
ScrollReveal().reveal('.reveal-video', {
    delay: 300,
    distance: '20px',
    origin: 'bottom',
    interval: 100
});

// ... (Outros códigos JavaScript do seu projeto, como o carrossel, vêm aqui) ...