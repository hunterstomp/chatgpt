export const absUrl = (u?: string) =>
  !u ? null : /^https?:\/\//i.test(u) ? u : `https://portfolio.q10ux.com${u.startsWith('/')?'':'/'}${u}`;
