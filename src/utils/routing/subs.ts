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
