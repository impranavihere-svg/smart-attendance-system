export function buildSessionMap(sessions) {
  return sessions.reduce((map, session) => {
    map[session.id] = session;
    return map;
  }, {});
}
