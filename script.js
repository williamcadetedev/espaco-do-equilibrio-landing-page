// Menu de navegação mobile
const menuButton = document.querySelector('.nav-toggle')
const navigation = document.querySelector('.main-nav')

if (menuButton && navigation) {
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false')
    menuButton.setAttribute('aria-label', 'Abrir menu')
    navigation.classList.remove('is-open')
  }

  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true'
    menuButton.setAttribute('aria-expanded', String(!isExpanded))
    menuButton.setAttribute('aria-label', isExpanded ? 'Abrir menu' : 'Fechar menu')
    navigation.classList.toggle('is-open', !isExpanded)
  })

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu()
  })
}

// Atualiza automaticamente o ano do rodapé
const currentYear = document.getElementById('current-year')

if (currentYear) {
  currentYear.textContent = new Date().getFullYear()
}

// Abre e fecha os detalhes dos atendimentos
const serviceCards = document.querySelectorAll(
  '.service-card:not(.service-card-contact)'
)

const closeServiceDetail = (card, restoreFocus = false) => {
  const trigger = card.querySelector('.service-more')
  const panel = card.querySelector('.service-detail-popover')

  if (!trigger || !panel) return

  trigger.setAttribute('aria-expanded', 'false')
  panel.hidden = true
  card.classList.remove('is-detail-open')

  if (restoreFocus) trigger.focus()
}

serviceCards.forEach((card) => {
  const trigger = card.querySelector('.service-more')
  const panel = card.querySelector('.service-detail-popover')

  if (!trigger || !panel) return

  trigger.addEventListener('click', () => {
    const shouldOpen = trigger.getAttribute('aria-expanded') !== 'true'

    serviceCards.forEach((otherCard) => {
      if (otherCard !== card) closeServiceDetail(otherCard)
    })

    trigger.setAttribute('aria-expanded', String(shouldOpen))
    panel.hidden = !shouldOpen
    card.classList.toggle('is-detail-open', shouldOpen)
  })
})

// Fecha o detalhe aberto ao pressionar Escape
// e devolve o foco ao botão que o abriu.
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return

  const openCard = document.querySelector('.service-card.is-detail-open')

  if (openCard) {
    closeServiceDetail(openCard, true)
  }
})

// Elementos que recebem animação ao entrar na área visível
const revealTargets = document.querySelectorAll([
  '.hero-copy',
  '.hero-photo',
  '.welcome .section-heading',
  '.welcome .welcome-copy',
  '.welcome .care-ribbon',
  '.services-section .section-title-row',
  '.services-grid > .service-card',
  '.products-intro',
  '.product-feature',
  '.rental-copy',
  '.rental-gallery',
  '.reviews-heading',
  '.review-card',
  '.faq-heading',
  '.faq-list > details'
].join(', '))

const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches

if (
  !prefersReducedMotion &&
  'IntersectionObserver' in window &&
  revealTargets.length
) {
  revealTargets.forEach((target) => {
    target.classList.add('scroll-reveal')
  })

  // Pequeno intervalo entre os elementos de cada grupo.
  const staggeredGroups = [
    document.querySelectorAll('.services-grid > .service-card'),
    document.querySelectorAll('.faq-list > details')
  ]

  staggeredGroups.forEach((group) => {
    group.forEach((element, index) => {
      const delay = `${Math.min(index, 4) * 65}ms`
      element.style.setProperty('--reveal-delay', delay)
    })
  })

  document.documentElement.classList.add('has-scroll-reveal')

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -5% 0px'
  })

  revealTargets.forEach((target) => {
    revealObserver.observe(target)
  })
}
