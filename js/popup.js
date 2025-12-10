window.addEventListener('load', () => {
      const popup = document.getElementById('discount-popup');
      const closeButtons = document.querySelectorAll('.discount-close');

      if (!popup) return;
      popup.classList.remove('d-none'); // Mostrar sempre en carregar

      // Si només el vols 1 cop, fes servir això en lloc de la línia anterior:
      // if (!localStorage.getItem('rekom_discount_closed')) {
      //   popup.classList.remove('d-none');
      // }

      const closePopup = () => {
        popup.classList.add('d-none');
        // localStorage.setItem('rekom_discount_closed', '1');
      };

      closeButtons.forEach(btn =>
        btn.addEventListener('click', closePopup)
      );

      // Tancar si cliques fora del popup
      popup.addEventListener('click', e => {
        if (e.target === popup) {
          closePopup();
        }
      });
    });