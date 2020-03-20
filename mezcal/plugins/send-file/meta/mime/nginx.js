export const source = 'https://hg.nginx.org/nginx/raw-file/default/conf/mime.types';

export const parser = file =>
  file
    .split(/\n/)
    .slice(2, -2)
    .join(' ')
    .split(';')
    .filter(it => it)
    .map(it => it.split(' ').filter(i => i))
    .map(([mime, ...extensions]) => ({ mime, extensions }));
