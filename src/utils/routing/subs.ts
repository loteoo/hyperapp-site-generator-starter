import fx from '/utils/fx'

export const onRouteChanged = fx((dispatch, action) => {
  const handleLocationChange = () => {
    dispatch([action, window.location.pathname + window.location.search])
  }
  addEventListener('pushstate', handleLocationChange)
  addEventListener('popstate', handleLocationChange)
  return () => {
    removeEventListener('pushstate', handleLocationChange)
    removeEventListener('popstate', handleLocationChange)
  }
})



let observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // @ts-expect-error
        const event = new CustomEvent('linkenteredviewport', { detail: entry.target.dataset.path });
        dispatchEvent(event)
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.5
  }
);

const subRunner = (dispatch, action) => {
  const handleLinkEnteredViewport = (ev) => {
    dispatch(action, ev.detail)
  }
  addEventListener('linkenteredviewport', handleLinkEnteredViewport)
  return () => {
    removeEventListener('linkenteredviewport', handleLinkEnteredViewport)
  }
}

export const onLinkEnteredViewPort = ({
  selector,
  action
}) => {

  // After each render
  setTimeout(() => {
    requestAnimationFrame(() => {

      // TODO: research if having the same element observed many times is an issue and how to avoid this
      document.querySelectorAll(selector).forEach(link => {
        observer.observe(link)
      });
    })
  });

  return [
    subRunner,
    action
  ]
}


