export const EntryAnimations = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 1 }
  },
  spin: {
    initial: { opacity: 0, rotate: -360, scale: 0.5 },
    animate: { opacity: 1, rotate: 0, scale: 1 },
    exit: { opacity: 0, rotate: 360, scale: 0.5 },
    transition: { type: 'spring', stiffness: 200, damping: 30}
  },
  drop: {
    initial: { opacity: 0, y: -1000 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, rotate: 180, y: 300 },
    transition: { type: 'tween', duration: 0.5, ease: 'easeIn' }
  }
}

export const HitAnimations = {
  shake: {
    keyframes: { x: [0, -20, 20, -20, 20, 0] },
    options: { duration: 0.4, ease: 'easeInOut' }
  },
  flash: {
    keyframes: { opacity: [1, 0, 1, 0, 1] },
    options: { duration: 0.4, ease: 'easeInOut' }
  },
  bounce: {
    keyframes: { y: [0, -30, 0, -15, 0] },
    options: { duration: 0.5, ease: 'easeInOut' }
  },
  squish: {
  keyframes: { scaleY: [1, 0.7, 1], y: [0, 30, 0] },
  options: { duration: 0.25, ease: 'easeInOut' }
  }
}